/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "clear",
  aliases: [],
  cooldown: "",
  category: "music",
  usage: "",
  description: "clear filter/queue",
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

    let row = new ActionRowBuilder().addComponents(
      new client.button().secondary(
        "shoukaku_clearFilters",
        "Filterㅤ",
        emoji.cog,
      ),
      new client.button().secondary("queue_clear", "Queueㅤ", emoji.list),
    );

    let emb = new client.embed().desc(
      `${emoji.bell} **Choose an option to clear :**`,
    );
    let m = await message
      .reply({ embeds: [emb], components: [row] })
      .catch(() => {});

    const collector = m?.createMessageComponentCollector({
      filter: (i) => {
        if (i.user.id === message.author.id) return true;
        else {
          i.reply({
            ephemeral: true,
            content: `Only **${message.author.tag}** can use this`,
          })
            .catch((err) => {
              int.deferUpdate();
            })
            .catch(() => {});
          return false;
        }
      },
      time: 60000,
      idle: 30000 / 2,
    });

    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) interaction.deferUpdate();

      let emb = new client.embed().desc(
        `${emoji.yes} **Successfully cleared \`${
          interaction.customId.includes("queue") ? `queuue` : `filters`
        }\`**`,
      );

      await player[`${interaction.customId.split("_")[0]}`][
        `${interaction.customId.split("_")[1]}`
      ]();

      await m.edit({ embeds: [emb], components: [] }).catch(() => {});
    });

    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await m
          .edit({
            embeds: [
              new client.embed()
                .desc(
                  `${emoji.bell} **Timed out ! (Choose an option to clear)**`,
                )
                .setFooter({
                  text: "Rollback - No changes were made to queue / filter(s)",
                }),
            ],
            components: [],
          })
          .catch(() => {});
    });
  },
};
