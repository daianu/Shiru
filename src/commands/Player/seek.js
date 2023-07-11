const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Перемотать песню.")
        .setDMPermission(false)
        .addIntegerOption((option) => option.setName("minutes").setDescription("минут.").setRequired(true))
        .addIntegerOption((option) => option.setName("seconds").setDescription("секунд.").setRequired(true)),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        const minutes = interaction.options.getInteger("minutes");
        const seconds = interaction.options.getInteger("seconds");

        const newPosition = minutes * 60 * 1000 + seconds * 1000;

        queue.node.seek(newPosition);

        embed.setDescription(`<:Skip:1104391857913483274> Песня перемотана на **${minutes !== 0 ? `${minutes} ${minutes == 1 ? "минуту" : "минут"} и ` : ""} ${seconds} ${seconds == 1 ? "секунду" : "секунд"}**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
