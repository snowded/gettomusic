/* made by snow.ded - getto */

module.exports = {
  name: "voiceStateUpdate",
  run: async (client, oldState, newState) => {
    if (
      newState.member.id !== client.user.id ||
      oldState.member.id !== client.user.id
    )
      return;

    let members =
      await newState.guild.members.me.voice?.channel?.members.filter(
        (m) => !m.user.bot,
      ).size;

    const player = await client.getPlayer(newState.guild.id);

    if (
      !player ||
      !members > 0 ||
      !player.paused ||
      !newState.id == client.user.id ||
      !(newState.serverMute == false && oldState.serverMute == true)
    )
      return;

    await player.pause(false);
    await require("@functions/updateEmbed")(client, player);
    await client.channels.cache
      .get(player.textId)
      .send({
        embeds: [
          new client.embed().desc(
            `${client.emoji.bell} **Player is being \`resumed\`**\n` +
              `*Playback was paused because i was server muted*`,
          ),
        ],
      })
      .then((m) => {
        setTimeout(() => {
          m.delete().catch(() => {});
        }, 5000);
      })
      .catch(() => {});
  },
};
