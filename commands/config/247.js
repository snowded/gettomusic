/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "247",
  aliases: [],
  cooldown: "",
  category: "config",
  usage: "",
  description: "en/dis-able 247 mode",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const player = await client.getPlayer(message.guild.id);

    let data = await client.db.twoFourSeven.get(
      `${client.user.id}_${message.guild.id}`,
    );

    const row = new ActionRowBuilder().addComponents(
      new client.button().success(
        "enable",
        "Enable 247",
        "",
        data ? true : false,
      ),
      new client.button().danger(
        "disable",
        "Disable 247",
        "",
        data ? false : true,
      ),
    );
    const m = await message
      .reply({
        embeds: [
          new client.embed()
            .title(`247 Profile:`)
            .desc(`${emoji["247"]} **Choose a 247 mode below :**`),
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

      if (interaction.customId == "enable") {
        await client.db.twoFourSeven.set(
          `${client.user.id}_${message.guild.id}`,
          {
            TextId: player.textId,
            VoiceId: player.voiceId,
          },
        );
        let emb = new client.embed().desc(
          `${emoji.on} **247 mode is now \`Enabled\`**\n` +
            `${emoji.bell} *Set by ${message.author.tag} - (New config)*`,
        );
        return await m.edit({ embeds: [emb], components: [] }).catch(() => {});
      }

      await client.db.twoFourSeven.delete(
        `${client.user.id}_${message.guild.id}`,
      );
      let emb = new client.embed().desc(
        `${emoji.off} **247 mode is now \`Disabled\`**\n` +
          `${emoji.bell} *Set by ${message.author.tag} - (New config)*`,
      );
      await m.edit({ embeds: [emb], components: [] }).catch(() => {});
    });

    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await m
          .edit({
            embeds: [
              new client.embed().desc(
                `${emoji.cool} **Timed out ! Falling back to existing profile**`,
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
                      `${
                        data
                          ? `${emoji.on} **247 mode set to \`Enabled\`**\n` +
                            `${emoji.bell} *Timed out! Fell back to existing config*`
                          : `${emoji.off} **247 mode set to \`Disabled\`**\n` +
                            `${emoji.bell} *Timed out! Fell back to existing config*`
                      }`,
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
