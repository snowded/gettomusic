/* made by snow.ded - getto */

module.exports = {
  name: "guildDelete",
  run: async (client, guild) => {
    if (!guild.name) return;
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Delete 247 db entry ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    if (!guild.name) return;

    await client.db.pfx.delete(`${client.user.id}_${guild.id}`);
    await client.db.preset.delete(`${client.user.id}_${guild.id}`);
    await client.db.ignore.delete(`${client.user.id}_${guild.id}`);
    await client.db.premium.delete(`${client.user.id}_${guild.id}`);
    await client.db.twoFourSeven.delete(`${client.user.id}_${guild.id}`);

    await client.webhooks.server
      .send({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [
          new client.embed()
            .desc(
              `**Left** ${guild.name} [ ${guild.id} ] [ ${guild.memberCount} ]`,
            )
            .setColor("#e63939"),
        ],
      })
      .catch(() => {});
  },
};
