/* made by snow.ded - getto */

module.exports = {
  name: "remove",
  aliases: ["rem"],
  cooldown: "",
  category: "music",
  usage: "<position in queue>",
  description: "remove song from queue",
  args: true,
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

    const position = Number(args[0]) - 1;
    const track = player.queue[position];

    if (position > player.queue.length || !track) {
      const number = position + 1;
      let emb = new client.embed().desc(
        `${emoji.no} **No song in queue at postion ${number}**`,
      );
      return message.reply({ embeds: [emb] }).catch(() => {});
    }

    await player.queue.splice(position, 1);

    let emb = new client.embed().desc(
      `${emoji.yes} **Removed [${track.title
        .replace("[", "")
        .replace("]", "")}](https://0.0)**`,
    );
    return message.reply({ embeds: [emb] }).catch(() => {});
  },
};
