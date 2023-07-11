const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Показать статистику бота."),
    async execute(interaction, client) {
        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        const embed = new EmbedBuilder();
        embed.setDescription(`<a:Gears_Loading:1106545768438964266> Бот находится на **${client.guilds.cache.size} серверах**\n<a:deezer:1104386540672659586> Проиграно **${data["songs-played"]} песен**\n<:Skip:1104391857913483274> Пропущено **${data["songs-skipped"]} песен**\n<:shuffle:1104390047526039552> Перемешано **${data["queues-shuffled"]} очередей**.`);
        embed.setColor(config.embedColour);

        return await interaction.reply({ embeds: [embed] });
    },
};
