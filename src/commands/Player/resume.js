const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Возообновить песню.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.node.isPaused()) {
            embed.setDescription("Очередь поставлена на паузу.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(false);

        embed.setDescription(`<:Purple_Play_icon:1104391910631669810> Успешно снята с паузы песня **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
