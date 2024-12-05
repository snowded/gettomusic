/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "restart",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "Respawns all shards",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const playing_guilds = [...client.manager.players]
      .map((e) => e[1])
      .filter((p) => p.playing)
      .map((p) => p.guildId);

    guilds = [];

    for (id of playing_guilds) {
      let g = await client.guilds.cache.get(id);
      await guilds.push(`• ${g.name.substring(0, 15)} => ${g.memberCount}\n`);
    }

    let desc =
      guilds.length == 0
        ? `${emoji.bell} **There are no playing Player\n\n` +
          `Do you wish to restart ?**`
        : `${emoji.bell} **Currently playing players :** \n\n` +
          `${guilds.join("")}\n` +
          `**Do you wish to restart ?**`;

    const row = new ActionRowBuilder().addComponents(
      new client.button().secondary(`restart`, `Restart the Bot`, emoji.yes),
      new client.button().danger(`end`, `<:gettostop:1277360986025627658>`),
    );
    let m = await message.reply({
      embeds: [new client.embed().desc(desc)],
      components: [row],
    });
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
      if (!interaction.deffered) await interaction.deferUpdate();
      switch (interaction.customId) {
        case "restart":
          await m
            .edit({
              embeds: [
                new client.embed().desc(
                  `${emoji.cool} **Respawning all shards. ETA: 10-15s**`,
                ),
              ],
              components: [],
            })
            .catch(() => {});
          client.log(`Killing and respawning all shards`, "debug");
          await client.cluster.respawnAll();
          break;
        case "end":
          await collector.stop();
          await m
            .edit({
              embeds: [
                new client.embed().desc(
                  `${emoji.bell} **Restart operation cancelled by user**`,
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
                .desc(desc)
                .setFooter({ text: "Command timed out !" }),
            ],
            components: [],
          })
          .catch(() => {});
    });
  },
};
