/* made by snow.ded - getto */

module.exports = {
  name: "config",
  aliases: ["cnf"],
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
    let [pfx, premiumGuild, twoFourSeven] = await Promise.all([
      await client.db.pfx.get(`${client.user.id}_${message.guild.id}`),
      await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
      await client.db.twoFourSeven.get(`${client.user.id}_${message.guild.id}`),
    ]);

    premium =
      premiumGuild == true
        ? "Lifetime"
        : premiumGuild
          ? `Expiring <t:${`${premiumGuild}`?.slice(0, -3)}:R>`
          : `\`Not Activated\``;

    await message
      .reply({
        embeds: [
          new client.embed()
            .setAuthor({
              name: `Configuration Overview`,
              iconURL: message.guild.iconURL(),
            })
            .desc(
              `**${emoji.point} Prefix for this server is \`${client.prefix}\`${
                pfx ? ` / \`${pfx}\`` : ``
              }\n\n` +
                `Basic features :\n` +
                `${
                  twoFourSeven
                    ? `${emoji.on}  \`247 in Voice-Channel\`\n` +
                      `> - Text channel : <#${twoFourSeven.TextId}>\n` +
                      `> - Voice channel : <#${twoFourSeven.VoiceId}>\n`
                    : `${emoji.off}  \`247\`\n`
                }\n\n` +
                `Premium features : \n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`No Advertisements\`\n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`Premium Guild badge\`\n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`Choosable playembed preset\`\n` +
                `${
                  premiumGuild ? `${emoji.on}` : `${emoji.off}`
                }  \`Vote-locked commands bypass\`\n\n` +
                `Premium Status : ${premium}**`,
            )

            .setFooter({
              text: `For more information on presets use ${client.prefix}preset`,
            }),
        ],
      })
      .catch(() => {});
  },
};
