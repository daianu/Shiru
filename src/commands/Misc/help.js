const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Посмотреть доступные команды."),
    async execute(interaction) {
        const embed = new EmbedBuilder();
        embed.setTitle("Меню помощи");
        embed.setDescription("Выберите категорию, чтобы посмотреть доступные команды.");
        embed.setColor(config.embedColour);

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId(`shiru_help_category_select_${interaction.user.id}`).setPlaceholder("Выберите категорию, чтобы посмотреть команды.").addOptions(
                {
                    label: "Основные конмады",
                    description: "Команды не относящиеся к музыке.",
                    value: "shiru_help_category_general",
                },
                {
                    label: "Музыкальные команды",
                    description: "Команды относящиеся к музыке.",
                    value: "shiru_help_category_music",
                },
                {
                    label: "Эффекты",
                    description: "Эффекты применяемые к музыке.",
                    value: "shiru_help_category_effects",
                }
            )
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
