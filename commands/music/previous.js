/* made by snow.ded - getto */

module.exports = {
  name: "previous",
  aliases: ["prev", "back"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "play previous song",
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

    if (!player.queue.previous.length > 0) {
      let emb = new client.embed().desc(
        `${emoji.no} **No Previously played song found**`,
      );
      return message.reply({ embeds: [emb] }).catch(() => {});
    }

    if (player.queue.previous) {
      player.queue.unshift(
        player.queue.previous[player.queue.previous.length - 1],
      );
      await player.skip();
    }
    let emb = new client.embed().desc(
      `${emoji.yes} **Playing previous [${player.queue.previous[
        player.queue.previous.length - 1
      ].title
        .replace("[", "")
        .replace("]", "")}](https://0.0)**`,
    );
    return message.reply({ embeds: [emb] }).catch(() => {});
  },
};
