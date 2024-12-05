/* made by snow.ded - getto */

const voucher_codes = require("voucher-code-generator");

module.exports = {
  name: "premium",
  aliases: [],
  cooldown: "",
  category: "config",
  usage: "",
  description: "Shows your premium status",
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
    let [premiumUser, premiumGuild, owner, admin] = await Promise.all([
      await client.db.premium.get(`${client.user.id}_${message.author.id}`),
      await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
      await client.owners.find((x) => x === message.author.id),
      await client.admins.find((x) => x === message.author.id),
    ]);

    const cmd = args[0] ? args[0].toLowerCase() : null;
    const type = args[1] ? args[1].toLowerCase() : null;

    switch (cmd) {
      case "gen":
        if (!owner && !admin)
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `> ${emoji.admin} **Only [snoww.](https://discord.gg/snoww) can use this command**`,
              ),
            ],
          });
        let code;
        switch (type) {
          case "guild":
            code = voucher_codes.generate({
              pattern: `LOONEY-####-GUILD-DUR${args[2] || 7}`,
            });
            code = code[0].toUpperCase();
            await client.db.vouchers.set(code, true);
            break;
          default:
            code = voucher_codes.generate({
              pattern: `LOONEY-#####-USER-DUR${args[2] || 7}`,
            });
            code = code[0].toUpperCase();
            await client.db.vouchers.set(code, true);
            break;
        }
        await message
          .reply({
            embeds: [
              new client.embed().desc(
                `${emoji.free} **Here's your generated code**\n` +
                  `${emoji.bell} **Usage :** ${client.prefix}redeem your_code\n` +
                  `${emoji.rich} ||${code}||\n`,
              ),
            ],
          })
          .catch(() => {});
        break;
      default:
        await message
          .reply({
            embeds: [
              new client.embed()
                .setAuthor({
                  name: `Getto Premium`,
                  iconURL: client.user.displayAvatarURL(),
                })
                .desc(
                    `<a:dot:1213156294219931760> **Easy Peasyy.. <:downarrow_lucid:1213161628208594964>**\n` +
                    `> Add getto in 5 servers \`(28d).\`\n` +
                    `> Collect coins and redeem them.\n\n` +
                    `<a:dot:1213156294219931760> **We Talkin Ragss.. <:downarrow_lucid:1213161628208594964>**\n` +
                    `> Boost getto's [support server](https://discord.gg/snoww) once.\n` +
                    `> Premium Subscription \`(28d)\` 1m 0w0\n` +
                    `> Premium Subscription \`(84d)\` 1$\n` +
                    `\n\n` +
                    `<a:dot:1213156294219931760> **Perks : <:downarrow_lucid:1213161628208594964>**\n` +
                    `> Completely Ad-free experience in server,\n` +
                    `> Badge in profile\n` +
                    `> Role in Support Server,\n` +
                    `> No prefix, Vote bypass\n` +
                    `> Priority in support\n` +
                    `> Volume limit increase\n` +
                    `> Early access etc. . . `,
                ),
            ],
          })
          .catch(() => {});
        break;
    }
  },
};
