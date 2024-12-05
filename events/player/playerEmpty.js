/* made by snow.ded - getto */

const autoplay = require("@functions/autoplay");

module.exports = {
  name: "playerEmpty",
  run: async (client, player) => {
    if (player.data.get("message")) {
      let m = player.data.get("message");

      if (player.data.get("autoplay")) {
        m?.delete().catch(() => {});
      } else {
        m?.edit({
          embeds: [client.endEmbed],
          components: [],
          files: [],
        }).catch(() => {});
      }
    }
    if (player.data.get("autoplay")) {
      player.previous = player.data.get("autoplaySystem");
      let channel = await client.channels.cache.get(player.textId);
      return autoplay(client, player, channel);
    }

    await client.webhooks.player
      .send({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [
          new client.embed().desc(
            `**Queue ended** in [ ${client.guilds.cache.get(player.guildId)} ]`,
          ),
        ],
      })
      .catch(() => {});

    const TwoFourSeven = await client.db.twoFourSeven.get(
      `${client.user.id}_${player.guildId}`,
    );

    if (TwoFourSeven) {
      if (!player.queue.previous) return;
      client.channels.cache
        .get(player.textId)
        ?.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.bell} **Not leaving VC as 24/7 is Enabled**\n` +
                `Bound to  : ** <#${player.voiceId}> [ <#${player.textId}> ]**`,
            ),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, 5000);
        })
        .catch(() => {});
      return;
    }

    await client.sleep(30000);

    const newPlayer = await client.getPlayer(player.guildId);
    if (newPlayer && !newPlayer?.playing && !newPlayer?.queue.current) {
      client.channels.cache
        .get(player.textId)
        ?.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.bell} **Player destroyed due to inactivity**`,
            ),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, 5000);
        })
        .catch(() => {});
      await client.sleep(1500);
      await client
        .getPlayer(player?.guildId)
        .then((player) => player?.destroy());
    }
  },
};
