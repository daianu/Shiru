const { SlashCommandBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("Посмотреть очередь песен.").setDMPermission(false),
    async execute(interaction, client) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        const queuedTracks = queue.tracks.toArray();

        if (!queuedTracks[0]) {
            embed.setDescription("Сейчас в очереди нет песен. Используйте **/nowplaying**, чтобы посмотреть очередь песен");
            return await interaction.reply({ embeds: [embed] });
        }

        embed.setThumbnail(queue.currentTrack.thumbnail);


        const tracks = queuedTracks.map((track, i) => {
            return `\`${i + 1}\` [${track.title}](${track.url}) автор: **${track.author}** (Запросил: <@${track.requestedBy.id}>)`;
        });
        const songs = queuedTracks.length;
        const nextSongs = songs > 5 ? `И **${songs - 5}** других ${songs - 5 > 1 ? "песен" : "песня"} сейчас в очереди.` : "";
        const progress = queue.node.createProgressBar();

        embed.setDescription(`**Сейчас играет:** [${queue.currentTrack.title}](${queue.currentTrack.url}) автор: **${queue.currentTrack.author}**\n${progress}\n\n${tracks.slice(0, 5).join("\n")}\n\n${nextSongs}`);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song-${interaction.user.id}`)
                .setEmoji(config.backEmoji.length <= 3 ? { name: config.backEmoji.trim() } : { id: config.backEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song-${interaction.user.id}`)
                .setEmoji(config.pauseEmoji.length <= 3 ? { name: config.pauseEmoji.trim() } : { id: config.pauseEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song-${interaction.user.id}`)
                .setEmoji(config.pauseEmoji.length <= 3 ? { name: config.skipEmoji.trim() } : { id: config.skipEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop-${interaction.user.id}`)
                .setEmoji(config.stopEmoji.length <= 3 ? { name: config.stopEmoji.trim() } : { id: config.stopEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics-${interaction.user.id}`)
                .setEmoji(config.lyricsEmoji.length <= 3 ? { name: config.lyricsEmoji.trim() } : { id: config.lyricsEmoji.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
