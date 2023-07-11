const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
    name: "emptyChannel",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            () => {};
        }

        const embed = new EmbedBuilder();

        embed.setDescription(`Музыка была остановлена потому что ${formatMS(config.leaveOnEmptyDelay)} был пустой.`);
        embed.setColor(config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};

function formatMS(ms) {
    var s = Math.floor(ms / 1000) % 60;
    var m = Math.floor(ms / (1000 * 60)) % 60;
    var h = Math.floor(ms / (1000 * 60 * 60));

    var str = "";

    if (h > 0) str += `${h} час${h > 1 ? "s" : ""}`;
    if (h > 0 && m > 0) str += ", ";
    if (h > 0 && s > 0) str += " и ";
    if (m > 0) str += `${m} минут${m > 1 ? "s" : ""}`;
    if (m > 0 && s > 0) str += " и ";
    if (s > 0) str += `${s} секунд${s > 1 ? "s" : ""}`;

    if (str.length > 0) str += " канал";

    return str;
}
