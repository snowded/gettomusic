/* made by snow.ded - getto */

module.exports = {
  name: "nowplaying",
  aliases: ["now", "np"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "see what's being played",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const path =
      (await client.db.preset.get(`${client.user.id}_${message.guild.id}`)) ||
      `cards/card1.js`;

    let player = await client.getPlayer(message.guild.id);

    let track = player?.queue?.current;

    let progress = track?.isStream
      ? 50
      : (player?.position / player?.queue?.current?.length) * 100;

    let requester = track?.requester;

    const data = await require(`@presets/${path}`)(
      {
        title:
          track?.title.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 25) ||
          "Something Good",
        author:
          track?.author.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 20) ||
          "Painfuego",
        duration: track?.isStream
          ? "◉ LIVE"
          : client.formatTime(player.queue?.current?.length) || "06:09",
        thumbnail:
          track?.thumbnail ||
          client.user.displayAvatarURL().replace("webp", "png"),
        color: client.color || "#FFFFFF",
        progress: progress,
        source: track?.sourceName !== "youtube" ? track.sourceName : "spotify",
        requester: requester,
      },
      client,
      player,
    );

    await message
      .reply({
        embeds: data[0],
        files: data[1],
      })
      .catch(() => {});
  },
};
