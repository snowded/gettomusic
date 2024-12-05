/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "en/dis-able autoplay",
  args: false,
  vote: false,
  new: true,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    let player = await client.getPlayer(message.guild.id);

    let data = player.data.get("autoplay");

    const row = new ActionRowBuilder().addComponents(
      new client.button().success("enable", "Enable", "", data ? true : false),
      new client.button().danger("disable", "Disable", "", data ? false : true),
    );
    const m = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.autoplay} **Choose autoplay-mode :**`,
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

      if (interaction.customId == "enable") {
        player.data.set("autoplay", true);
        let emb = new client.embed().desc(
          `${emoji.on} **Autoplay is now \`Enabled\`**\n` +
            `${emoji.bell} *Set by ${message.author.tag} - (New config)*`,
        );
        await require("@functions/updateEmbed.js")(client, player);
        return await m.edit({ embeds: [emb], components: [] }).catch(() => {});
      }

      player.data.set("autoplay", false);
      let emb = new client.embed().desc(
        `${emoji.off} **Autoplay is now \`Disabled\`**\n` +
          `${emoji.bell} *Set by ${message.author.tag} - (New config)*`,
      );
      await require("@functions/updateEmbed.js")(client, player);
      return await m.edit({ embeds: [emb], components: [] }).catch(() => {});
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
          .then(async (fb) => {
            player = await client.getPlayer(message.guild.id);
            setTimeout(async () => {
              await fb
                .edit({
                  embeds: [
                    new client.embed().desc(
                      `${
                        player?.data.get("autoplay")
                          ? `${emoji.on} **Autoplay set to \`Enabled\`**\n` +
                            `${emoji.bell} *Timed out! Fell back to existing config*`
                          : `${emoji.off} **Autoplay set to \`Disabled\`**\n` +
                            `${emoji.bell} *Timed out! Fell back to existing config*`
                      }`,
                    ),
                  ],
                  components: [],
                })
                .catch(() => {});
            }, 2000);
          })
          .catch(() => {});
    });
  },
};
