const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("back").setDescription("Вернуться к предыдущему треку.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
        } else if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("Перед этой песней ничего не играло.");
        } else {
            await queue.history.back();
            embed.setDescription("<:forward:1104390985087201380> Включаем песню, которая была до этой песни в очереди.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
