const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Перемешать очередь.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Сейчас ничего не играет.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.tracks.toArray()[0]) {
            embed.setDescription("Сейчас ничего не играет. Используйте **/play**, чтобы включить музыку");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.tracks.shuffle();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["queues-shuffled"] += 1;

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        embed.setDescription(queue.tracks.length === 1 ? `<:shuffle:1104390047526039552> Песнz успешно перемешана **${queue.tracks.toArray().length}**!` : `<:shuffle:1104390047526039552> Песни успешно перемешаны **${queue.tracks.toArray().length}**!`);
        return await interaction.reply({ embeds: [embed] });
    },
};
