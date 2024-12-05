/* made by snow.ded - getto */

module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {
    if (!guild.name) return;

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Send a thank you message to guild owner ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    const { ActionRowBuilder } = require("discord.js");
    let desc =
      `\`${
        client.user.username +
        `\` has been successfully added to \`${guild.name}\``
      }\n\n` +
      `You can report any issues at my **[Support Server](${client.support})** following the needed steps. ` +
      `You can also reach out to my **[Developers](${client.support})** if you want to know more about me.`;
    let e = new client.embed()
      .title(`Thank you for choosing ${client.user.username}!`)
      .desc(desc);
    try {
      let owner = await client.users.fetch(guild.ownerId);
      await owner
        .send({
          embeds: [e],
          components: [
            new ActionRowBuilder().addComponents(
              new client.button().link(`Support Server`, `${client.support}`),
              new client.button().link(`Get Premium`, `${client.support}`),
            ),
          ],
        })
        .catch(() => {});
    } catch (e) {}

    await client.webhooks.server
      .send({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [
          new client.embed()
            .desc(
              `**Joined** ${guild.name} [ ${guild.id} ] [ ${guild.memberCount} ]`,
            )
            .setColor("#7ffa2d"),
        ],
      })
      .catch(() => {});
  },
};
