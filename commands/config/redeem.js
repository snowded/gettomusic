/* made by snow.ded - getto */

module.exports = {
  name: "redeem",
  aliases: [],
  cooldown: "",
  category: "config",
  usage: "<code>",
  description: "Redeem your premium code",
  args: true,
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
    let [premiumUser, premiumGuild] = await Promise.all([
      await client.db.premium.get(`${client.user.id}_${message.author.id}`),
      await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
    ]);

    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `**${emoji.cool} Validating Code. Please wait !**`,
          ),
        ],
      })
      .catch(() => {})
      .then(async (m) => {
        let code = args[0];
        let valid = await client.db.vouchers.get(code);
        if (!valid)
          return m
            .edit({
              embeds: [
                new client.embed().desc(
                  `**${emoji.no} Code invalid or already redeemed**`,
                ),
              ],
            })
            .catch(() => {});

        //////////////////////////////////////////////////////////////////////////
        let time = new Date();
        time = time.setDate(time.getDate() + parseInt(code.split("DUR")[1]));
        if (code.includes("GUILD")) {
          if (premiumGuild)
            return m
              .edit({
                embeds: [
                  new client.embed().desc(
                    `**${emoji.no} This Guild already has premium activated**\n` +
                      `*${emoji.bell} Code not used ! Gift it to someone else.*`,
                  ),
                ],
              })
              .catch(() => {});
          ///////////////////////////////////////////////
          await client.db.premium.set(
            `${client.user.id}_${message.guild.id}`,
            time,
          );
          await client.db.vouchers.delete(`${code}`);
        }
        if (code.includes("USER")) {
          if (premiumUser)
            return m
              .edit({
                embeds: [
                  new client.embed().desc(
                    `**${emoji.no} This User already has premium activated**\n` +
                      `*${emoji.bell} Code not used ! Gift it to someone else.*`,
                  ),
                ],
              })
              .catch(() => {});
          ///////////////////////////////////////////////
          await client.db.premium.set(
            `${client.user.id}_${message.author.id}`,
            time,
          );
          await client.db.vouchers.delete(`${code}`);
        }
        setTimeout(async () => {
          m.edit({
            embeds: [
              new client.embed()
                .title(`Premium Activated !`)
                .desc(
                  `**${emoji.cool} Expiry : **<t:${Math.round(
                    time / 1000,
                  )}:R>\n` +
                    `**${emoji.premium} Premium Type : **${
                      code.includes("USER") ? `User` : `Guild`
                    }\n`,
                )
                .addFields({
                  name: `Privilages attained :\n`,
                  value: `${
                    code.includes("USER")
                      ? `${emoji.on} \`No prefix\`\n` +
                        `${emoji.on} \`Vote bypass\`\n` +
                        `${emoji.on} \`Support priority\`\n` +
                        `${emoji.on} \`Badge in profile\`\n` +
                        `${emoji.on} \`Role in support Server\`\n` +
                        `${emoji.on} \`Early access & more...\``
                      : `${emoji.on} \`Vote bypass\`\n` +
                        `${emoji.on} \`Customizable playEmbed\`\n` +
                        `${emoji.on} \`Better sound quality\`\n` +
                        `${emoji.on} \`Volume limit increase\`\n` +
                        `${emoji.on} \`Early access & more...\``
                  }`,
                })
                .thumb(
                  `https://media.discordapp.net/attachments/1188399617121984542/1188742184095195228/8ef5f8c801f3cdbcb74794e2b153f445.webp?ex=659ba16e&is=65892c6e&hm=2b4d78014d77d635cc22e603979e1b8e121070cf2a72abd44b38d165dc24b708&=&format=png`,
                )
                .setFooter({
                  text: `${message.author.username}, we hope you enjoy our services`,
                }),
            ],
          }).catch(() => {});
        }, 3000);
      });
  },
};
