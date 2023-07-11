const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("bassboost").setDescription("Применить эффект bassboost к музыке.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
        } else {
            queue.filters.ffmpeg.toggle(["bassboost"]);
            embed.setDescription(`Эффект **bassboost** сейчас ${queue.filters.ffmpeg.filters.includes("bassboost") ? "включён." : "выключен."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
