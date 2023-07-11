const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "shiru_back_song",
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

        if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("Перед этим треком музыка не играла.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        await queue.history.back();
        embed.setDescription(`<@${interaction.user.id}>: Возврат к предыдущей песне в очереди.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
