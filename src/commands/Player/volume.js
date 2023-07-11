const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Установить громкость музыки.")
        .setDMPermission(false)
        .addIntegerOption((option) => option.setName("volume").setDescription("установить громкость музыки.").setRequired(true)),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
        } else {
            const vol = interaction.options.getInteger("звук");

            if (queue.node.volume === vol) {
                embed.setDescription(`<:volume_up:1104389301556498442> Звук музыки установлен на ${vol}%.`);
                return await interaction.reply({ embeds: [embed] });
            }

            const maxVolume = 1000;

            if (vol < 0 || vol > maxVolume) {
                embed.setDescription(`Число не правильное. Используйте цифру от **0 до ${maxVolume}**.`);
                return await interaction.reply({ embeds: [embed] });
            }

            const success = queue.node.setVolume(vol);
            success ? embed.setDescription(`<:volume_up:1104389301556498442> Громкость музыки установлена на **${vol}%**.`) : embed.setDescription("Ошибка :warning:");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
