const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player, QueueRepeatMode } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Зациклить трек.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("mode").setDescription("Режим зацикливания").setRequired(true).addChoices({ name: "off", value: "off" }, { name: "queue", value: "queue" }, { name: "track", value: "track" }, { name: "autoplay", value: "autoplay" })),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);
        const mode = interaction.options.getString("mode");

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
        } else {
            if (mode == "off") {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                embed.setDescription("<a:loop:1104391809716719708> Зацикливание сейчас **выключено**.");
            } else if (mode == "queue") {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                embed.setDescription("<a:loop:1104391809716719708> Очередь будет повторяться бесконечно.");
            } else if (mode == "track") {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                embed.setDescription("<a:loop:1104391809716719708> Песня будет повторяться бесконечно.");
            } else {
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                embed.setDescription("<a:loop:1104391809716719708> Очередь сейчас будет автопроигрываться.");
            }
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
