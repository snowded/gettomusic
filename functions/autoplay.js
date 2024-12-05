/* made by snow.ded - getto */

module.exports = autoplay = async (client, player, channel) => {
  let res = null;
  let cureentTrack = player.data.get("autoplaySystem");

  if (cureentTrack.sourceName == "youtube") {
    let match = cureentTrack.realUri.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    let id = match ? match[1] : null;
    res = await player.search(
      `https://www.youtube.com/watch?v=${id}&list=RD${id}`,
      {
        requester: client.user,
      },
    );

    if (!res.tracks.length > 0) {
      res = await player.search(
        `https://www.youtube.com/watch?v=${id}&list=RD${id}`,
        {
          requester: client.user,
        },
      );
    }
  } else {
    res = await player.search(`${cureentTrack.author}`, {
      requester: client.user,
    });
  }

  if (res.tracks.length > 0) {
    const track =
      res.tracks[
        Math.floor(Math.random() * (Math.min(res.tracks.length - 1, 5) + 1) + 1)
      ];

    await player?.queue.add(track);
    return player?.play();
  }

  await player.data.set("autoplay", false);
  return await channel
    .send({
      embeds: [
        new client.embed().desc(
          `${client.emoji.warn} **Autoplay failed ! \nNo similar tracks found to current track**`,
        ),
      ],
    })
    .then(async (m) => {
      await player.data.delete("autoplay");
      await player.queue.clear();
      player.loop = "none";
      player.playing = false;
      player.paused = false;
      await player.skip();
      setTimeout(async () => {
        await m.edit({ embeds: [client.endEmbed] }).catch(() => {});
      }, 5000);
    })
    .catch(() => {});
};
