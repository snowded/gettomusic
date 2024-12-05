/* made by snow.ded - getto */

module.exports = {
  name: "voiceStateUpdate",
  run: async (client, oldState, newState) => {
    let members =
      await newState.guild.members.me.voice?.channel?.members.filter(
        (m) => !m.user.bot,
      ).size;

    if (
      !members == 0 ||
      !(
        oldState.channel?.id == newState.guild.members.me.voice?.channel?.id ||
        newState.channel?.id == newState.guild.members.me.voice?.channel?.id
      )
    )
      return;

    const player = await client.getPlayer(newState.guild.id);

    let twoFourSeven = await client.db.twoFourSeven.get(
      `${client.user.id}_${player?.guildId || newState.guild.id}`,
    );

    if (!twoFourSeven) {
      await client.sleep(1500);
      return await client
        .getPlayer(player?.guildId)
        .then((player) => player?.destroy());
    }
    if (player && player.queue?.current?.length > 0) {
      await client.channels.cache
        .get(player?.textId)
        ?.send({
          embeds: [
            new client.embed().desc(
              `${client.emoji.bell} **Player \`destroyed\`.**`,
            ),
          ],
        })
        .then((m) => {
          setTimeout(() => {
            m.delete().catch(() => {});
          }, 5000);
        })
        .catch(() => {});
      player.loop = "none";
      await player?.queue?.clear();
      await player?.data?.delete("autoplay");
      player.playing = player.paused = false;
      await client.sleep(1500);
      await client.getPlayer(player?.guildId).then((player) => player?.skip());
    }
  },
};
