const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player, useMasterPlayer, QueryType } = require("discord-player");
const logger = require("../../utils/logger");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Добавить песню в очередь.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("query").setDescription("Введите название трека, автора или URL (__стримы 24/7 могут не поддерживаться__).").setRequired(true).setAutocomplete(config.autocomplete)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            embed.setDescription("Вы должны находиться в голосовом канале.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("У меня нет доступа к данному голосовому каналу.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("query");

        const player = Player.singleton(client);
        let queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            player.nodes.create(interaction.guild.id, {
                leaveOnEmptyCooldown: config.leaveOnEmptyDelay,
                leaveOnEndCooldown: config.leaveOnEndCooldown,
                leaveOnStopCooldown: config.leaveOnStopCooldown,
                selfDeaf: config.deafenBot,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
            });
        }

        queue = player.nodes.get(interaction.guild.id);

        try {
            const res = await player.search(query, {
                requestedBy: interaction.user,
            });

            if (!res || !res.tracks || res.tracks.length === 0) {
                if (queue) queue.delete();
                embed.setDescription(`Я ничего не смог найти с названием: **${query}**.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch (err) {
                if (queue) queue.delete();
                embed.setDescription("Я не могу зайти в этот голосовой чат.");
                return await interaction.editReply({ embeds: [embed] });
            }

            try {
                res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
                if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
            } catch (err) {
                logger.error("Ошибка :warning:");
                logger.error(err);

                await queue.delete();

                embed.setDescription("Ошибка :warning:.");
                return await interaction.followUp({ embeds: [embed] });
            }

            if (!res.playlist) {
                embed.setDescription(`Добавлена в очередь песня: **[${res.tracks[0].title}](${res.tracks[0].url})** \nАвтор: **${res.tracks[0].author}**`);
                embed.setThumbnail(queue.currentTrack.thumbnail);
            } else {
                embed.setDescription(`**Добавлено ${res.tracks.length} песня(-ен)** из ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** была(-и) загружены из очередь.`);
            }
        } catch (err) {
            logger.error(err);
            return interaction.editReply({ content: "Ошибка :warning:." });
        }

        return await interaction.editReply({ embeds: [embed] });
    },
    async autocompleteRun(interaction) {
        const player = useMasterPlayer();
        const query = interaction.options.getString("query", true);
        const resultsYouTube = await player.search(query, { searchEngine: QueryType.YOUTUBE });
        const resultsSpotify = await player.search(query, { searchEngine: QueryType.SPOTIFY_SEARCH });

        const tracksYouTube = resultsYouTube.tracks.slice(0, 5).map((t) => ({
            name: `YouTube: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
            value: t.url,
        }));

        const tracksSpotify = resultsSpotify.tracks.slice(0, 5).map((t) => ({
            name: `Spotify: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
            value: t.url,
        }));

        const tracks = [];

        tracksYouTube.forEach((t) => tracks.push({ name: t.name, value: t.value }));
        tracksSpotify.forEach((t) => tracks.push({ name: t.name, value: t.value }));

        return interaction.respond(tracks);
    },
};
