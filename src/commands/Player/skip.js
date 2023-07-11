const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Пропустить текущую песню.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.skip();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["songs-skipped"] += 1;

        embed.setDescription(`<:Skip:1104391857913483274> Песня **[${queue.currentTrack.title}](${queue.currentTrack.url})** была пропущена.`);

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        return await interaction.reply({ embeds: [embed] });
    },
};
