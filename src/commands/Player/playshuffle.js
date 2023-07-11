const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const fs = require("node:fs");
const logger = require("../../utils/logger");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playshuffle")
        .setDescription("Данная команда перемешает вашу очередь.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("playlist").setDescription("Введите URL плейлиста.").setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            embed.setDescription("Вы не в голосовом канале.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("У меня нет доступа к этому голосовому каналу.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("playlist");

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

        const res = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!res) {
            embed.setDescription(`Не удалось найти песню с названием: **${query}**`);
            await queue.delete();
            return await interaction.editReply({ embeds: [embed] });
        }

        if (!res.playlist) {
            embed.setDescription("Указанный запрос не является плейлистом.");
            await queue.delete();
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch (err) {
            if (queue) queue.delete();
            embed.setDescription("Я не могу зайти в этот голосовой канал.");
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            queue.addTrack(res.tracks);
            await queue.tracks.shuffle();
            if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
        } catch (err) {
            logger.error("Ошибка :warning:");
            logger.error(err);

            await queue.delete();

            embed.setDescription("Ошибка :warning:.");
            return await interaction.followUp({ embeds: [embed] });
        }

        const data = fs.readFileSync("src/data.json");
        const parsed = JSON.parse(data);

        parsed["queues-shuffled"] += 1;

        fs.writeFileSync("src/data.json", JSON.stringify(parsed));

        embed.setDescription(`**${res.tracks.length} песен** из ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** были добавлены в очередь сервера.`);

        return await interaction.editReply({ embeds: [embed] });
    },
};
