/* made by snow.ded - getto */

const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "report",
  aliases: [],
  cooldown: "1800",
  category: "information",
  usage: "",
  description: "Shows bug report options",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button().secondary(`report`, `Report an issue`, emoji.bug),
      new client.button().danger(`end`, ``, `<:gettostop:1277360986025627658>`),
    );
    let m = await message.reply({
      embeds: [
        new client.embed().desc(`${emoji.bell} **Click to show report modal**`),
      ],
      components: [row],
    });
    const modal = new ModalBuilder()
      .setCustomId("report")
      .setTitle("Report an issue");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("command")
          .setPlaceholder("Enter command name that's causing the issue")
          .setLabel("Command name")
          .setMaxLength(15)
          .setStyle(TextInputStyle.Paragraph)

          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("issue")
          .setPlaceholder("Describe the problem you are facing")
          .setLabel("Describe the issue")
          .setMaxLength(400)
          .setStyle(TextInputStyle.Paragraph)

          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("comments")
          .setPlaceholder("// Additional comments . . .")
          .setLabel("Additional Comments")
          .setMaxLength(200)
          .setStyle(TextInputStyle.Paragraph)

          .setRequired(false),
      ),
    );

    const filter = async (interaction) => {
      if (interaction.user.id === message.author.id) {
        return true;
      }
      await interaction
        .reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} Only **${message.author.tag}** can use this`,
            ),
          ],
          ephemeral: true,
        })
        .catch(() => {});
      return false;
    };
    const collector = m?.createMessageComponentCollector({
      filter: filter,
      time: 60000,
      idle: 30000 / 2,
    });
    collector?.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "report":
          await interaction.showModal(modal);
          break;
        case "end":
          await interaction.deferUpdate();
          await collector.stop();
          await m
            .edit({
              embeds: [
                new client.embed().desc(
                  `${emoji.danger} **Reporting operation cancelled by user**`,
                ),
              ],
              components: [],
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    });

    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await m
          .edit({
            embeds: [
              new client.embed()
                .desc(`${emoji.bell} **Click to show report modal**`)
                .setFooter({ text: "Command timed out !" }),
            ],
            components: [],
          })
          .catch(() => {});
    });
    //let modalSubmit event handle the rest [events/custom/modalSubmit.js]
  },
};
