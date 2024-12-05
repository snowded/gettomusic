/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "blUser",
  run: async (client, message, blacklistUser) => {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Warn blacklist user if not warned //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    let embed = new client.embed().desc(
      `${client.emoji.no} **You are blacklisted and can't use my commands !**\n` +
        `${client.emoji.bell} *Note : This message wont be shown ever again !*`,
    );

    let row = new ActionRowBuilder().addComponents(
      new client.button()
        .link("Click to join Support Server", client.support)
        .setEmoji(client.emoji.helpline),
    );

    if (blacklistUser != "warned") {
      await client.db.blacklist.set(
        `${client.user.id}_${message.author.id}`,
        "warned",
      );

      await message.reply({
        embeds: [embed],
        components: [row],
      });

      await message.author
        .send({
          embeds: [embed],
          components: [row],
        })
        .catch(() => {});

      await client.webhooks.static
        .send({
          username: client.user.username,
          avatarURL: client.user.displayAvatarURL(),
          embeds: [
            new client.embed()
              .desc(
                `**Blacklisted an user**\n` +
                  `**Moderator :** Anti-Abuse\n` +
                  `**Guild :** ${message.guild.name.substring(0, 10)}[[${
                    message.guild.id
                  }](https://0.0)]\n` +
                  `**User :** ${message.author.tag}[[${message.author.id}](https://0.0)]`,
              )
              .setColor("#000000"),
          ],
        })
        .catch(() => {});
      return;
    }
  },
};
