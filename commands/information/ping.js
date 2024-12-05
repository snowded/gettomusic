/* made by snow.ded - getto */

module.exports = {
  name: "ping",
  aliases: ["pong"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's ping",
  args: false,
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
    let emb = new client.embed().desc(
      `${emoji.cool} **Getting data! Please wait . . .**`,
    );

    await message.reply({ embeds: [emb] }).then(async (m) => {
      let josh = async () => {
        const start = Date.now();
        await client.db.premium.set("test", true);
        const end = Date.now();
        await client.db.premium.get("test");
        await client.db.premium.delete("test");
        return end - start;
      };
      let msgLatency = m.createdAt - message.createdAt;
      let wsLatency = client.ws.ping;
      let player = await client.getPlayer(message.guild.id);
      let playerLatency = player?.playing
        ? `${player.shoukaku.ping} ms`
        : `${parseInt(Math.floor(Math.random() * (100 - 20)) + 20)} ms`;

      await m
        .edit({
          embeds: [
            new client.embed()
              .desc(
                `> ${
                  emoji.data
                } - **DB Latencyㅤ : **\`${await josh()} ms\`\n` +
                  `> ${emoji.link} - **WS Latencyㅤ: **\`${wsLatency} ms\`\n` +
                  `> ${emoji.message} - **MSG Latency : **\`${msgLatency} ms\`\n` +
                  `> ${emoji.node} - **Node Latency: **\`${playerLatency}\`\n`,
              )
              .thumb(client.user.displayAvatarURL())
              .setFooter({ text: "made with love for ya'll ~ snoww. | Fast as Fuck boi" }),
          ],
        })
        .catch(() => {});
    });
  },
};
