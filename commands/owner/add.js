/* made by snow.ded - getto */

module.exports = {
  name: "add",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<mention> <static>",
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
    const id = message.mentions.users.first()?.id || args[0] || null;
    if (message.mentions?.users?.first()?.id && !args[1]) args[1] = args[0];
    const validUser = await client.users.fetch(id).catch(() => null);

    if (!validUser) {
      return await message.reply({
        embeds: [
          new client.embed().desc(`${emoji.no} **Invalid/No User provided**`),
        ],
      });
    }

    const [bl, premium] = await Promise.all([
      client.db.blacklist.get(`${client.user.id}_${id}`),
      client.db.premium.get(`${client.user.id}_${id}`),
    ]);

    let static = args[1] || null;
    let db = null;
    if (static) {
      db =
        static == "bl"
          ? "blacklist"
          : static == "premium"
            ? "premium"
            : args[1];
    }

    switch (static) {
      case "bl":
      case "premium":
        if (eval(static)) {
          return await message.reply({
            embeds: [
              new client.embed().desc(
                `${emoji.no} **Operation unsuccessful**\n` +
                  `${emoji.bell} <@${id}> already has the static : \`${static}\``,
              ),
            ],
          });
        }

        await client.db[db].set(`${client.user.id}_${id}`, true);
        await message.reply({
          embeds: [
            new client.embed().desc(
              `${emoji.yes} **Operation successful**\n` +
                `${emoji.on} Added the static \`${static}\` to <@${id}>`,
            ),
          ],
        });
        await client.webhooks.static
          .send({
            username: client.user.username,
            avatarURL: client.user.displayAvatarURL(),
            embeds: [
              new client.embed()
                .desc(
                  `**Added the static :** ${static}\n` +
                    `**Moderator :** ${message.author}\n` +
                    `**User :** ${validUser.tag}[[${id}](https://0.0)]`,
                )
                .setColor("#7ffa2d"),
            ],
          })
          .catch(() => {});
        break;

      default:
        message.reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} **No valid static provided\n**` +
                `${emoji.bell} **Available options :** \`bl\`, \`premium\``,
            ),
          ],
        });
        break;
    }
  },
};
