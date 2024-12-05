/* made by snow.ded - getto */

const genGraph = require("@gen/eqGraph.js");
const { ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "equalizer",
  aliases: ["eq"],
  cooldown: "",
  category: "filter",
  usage: "",
  description: "5-band Eq",
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
    const buttonData = {
      ////////////////////////////////// 2(0.5)-DB ////////////////////////////////////////

      "62.5-plus_2db": {
        customId: "62.5-plus_2db",
        label: "+2",
        style: "SECONDARY",
        disabled: false,
        band: 0,
        gain: 0.5,
      },
      "250-plus_2db": {
        customId: "250-plus_2db",
        label: "+2",
        style: "SECONDARY",
        disabled: false,
        band: 3,
        gain: 0.5,
      },
      "1k-plus_2db": {
        customId: "1k-plus_2db",
        label: "+2",
        style: "SECONDARY",
        disabled: false,
        band: 7,
        gain: 0.5,
      },
      "3.6k-plus_2db": {
        customId: "3.6k-plus_2db",
        label: "+2",
        style: "SECONDARY",
        disabled: false,
        band: 10,
        gain: 0.5,
      },
      "12k-plus_2db": {
        customId: "12k-plus_2db",
        label: "+2",
        style: "SECONDARY",
        disabled: false,
        band: 14,
        gain: 0.5,
      },

      ////////////////////////////////// 1(0.25)-DB ////////////////////////////////////////

      "62.5-plus_1db": {
        customId: "62.5-plus_1db",
        label: "+1",
        style: "SECONDARY",
        disabled: false,
        band: 0,
        gain: 0.25,
      },
      "250-plus_1db": {
        customId: "250-plus_1db",
        label: "+1",
        style: "SECONDARY",
        disabled: false,
        band: 3,
        gain: 0.25,
      },
      "1k-plus_1db": {
        customId: "1k-plus_1db",
        label: "+1",
        style: "SECONDARY",
        disabled: false,
        band: 7,
        gain: 0.25,
      },
      "3.6k-plus_1db": {
        customId: "3.6k-plus_1db",
        label: "+1",
        style: "SECONDARY",
        disabled: false,
        band: 10,
        gain: 0.25,
      },
      "12k-plus_1db": {
        customId: "12k-plus_1db",
        label: "+1",
        style: "SECONDARY",
        disabled: false,
        band: 14,
        gain: 0.25,
      },

      ////////////////////////////////// 0(0)-DB ////////////////////////////////////////

      "62.5-zero_db": {
        customId: "62.5-zero_db",
        label: "0",
        style: "SUCCESS",
        disabled: true,
        band: 0,
        gain: 0,
      },
      "250-zero_db": {
        customId: "250-zero_db",
        label: "0",
        style: "SUCCESS",
        disabled: true,
        band: 3,
        gain: 0,
      },
      "1k-zero_db": {
        customId: "1k-zero_db",
        label: "0",
        style: "SUCCESS",
        disabled: true,
        band: 7,
        gain: 0,
      },
      "3.6k-zero_db": {
        customId: "3.6k-zero_db",
        label: "0",
        style: "SUCCESS",
        disabled: true,
        band: 10,
        gain: 0,
      },
      "12k-zero_db": {
        customId: "12k-zero_db",
        label: "0",
        style: "SUCCESS",
        disabled: true,
        band: 14,
        gain: 0,
      },

      ////////////////////////////////// -1(-0.25)-DB ////////////////////////////////////////

      "62.5-minus_1db": {
        customId: "62.5-minus_1db",
        label: "-1",
        style: "SECONDARY",
        disabled: false,
        band: 0,
        gain: -0.25,
      },
      "250-minus_1db": {
        customId: "250-minus_1db",
        label: "-1",
        style: "SECONDARY",
        disabled: false,
        band: 3,
        gain: -0.25,
      },
      "1k-minus_1db": {
        customId: "1k-minus_1db",
        label: "-1",
        style: "SECONDARY",
        disabled: false,
        band: 7,
        gain: -0.25,
      },
      "3.6k-minus_1db": {
        customId: "3.6k-minus_1db",
        label: "-1",
        style: "SECONDARY",
        disabled: false,
        band: 10,
        gain: -0.25,
      },
      "12k-minus_1db": {
        customId: "12k-minus_1db",
        label: "-1",
        style: "SECONDARY",
        disabled: false,
        band: 14,
        gain: -0.25,
      },

      ////////////////////////////////// 2(-0.5)-DB ////////////////////////////////////////

      "62.5-minus_2db": {
        customId: "62.5-minus_2db",
        label: "-2",
        style: "SECONDARY",
        disabled: false,
        band: 0,
        gain: -0.5,
      },
      "250-minus_2db": {
        customId: "250-minus_2db",
        label: "-2",
        style: "SECONDARY",
        disabled: false,
        band: 3,
        gain: -0.5,
      },
      "1k-minus_2db": {
        customId: "1k-minus_2db",
        label: "-2",
        style: "SECONDARY",
        disabled: false,
        band: 7,
        gain: -0.5,
      },
      "3.6k-minus_2db": {
        customId: "3.6k-minus_2db",
        label: "-2",
        style: "SECONDARY",
        disabled: false,
        band: 10,
        gain: -0.5,
      },
      "12k-minus_2db": {
        customId: "12k-minus_2db",
        label: "-2",
        style: "SECONDARY",
        disabled: false,
        band: 14,
        gain: -0.5,
      },
    };

    const embed = new client.embed()
      .desc(
        `${emoji.cog} **The following is a 5-band equalizer ㅤㅤㅤ ㅤㅤ**\n\n` +
          `**64 hzㅤ 250 hzㅤ 1K hzㅤ 4K hzㅤ 12K hz**`,
      )
      .setFooter({
        text: `Eq will be applied once buttons disappear - 20sec`,
      });

    let button = [
      ...Object.values(buttonData).map((data) => {
        return new client.button()[`${data.style.toLowerCase()}`](
          data.customId,
          data.label,
        );
      }),
    ];

    const rows = [];

    for (let i = 0; i < 5; i++) {
      const row = new ActionRowBuilder();
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        row.addComponents(button[index]);
      }
      rows.push(row);
    }

    const m = await message
      .reply({
        embeds: [embed],
        components: rows,
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

      Object.values(buttonData).map((button) =>
        button.customId == interaction.customId
          ? (button.disabled = true) && (button.style = "SUCCESS")
          : button.customId.includes(interaction.customId.split("-")[0])
            ? (button.style = "SECONDARY") && (button.disabled = false)
            : (button.disabled = button.disabled),
      );

      let updatedButton = [
        ...Object.values(buttonData).map((data) => {
          return new client.button()[`${data.style.toLowerCase()}`](
            data.customId,
            data.label,
            ``,
            data.disabled,
          );
        }),
      ];

      let updatedRows = [];

      for (let i = 0; i < 5; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 5; j++) {
          const index = i * 5 + j;
          row.addComponents(updatedButton[index]);
        }
        updatedRows.push(row);
      }

      await m
        .edit({
          components: updatedRows,
        })
        .catch(() => {});
    });

    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0) {
        await player.shoukaku.setFilters({
          op: "filters",
          guildId: message.guild.id,
          equalizer: [],
        });
        await m
          .edit({
            embeds: [
              new client.embed().desc(
                `${emoji.cool} **Timed out ! Falling back to default profile**`,
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
                      `${emoji.yes} **Equalizer profile set to default - \`Harman 2019\`**\n`,
                    ),
                  ],
                  components: [],
                })
                .catch(() => {});
            }, 2000),
          )
          .catch(() => {});
        return;
      }

      let equalizer = [];
      button_clicked = [];
      for (i = 0; i < m.components.length; i++) {
        let row = m.components[i];
        button_clicked.push(
          await row.components.filter((f) => f.style == ButtonStyle.Success),
        );
      }

      for (i = 0; i < button_clicked.length; i++) {
        for (j = 0; j < button_clicked[i].length; j++) {
          let btn = button_clicked[i][j];
          equalizer.push({
            band: buttonData[btn.customId].band,
            gain: buttonData[btn.customId].gain,
          });
        }
      }

      await player.shoukaku.setFilters({
        op: "filters",
        guildId: message.guild.id,
        equalizer: equalizer,
      });

      await m
        .edit({
          embeds: [
            new client.embed().desc(
              `${emoji.cog} **Optimizing and applying eq . . .**`,
            ),
          ],
          components: [],
        })
        .then(async (m) => {
          equalizer = equalizer.sort((a, b) => a.band - b.band);
          let gains = [...equalizer].map((ele) => ele.gain * 4);

          setTimeout(async () => {
            await m
              .edit({
                embeds: [
                  new client.embed()
                    .desc(
                      `${emoji.yes} **Successfully applied equalizer**\n\n` +
                        `**__Equalizer details : __** `,
                    )
                    .img(await genGraph(gains)),
                ],
                components: [],
              })
              .catch(() => {});
          }, 5000);
        })
        .catch(() => {});
    });
  },
};
