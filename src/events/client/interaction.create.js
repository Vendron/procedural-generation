const {
    InteractionType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        const { user } = interaction;
        const { commands } = client;
        const { commandName } = interaction;
        const command = commands.get(commandName);
        //let isDeveloper = command.devOnly || false;
        const date = new Date();

        // Error reply message
        async function errorReply(interaction, commandName, error) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    iconUrl: `https://cdn.discordapp.com/emojis/1005493779932925952.png`,
                    name: `Looks like something went wrong`,
                })
                .setDescription(
                    `An error occurred while running ${commandName}\n**${error}**`
                )
                .setColor(0xd55a5c);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel(`Support Server`)
                    .setURL(`https://discord.gg/ztYgCrEPWD`)
                    .setStyle(ButtonStyle.Link)
            );
            await interaction.followUp({
                embeds: [embed],
                components: [row],
                ephemeral: true,
            });
        }

        // Log command usage
        function consoleStatement(interaction, commandName, commandType) {
            console.log(
                chalk.gray(`${date.toGMTString().replace(/^\S+\s/, "")} `) +
                    chalk.cyanBright(
                        `(${commandType}) ${commandName} used by ${interaction.user.username} ${interaction.user.id} in ${interaction.guild.name} ${interaction.guild.id}`
                    )
            );
        }

        /*if (isDeveloper === true && interaction.user.id !== "508455796783317002") {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("You do not have permission to use this command")
              .setColor(0xd55a5c),
          ],
          components: [],
        });
      } else */
        if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return console.log("[DEV] This button is empty");
            try {
                await button.execute(interaction, client, user);
            } catch (err) {
                console.error(err);
                await errorReply(interaction, commandName, err);
            }
            //if select menu
        }

        if (interaction.isStringSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);
            if (!menu) return console.log("[DEV] This menu is empty");
            try {
                await menu.execute(interaction, client, user);
                consoleStatement(interaction, commandName, "S");
            } catch (err) {
                console.error(err);
                await errorReply(interaction, commandName, err);
            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId);
            if (!modal) return console.log("[DEV] This modal is empty");
            try {
                await modal.execute(interaction, client, user);
                consoleStatement(interaction, commandName, "M");
            } catch (err) {
                console.error(err);
                await errorReply(interaction, commandName, err);
            }
        }

        /**
         * @brief Run slash commands
         * @description Execute slash commands and log them to the console
         */
        if (interaction.isChatInputCommand()) {
            if (!command) return;

            try {
                const userOption = interaction.options._hoistedOptions.find(
                    (option) => option.name === "user"
                );
                const args = userOption
                    ? {
                          user: {
                              id: userOption.value,
                              username: userOption.user.username,
                              discriminator: userOption.user.discriminator,
                          },
                      }
                    : {};
                await command.execute(interaction, client, user);
                consoleStatement(interaction, commandName, "S");
            } catch (err) {
                console.error(err);
                await errorReply(interaction, commandName, err);
                /*const channel = client.channels.cache.get(`1048969681861615635`)
            await channel.send({
              content: `<@${interaction.user.id}> (${interaction.user.id}) in ${interaction.guild.name} (${interaction.guild.id}) had an error \n\`\`\`js${err}\`\`\``,
            });*/
            }
        }
    },
};
