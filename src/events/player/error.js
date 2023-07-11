const { EmbedBuilder } = require("discord.js");
const logger = require("../../utils/logger");
const config = require("../../config");

module.exports = {
    name: "error",
    async execute(queue, error) {
        logger.error("Ошибка :warning:");
        logger.error(error);

        try {
            queue.delete();
        } catch (err) {
            () => {};
        }

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("Ошибка :warning:. Данный формат музыки не поддерживается.");
        errEmbed.setColor(config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
