const { EmbedBuilder } = require("discord.js");
const logger = require("../../utils/logger");
const config = require("../../config");

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, client);
            } catch (error) {
                logger.error("An error occurred whilst attempting to execute a chat input command:");
                logger.error(error);
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.includes("-")) {
                const dashIndex = interaction.customId.indexOf("-");
                const button = client.buttons.get(interaction.customId.substring(0, dashIndex));
                if (!button) return;
                try {
                    await button.execute(interaction, client);
                } catch (error) {
                    logger.error("An error occurred whilst attempting to execute a button command:");
                    logger.error(error);
                }
            } else {
                const button = client.buttons.get(interaction.customId);
                if (!button) return;
                try {
                    await button.execute(interaction, client);
                } catch (error) {
                    logger.error("An error occurred whilst attempting to execute a button command:");
                    logger.error(error);
                }
            }
        } else if (interaction.isStringSelectMenu()) {
            const buttonOwner = interaction.customId.substring(interaction.customId.length - 18, interaction.customId.length);

            const embed = new EmbedBuilder();
            embed.setColor(config.embedColour);

            if (interaction.user.id != buttonOwner) {
                embed.setDescription(`Только <@${buttonOwner}> может воспользоваться меню.`);
                return await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            if (interaction.values[0] == "shiru_help_category_general") {
                embed.setAuthor({ name: "Меню помощи" });
                embed.setTitle("<a:Gears_Loading:1106545768438964266> Основные команды");
                embed.setDescription("**/help** - Посмотреть доступные команды.\n**/stats** - Посмотреть статистику бота.");
            } else if (interaction.values[0] == "shiru_help_category_music") {
                embed.setAuthor({ name: "Меню помощи" });
                embed.setTitle("<:Purple_Play_icon:1104391910631669810> Музыкальные команды");
                embed.setDescription("**/play** - Включить музыку.\n**/playnext** - Включить следующую песню из очереди.\n**/playshuffle** - Перемешать список плейлиста, а затем добавить все треки в конец очереди.\n**/pause** - Поставить музыку на паузу.\n**/resume** - Возобновить песню.\n**/stop** - Остановить песню.\n**/skip** - Пропустить песню.\n**/back** - Включить предыдущую музыку из очереди.\n**/seek** - Перемотать музыку.\n**/nowplaying** - Посмотреть информацию о песне.\n**/queue** - Посмотреть очередь.\n**/clear** - Очистить очередь.\n**/shuffle** - Перемешать очередь.\n**/loop** - Зациклить музыку.\n**/volume** - Установить громкость музыки.\n**/lyrics** - Найти текст песни.\n**/save** - Сохранить песню к себе в лс.");
            } else if (interaction.values[0] == "shiru_help_category_effects") {
                embed.setAuthor({ name: "Меню помощи" });
                embed.setTitle(":control_knobs: Эффекты");
                embed.setDescription("**/8d** - Применить эффект 8D к песне.\n**/bassboost** - Применить эффект bassboost к песне.\n**/chorus** - Применить эффект chorus к песне.\n**/compressor** - Применить эффект compressor к песне.\n**/expander** - Применить эффект expander к песне.\n**/flanger** - Применить эффект flanger к песне.\n**/nightcore** - Применить эффект nightcore к песне.\n**/normalizer** - Применить эффект normalizer к песне.\n**/phaser** - Применить эффект phaser к песне.\n**/reverse** - Применить эффект reverse к песне.\n**/surround** - Применить эффект surround к песне.\n**/vaporwave** - Применить эффект vaporwave к песне.");
            }

            return await interaction.update({ embeds: [embed] });
        } else if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.autocompleteRun(interaction, client);
            } catch (error) {
                logger.error("An error occurred whilst attempting to run autocomplete:");
                logger.error(error);
            }
        }
    },
};
