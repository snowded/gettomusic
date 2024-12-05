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
      !player.playing ||
      !newState.id == client.user.id ||
      !(oldState.serverMute == false && newState.serverMute == true)
    )
      return;

    await player.pause(true);
    await require("@functions/updateEmbed")(client, player);
    await client.channels.cache
      .get(player.textId)
      .send({
        embeds: [
          new client.embed().desc(
            `${client.emoji.bell} **Player  \`paused\` because server muted**`,
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
