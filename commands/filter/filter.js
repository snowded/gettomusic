/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");
const buttonData = require("@assets/filterButtonData.js");

module.exports = {
  name: "filter",
  aliases: ["f"],
  cooldown: "",
  category: "filter",
  usage: "",
  description: "Choose a filter to apply",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const player = await client.getPlayer(message.guild.id);

    let page = 0;
    let rows = [];

    let buttons = [
      ...buttonData.map((data) => {
        return new client.button()[`${data.style.toLowerCase()}`](
          data.customId,
          data.label,
        );
      }),
    ];

    for (let i = 0; i < buttons.length; i += 4) {
      const components = buttons.slice(i, i + 4);
      const row = new ActionRowBuilder().addComponents(...components);
      rows.push(row);
    }

    if (buttons.length % 4 !== 0) {
      const remainingComponents = buttons.slice(
        buttons.length - (buttons.length % 4),
      );
      const remainingRow = new ActionRowBuilder().addComponents(
        ...remainingComponents,
      );
      rows.push(remainingRow);
    }

    const pages = [
      [rows[0], rows[1], rows[2], rows[6]],
      [rows[3], rows[4], rows[5], rows[6]],
    ];

    const m = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.cog} **Select filter by clicking one of the buttons**\n\n` +
              `*May take around 2-5sec to load*`,
          ),
        ],
        components: pages[page],
      })
      .catch(() => {});

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
      time: 20000,
      idle: 20000 / 2,
    });

    collector?.on("collect", async (interaction) => {
      if (!interaction.replied || !interaction.deffered)
        await interaction.deferUpdate().catch(() => {});

      switch (interaction.customId) {
        case "previous":
          page = page > 0 ? --page : pages.length - 1;
          await m.edit({ components: pages[page] }).catch(() => {});
          break;

        case "next":
          page = page + 1 < pages.length ? ++page : 0;
          await m.edit({ components: pages[page] }).catch(() => {});
          break;

        default:
          await player.filter(`${interaction.customId}`);
          await m
            .edit({
              embeds: [
                new client.embed().desc(
                  `${emoji.cog} **Optimizing and applying filter**`,
                ),
              ],
              components: [],
            })
            .then(async (m) => {
              setTimeout(async () => {
                await m
                  .edit({
                    embeds: [
                      new client.embed().desc(
                        `${emoji.yes} **Successfully applied filter \`${interaction.customId}\`**`,
                      ),
                    ],
                  })
                  .catch(() => {});
              }, 2000);
            })
            .catch(() => {});
          break;
      }
    });

    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await m
          .edit({
            embeds: [
              new client.embed().desc(
                `${emoji.cool} **Timed out ! Rolling back filter payloads**`,
              ),
            ],
            components: [],
          })
          .then(async (fb) =>
            setTimeout(async () => {
              await fb
                .edit({
                  embeds: [
                    new client.embed().desc(
                      `${emoji.yes} **No changes applied to filter/(s)**\n`,
                    ),
                  ],
                  components: [],
                })
                .catch(() => {});
            }, 2000),
          )
          .catch(() => {});
    });
  },
};
