const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("clear").setDescription("Удалить все песни из очереди.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
        } else if (!queue.tracks.toArray()[0]) {
            embed.setDescription("Других треков в очереди нет. Используйте **/stop**, чтобы остановить текущий трек.");
        } else {
            queue.tracks.clear();
            embed.setDescription("<a:verify:1104322754704064583> Очередь на сервере была очищена.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
