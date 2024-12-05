/* made by snow.ded - getto */

module.exports = {
  name: "balance",
  aliases: ["bal"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Check balance",
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
    let coins = parseInt(
      (await client.db.coins.get(`${message.author.id}`)) || 0,
    );

    const m = await message
      .reply({
        embeds: [
          new client.embed()
            .desc(
              `**${emoji.coin} You have a total of ${
                coins || `0`
              } coins**\n\n` +
                `**ayy! you need coins? right. I gotcha**\n\n` +
                `<a:dot:1213156294219931760> **Easy Peasyy.. <:downarrow_lucid:1213161628208594964>**\n` +
                `> Each command used (1-3 coins).\n` +
                `> Add getto in server (150 coins).\n\n` +
                `<a:dot:1213156294219931760> **We Talkin Ragss.. <:downarrow_lucid:1213161628208594964>**\n` +
                `> Boost [support server](https://discord.gg/snoww) (1000 coins).\n` +
                `> Pay 1M 0w0 or 1$ (1800 coins).\n`,
            )

            .setFooter({
              text: `This isn't a real but an in-game currency.`,
            }),
        ],
      })
      .catch(() => {});
  },
};
