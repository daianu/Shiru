const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { lyricsExtractor } = require("@discord-player/extractor");
const config = require("../../config");

const lyricsClient = lyricsExtractor(config.geniusKey);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Посмотреть текст песни.")
        .addStringOption((option) => option.setName("query").setDescription("Введите название трека, артиста, URL.").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        await lyricsClient
            .search(interaction.options.getString("query"))
            .then((res) => {
                embed.setAuthor({
                    name: `${res.title} - ${res.artist.name}`,
                    url: res.url,
                });
                embed.setDescription(res.lyrics.length > 4096 ? `[Нажмите, чтобы посмотреть текст](${res.url})` : res.lyrics);
                embed.setFooter({ text: "Текст песни от Genius" });
            })
            .catch(() => {
                embed.setDescription(`Я не нашла трек с названием **${interaction.options.getString("query")}**.`);
            });

        return await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
