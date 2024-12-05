/* made by snow.ded - getto */

const { AttachmentBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "preset",
  aliases: ["set"],
  cooldown: "",
  category: "config",
  usage: "",
  description: "Choose your playEmbed",
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
    let row = new ActionRowBuilder().addComponents(
      new client.button().secondary(`cards`, `Cards --`, ``, true),
      new client.button().secondary(`cards/card1.js`, `1`),
      new client.button().secondary(`cards/card2.js`, `2`),
      new client.button().secondary(`cards/card3.js`, `3`),
      new client.button().secondary(`cards/card4.js`, `4`, ``, true),
    );
    let row2 = new ActionRowBuilder().addComponents(
      new client.button().secondary(`embeds`, `Embed -`, ``, true),
      new client.button().secondary(`embeds/embed1.js`, `1`),
      new client.button().secondary(`embeds/embed2.js`, `2`),
      new client.button().secondary(`embeds/embed3.js`, `3`),
      new client.button().secondary(`embeds/embed4.js`, `4`, ``, true),
    );

    let row3 = new ActionRowBuilder().addComponents(
      new client.button().success(`confirm`, `Select current preset`, ``, true),
      new client.button().danger(`cancel`, `Cancel Operation`),
    );

    let preset = await client.db.preset.get(
      `${client.user.id}_${message.guild.id}`,
    );

    const path = preset?.replace("js", "png")?.split("/")[1] || `card1.png`;
    let attachment = new AttachmentBuilder(
      `${process.cwd()}/assets/previews/${path}`,
      {
        name: "embed.png",
      },
    );

    const m = await message
      .reply({
        embeds: [
          new client.embed()
            .desc(
              `${emoji.cog} **Current play-embed preset :**\n` +
                `*You can choose a new one using the buttons provided below dont forget to click [**Select**](https://dsc.gg/looney) to save!*`,
            )
            .img(`attachment://${attachment.name}`),
        ],
        files: [attachment],
        components: [row, row2, row3],
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
      time: 60000,
      idle: 30000 / 2,
    });

    let presetPath = null;
    let imagePath = null;
    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      if (
        [
          "cards/card1.js",
          "cards/card2.js",
          "cards/card3.js",
          "cards/card4.js",
          "embeds/embed1.js",
          "embeds/embed2.js",
          "embeds/embed3.js",
          "embeds/embed4.js",
        ].includes(interaction.customId)
      ) {
        presetPath = interaction.customId;
        imagePath = `${process.cwd()}/assets/previews/${presetPath
          .split("/")[1]
          .replace("js", "png")}`;
        attachment = new AttachmentBuilder(imagePath, {
          name: "preview.png",
        });
        let row = new ActionRowBuilder().addComponents(
          new client.button().secondary(`cards`, `Cards --`, ``, true),
          new client.button().secondary(`cards/card1.js`, `1`),
          new client.button().secondary(`cards/card2.js`, `2`),
          new client.button().secondary(`cards/card3.js`, `3`),
          new client.button().secondary(`cards/card4.js`, `4`, ``, true),
        );
        let row2 = new ActionRowBuilder().addComponents(
          new client.button().secondary(`embeds`, `Embed -`, ``, true),
          new client.button().secondary(`embeds/embed1.js`, `1`),
          new client.button().secondary(`embeds/embed2.js`, `2`),
          new client.button().secondary(`embeds/embed3.js`, `3`),
          new client.button().secondary(`embeds/embed4.js`, `4`, ``, true),
        );

        let row3 = new ActionRowBuilder().addComponents(
          new client.button().success(`confirm`, `Select current preset`),
          new client.button().danger(`cancel`, `Cancel Operation`),
        );
        await m
          .edit({
            embeds: [
              new client.embed()
                .title(`${emoji.cog} Choose your play-embed`)
                .img(`attachment://${attachment.name}`),
            ],
            files: [attachment],
            components: [row, row2, row3],
          })
          .catch(() => {});
      }

      if (interaction.customId == "confirm") {
        await client.db.preset.set(
          `${client.user.id}_${message.guild.id}`,
          presetPath,
        );
        imagePath = `${process.cwd()}/assets/previews/${presetPath
          .split("/")[1]
          .replace("js", "png")}`;
        attachment = new AttachmentBuilder(imagePath, {
          name: "preview.png",
        });
        await m
          .edit({
            embeds: [
              new client.embed()
                .title(`${emoji.yes} Set this as your default play-embed`)
                .img(`attachment://${attachment.name}`),
            ],
            files: [attachment],
            components: [],
          })
          .catch(() => {});
      }

      if (interaction.customId == "cancel") {
        await collector.stop();
      }
    });

    collector?.on("end", async (collected, reason) => {
      let selected = [...collected].map((ele) => ele[1].customId);

      if (collected.size == 0 || !selected.includes("confirm")) {
        attachment = new AttachmentBuilder(
          `${process.cwd()}/assets/previews/${path}`,
          {
            name: "embed.png",
          },
        );
        await m
          .edit({
            embeds: [
              new client.embed()
                .desc(`${emoji.cog} **Current play-embed preset :**`)
                .img(`attachment://${attachment.name}`)
                .setFooter({ text: `Selection menu timed out / cancelled!` }),
            ],
            files: [attachment],
            components: [],
          })
          .catch(() => {});
      }
    });
  },
};
