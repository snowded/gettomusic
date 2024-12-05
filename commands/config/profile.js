const fs = require('fs');
const path = require('path');


// Load the special.json file
const specialFilePath = path.join(__dirname, './badges.json');
let specialData = require(specialFilePath);

module.exports = {
  name: "profile",
  aliases: ["pr"],
  cooldown: "",
  category: "config",
  usage: "",
  description: "See server configs",
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
    // Check if a user is mentioned, otherwise default to the message author
    const targetUser = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(targetUser.id);

    let [pfx, premiumUser, dev, admin] = await Promise.all([
      client.db.pfx.get(`${client.user.id}_${targetUser.id}`),
      client.db.premium.get(`${client.user.id}_${targetUser.id}`),
      client.owners.find((x) => x === targetUser.id),
      client.admins.find((x) => x === targetUser.id),
    ]);

    const customBadge = targetUser.id === '1092374628556615690' ? `<a:WumpusCrown:1310152524182851606> **・ [snoww.](https://discord.com/users/1092374628556615690)**\n` : '';
    const snowspe = specialData.snowspe.includes(targetUser.id) ? `<:pandasalute:1310153201630314520> **・ snow's special**\n` : '';

    let premium = premiumUser
      ? premiumUser === true
        ? "Lifetime"
        : `Expiring <t:${String(premiumUser).slice(0, -3)}:R>`
      : `\`Not Activated\``;

    await message
      .reply({
        embeds: [
          new client.embed()
            .setAuthor({
              name: `${targetUser.displayName}'s Profile`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `> <:rdx_white_arrow:1309498347668901919> **List Of Badges**\n\n` +
              `${customBadge}` +
              //`${dev ? `<:snow:1275425820856418375> **・ Owner**\n` : ``}` +
              `${dev ? `${emoji.dev} **・ Developer**\n` : ``}` +
              `${admin ? `${emoji.admin} **・ Administrator**\n` : ``}` +
              `${snowspe}` +
              `${premiumUser ? `${emoji.premium} **・ Premium User [(${premium})](https://discord.gg/snoww)**\n` : ``}` +
              `${premiumUser ? `<:commands_helptutu:1254071792566276148> **・ No Prefix**\n` : ``}` +
              `${emoji.user} **・ Getto's User**\n\n`
            )
            .setTimestamp()
            .setThumbnail(member.displayAvatarURL())
            .setFooter({
              text: `requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            }),
        ],
      })
      .catch(() => {});
  },
};
