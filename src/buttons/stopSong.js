const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "shiru_stop",
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

        queue.delete();
        embed.setDescription(`<@${interaction.user.id}>, Песня остановлена.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
