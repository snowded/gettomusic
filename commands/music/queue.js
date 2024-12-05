/* made by snow.ded - getto */

const load = require("lodash");

module.exports = {
  name: "queue",
  aliases: ["q"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "shows queue",
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

    let emb = new client.embed().desc(
      `${emoji.cool} **| Getting data. Please wait. . . **`,
    );
    let reply = await message.reply({ embeds: [emb] }).catch(() => {});
    const queuedSongs = player.queue.map(
      (t, i) =>
        `**[ ${++i} ] • [${
          t.title.length > 30 ? t.title.substring(0, 30) : `${t.title}`
        }](https://0.0) - \`[${
          t.isStream ? "◉ LIVE" : client.formatTime(t.length)
        }]\`**`,
    );

    const zero = `**Current :\n[${
      player.queue?.current?.title.length > 30
        ? player.queue?.current?.title.substring(0, 30)
        : `${player.queue?.current?.title}`
    }](https://0.0) - \`[${
      player.queue.current.isStream
        ? "◉ LIVE"
        : client.formatTime(player.queue?.current?.length)
    }]\`**\n`;

    queuedSongs.splice(0, 0, zero);

    const mapping = load.chunk(queuedSongs, 9);
    const descriptions = mapping.map((s) => s.join("\n"));

    let pages = [];

    for (let i = 0; i < descriptions.length; i++) {
      const embed = new client.embed().desc(`${descriptions[i]}`);
      pages.push(embed);
    }

    await require("@utils/paginate.js")(client, message, pages);
    return reply.delete().catch(() => {});
  },
};
