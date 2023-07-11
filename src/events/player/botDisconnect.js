const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
    name: "disconnect",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            () => {};
        }

        const embed = new EmbedBuilder();
        embed.setDescription("Музыка была остановлена и я покинула голосовой канал.");
        embed.setColor(config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
