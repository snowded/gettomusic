/* made by snow.ded - getto */

module.exports = {
  name: "coin",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<add/rem/reset> <mention> <amount>",
  description: "Add static",
  args: true,
  vote: false,
  new: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const id = message.mentions.users.first()?.id || args[1];
    const validUser = await client.users.fetch(id).catch(() => null);

    if (!validUser) {
      return await message.reply({
        embeds: [
          new client.embed().desc(`${emoji.no} **Invalid/No User provided**`),
        ],
      });
    }

    let task = args[0];
    let amount = parseInt(args[2]);
    let coins = parseInt((await client.db.coins.get(`${id}`)) || 0);

    let total = 0;
    if (task == "add") total = coins + amount;
    if (task == "rem") total = coins - amount;

    await client.db.coins.set(`${validUser.id}`, total);
    await message.reply({
      embeds: [
        new client.embed().desc(
          `${emoji.yes} **Operation successful**\n` +
            `${emoji.coin} Total coins for ${validUser} is \`${total}\``,
        ),
      ],
    });
  },
};
