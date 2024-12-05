/* made by snow.ded - getto */

module.exports = {
  name: "list",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "<static>",
  description: "Lists user/guild(s)",
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
    const static = args[0] ? args[0] : null;

    let db = null;

    switch (static) {
      case "bl":
        db = "blacklist";
        break;

      case "premium":
        db = "premium";
        break;

      default:
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} **No valid static provided\n**` +
                `${emoji.bell} **Avaliable options :** \`bl\`, \`premium\``,
            ),
          ],
        });
    }

    let ids = await client.db[db].keys;
    ids = await ids.filter((f) => f.includes(`${client.user.id}`));
    let estimate = ids.length * 1100;

    let emb = new client.embed().desc(
      `${emoji.cool} **| Getting data. Please wait [ ETA: ${client.formatTime(
        estimate,
      )} ]**`,
    );
    let reply = await message.reply({ embeds: [emb] }).catch(() => {});
    if (!ids.length)
      return await message.reply({
        embeds: [new client.embed().desc(`${emoji.no}**No entries found !**`)],
      });
    let names = [];
    for (id of ids) {
      id = id.split("_")[1];
      let entity = await client.users
        .fetch(id, { force: true })
        .catch(() => {});
      if (!entity) entity = await client.guilds.cache.get(id);
      if (!entity) entity = { name: id, id: id };

      names.push(
        `** ${
          entity.username
            ? `${emoji.user} [${entity.username}`
            : `${emoji.list} [${entity.name.substring(0, 15)}`
        }](https://discord.com/users/${entity.id}) [${entity.id}]**`,
      );

      await client.sleep(100);
    }
    const mapping = require("lodash").chunk(names, 10);
    const descriptions = mapping.map((s) => s.join("\n"));
    var pages = [];
    for (let i = 0; i < descriptions.length; i++) {
      const embed = new client.embed()
        .desc(
          `## ${db.charAt(0).toUpperCase() + db.slice(1)} list : \n\n${
            descriptions[i]
          }`,
        )
        .setFooter({ text: `Page • 1/${pages.length}` });
      pages.push(embed);
    }
    await require("@utils/paginate.js")(client, message, pages);
    return reply.delete().catch(() => {});
  },
};
