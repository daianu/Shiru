const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("chorus").setDescription("Применить эффект chorus к музыке.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
        } else {
            queue.filters.ffmpeg.toggle(["chorus"]);
            embed.setDescription(`Эффект **chorus** сейчас ${queue.filters.ffmpeg.filters.includes("chorus") ? "включён." : "выключен."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
