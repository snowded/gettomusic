/* made by snow.ded - getto */

module.exports = {
  name: "skip",
  aliases: ["skipto"],
  cooldown: "",
  category: "music",
  usage: "[ position in queue ]",
  description: "skip current song",
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

    if (player.queue.length == 0 && !player.data.get("autoplay")) {
      let emb = new client.embed().desc(
        `${emoji.no} **No more songs left in the queue to skip**`,
      );
      return message.reply({ embeds: [emb] }).catch(() => {});
    }
    if (args[0]) {
      const position = Number(args[0]);

      if (!position || position < 0 || position > player.queue.length) {
        return message
          .reply({
            embeds: [
              new client.embed().desc(
                `${emoji.no} **Invalid queue position provided**`,
              ),
            ],
          })
          .catch(() => {});
      }
      if (args[0] == 1) player.skip();

      player.queue.splice(0, position - 1);
    }

    await player.skip();

    let emb = new client.embed().desc(
      `${emoji.yes} **Skipped [${player.queue.current.title
        .replace("[", "")
        .replace("]", "")}](https://0.0)**`,
    );
    return message.reply({ embeds: [emb] }).catch(() => {});
  },
};
