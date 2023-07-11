const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "shiru_pause_song",
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        queue.node.setPaused(!queue.node.isPaused());

        embed.setDescription(`<@${interaction.user.id}>, Песня **[${queue.currentTrack.title}](${queue.currentTrack.url})** ${queue.node.isPaused() ? "поставлена на паузу" : "снята с паузы"}.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
