const Grid = require("../../models/grid");
const { visualizeGrid } = require("../../models/grid.visualisation");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dungeon")
        .setDescription("generate a dungeon to explore")
        .addIntegerOption((option) =>
            option
                .setName(`size`)
                .setDescription(`the size of the dungeon`)
                .setRequired(true)
        ),
    async execute(interaction, client) {
        //reply pending
        await interaction.deferReply({ ephemeral: false });
        const target = interaction.user;
        const size = interaction.options.getInteger("size");
        const dungeon = new Grid(size);
        dungeon.generateGrid();
        const dungeonString = visualizeGrid.call(dungeon);

        console.log(dungeon);
        console.log(dungeonString);
        console.log(dungeon.grid[0][0]);

        //create message
        const message = `> <@${target.id}> • **dungeon**`;

        //create embed
        const embed = new EmbedBuilder()
            .setDescription(`Successfully generated a dungeon`)
            .setFields({ name: `Dungeon`, value: dungeonString, inline: false })
            .setColor(0x62b8f3);

        await interaction.followUp({
            content: message,
            embeds: [embed],
        });
    },
};
