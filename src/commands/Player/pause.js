const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Песня поставлена на паузу.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(!queue.node.isPaused());

        embed.setDescription(`<:Purple_Pause_icon:1104391883284807681> Песня **[${queue.currentTrack.title}](${queue.currentTrack.url})** ${queue.node.isPaused() === true ? "поставлена на паузу" : "снята с паузы"}.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
