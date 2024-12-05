/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "prefix",
  aliases: ["pfx"],
  cooldown: "",
  category: "config",
  usage: "<reset/pfx>",
  description: "ser/reset prefix",
  args: true,
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
      new client.button().secondary("guild", "Guild", ""),
      new client.button().secondary("author", "User", ""),
      new client.button().danger(`cancel`, `<:gettostop:1277360986025627658>`),
    );

    let pfx = args[0].toLowerCase() == "reset" ? client.prefix : args[0];
    const m = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.cog} **Prefix will be set to \`${pfx}\`**\n` +
              `*Choose your desired option below*`,
          ),
        ],
        components: [row],
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

    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      if (interaction.customId == "cancel") return await collector.stop();

      args[0].toLowerCase() == "reset"
        ? await client.db.pfx.delete(
            `${client.user.id}_${message[interaction.customId].id}`,
          )
        : await client.db.pfx.set(
            `${client.user.id}_${message[interaction.customId].id}`,
            `${pfx}`,
          );

      await m
        .edit({
          embeds: [
            new client.embed().desc(
              `${emoji.yes} Set ${interaction.customId} prefix to \`${pfx}\``,
            ),
          ],
          components: [],
        })
        .catch(() => {});
    });

    collector?.on("end", async (collected, reason) => {
      let selected = [...collected].map((ele) => ele[1].customId);
      if (collected.size == 0 || selected.includes("cancel")) {
        await m
          .edit({
            embeds: [
              new client.embed().desc(`${emoji.cool} **Rolling back changes**`),
            ],
            components: [],
          })
          .then(async (fb) =>
            setTimeout(async () => {
              await fb
                .edit({
                  embeds: [
                    new client.embed().desc(
                      `${`${emoji.bell} *No changes made to prefix config*`}`,
                    ),
                  ],
                  components: [],
                })
                .catch(() => {});
            }, 2000),
          )
          .catch(() => {});
      }
    });
  },
};
