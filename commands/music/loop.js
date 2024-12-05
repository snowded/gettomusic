/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: [],
  cooldown: "",
  category: "music",
  usage: "",
  description: "set loop mode",
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
      new client.button()[player.loop == "track" ? `success` : `secondary`](
        "track",
        "Track",
        emoji.track,
      ),
      new client.button()[player.loop == "queue" ? `success` : `secondary`](
        "queue",
        "Queue",
        emoji.queue,
      ),
      new client.button()[player.loop == "none" ? `success` : `secondary`](
        "none",
        "None",
      ),
    );

    let m = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.loop} **Choose a loop mode from below :**`,
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
      if (!interaction.deferred) interaction.deferUpdate();
      await player.setLoop(`${interaction.customId}`);

      let emb = new client.embed().desc(
        `${emoji[player.loop == "none" ? `off` : `on`]} **Loop mode set to \`${
          interaction.customId
        }\`**\n` +
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
                        `${
                          emoji[player.loop == "none" ? `off` : `on`]
                        } **Loop mode set to \`${player.loop}\`**\n` +
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
