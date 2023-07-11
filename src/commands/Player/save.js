const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("save").setDescription("Сохранить песню себе в лс.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        const info = new EmbedBuilder();
        info.setColor(config.embedColour);

        info.setTitle("Песня сохранена");

        var message = `
            **<:Purple_Play_icon:1104391910631669810> Название песни:** [${queue.currentTrack.title}](${queue.currentTrack.url})
            **:singer: Автор:** ${queue.currentTrack.author}
            **<a:loop:1104391809716719708> Время:** ${queue.currentTrack.duration}\n`;

        if (queue.currentTrack.playlist) {
            message += `**<:info_blue:1104393088698437652> Плейлист:** [${queue.currentTrack.playlist.title}](${queue.currentTrack.playlist.url})\n`;
        }

        message += `**<a:verify:1104322754704064583> Сохранено:** <t:${Math.round(Date.now() / 1000)}:R>`;

        info.setDescription(message);
        info.setThumbnail(queue.currentTrack.thumbnail);
        info.setFooter({ text: `<a:deezer:1104386540672659586> Песня сохранена с сервера ${interaction.guild.name}` });
        info.setTimestamp();

        try {
            await interaction.user.send({ embeds: [info] });
        } catch (err) {
            embed.setDescription("Я не могу отправить вам сообщение в лс. Посмотрите настройки приватности и попробуйте снова");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        embed.setDescription("Песня отправлена вам в личные сообщения!");

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
