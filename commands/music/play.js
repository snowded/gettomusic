/* made by snow.ded - getto */

const yt =
  /^(?:(?:(?:https?:)?\/\/)?(?:www\.)?)?(?:youtube\.com\/(?:[^\/\s]+\/\S+\/|(?:c|channel|user)\/\S+|embed\/\S+|watch\?(?=.*v=\S+)(?:\S+&)*v=\S+)|(?:youtu\.be\/\S+)|yt:\S+)$/i;

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: "",
  category: "music",
  usage: "<uri / name / file>",
  description: "play song via query",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: ["AttachFiles"],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const { channel } = message.member.voice;

    const file = await message.attachments;

    const query = [...file]?.[0] ? [...file][0][1].attachment : args.join(" ");

    if (!query) {
      await message
        .reply({
          embeds: [
            new client.embed().desc(
              `${emoji.bell} **No query ! Try a radio : \`${client.prefix}radio\`**`,
            ),
          ],
        })
        .catch(() => {});

      return;
    }

    let x = null;

    if (yt.test(query)) {
      if (
        !(await client.db.premium.get(`${client.user.id}_${message.author.id}`))
      )
        return await message
          .reply({
            embeds: [
              new client.embed().desc(
                `${emoji.warn} **This provider is against ToS** \n`,
              ),
            ],
          })
          .catch(() => {});

      x = await message
        .reply({
          embeds: [
            new client.embed().desc(
              `${emoji.warn} **This provider is against ToS!** \n` +
                `${emoji.bell} Retriving metadata to play from a diff source`,
            ),
          ],
        })
        .catch(() => {});
    }

    const loading = {
      embeds: [
        new client.embed().desc(
          `${emoji.search} **Searching please wait. . . **`,
        ),
      ],
    };

    x = x
      ? await x.edit(loading).catch(() => {})
      : await message.reply(loading).catch(() => {});

    const player = await client.manager.createPlayer({
      voiceId: channel.id,
      textId: message.channel.id,
      guildId: message.guild.id,
      shardId: message.guild.shardId,
      loadBalancer: true,
      deaf: true,
    });

    const result = await player.search(query, {
      requester: message.author,
      //    engine : 'spotify'
    });

    let noRes = {
      embeds: [
        new client.embed().desc(`${emoji.no} **No results found for query**`),
      ],
    };

    if (!result.tracks.length)
      return x
        ? await x.edit(noRes).catch(() => {})
        : await message.reply(noRes).catch(() => {});

    const tracks = result.tracks;
    if (result.type === "PLAYLIST")
      for (let track of tracks) {
        await player.queue.add(track);
      }
    else {
      if (tracks[0].length < 10000)
        return message.reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} **Songs of duration less than \`30s\` cannot be played !**`,
            ),
          ],
        });
      await player.queue.add(tracks[0]);
    }

    let added =
      result.type === "PLAYLIST"
        ? {
            embeds: [
              new client.embed().desc(
                `${emoji.yes} **Added ${tracks.length} from ${result.playlistName} to queue **`,
              ),
            ],
          }
        : {
            embeds: [
              new client.embed().desc(
                `${emoji.yes} **Added to queue [${tracks[0].title
                  .replace("[", "")
                  .replace("]", "")}](https://0.0)**`,
              ),
            ],
          };
    if (!player.playing && !player.paused) player.play();

    x
      ? await x.edit(added).catch(() => {})
      : await message.reply(added).catch(() => {});
  },
};
