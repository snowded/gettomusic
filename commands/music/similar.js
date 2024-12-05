/* made by snow.ded - getto */

const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "similar",
  aliases: [],
  cooldown: "",
  category: "music",
  usage: "",
  description: "get similar song/(s)",
  args: false,
  vote: false,
  new: true,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    let m = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.search} **Searching please wait. . . **`,
          ),
        ],
      })
      .catch(() => {});

    const player = await client.getPlayer(message.guild.id);
    let current = player.queue.current;
    let query = current.author;
    const result = {};
    result.youtube = await player
      .search(query, {
        requester: message.author,
        engine: "youtube",
      })
      .then((res) => res.tracks);

    result.spotify = await player
      .search(query, {
        requester: message.author,
        engine: "spotify",
      })
      .then((res) => res.tracks);

    result.soundcloud = await player
      .search(query, {
        requester: message.author,
        engine: "soundcloud",
      })
      .then((res) => res.tracks);

    let id = current.identifier;
    query = `https://www.youtube.com/watch?v=${id}&list=RD${id}`;
    result.youtube2 = await player
      .search(query, {
        requester: message.author,
        engine: "youtube",
      })
      .then((res) => res.tracks);

    result.yt = result.youtube2.length > 0 ? result.youtube2 : result.youtube;

    result.tracks = [
      ...result.yt.slice(0, 5).sort(() => Math.random() - 0.5),
      ...result.spotify.slice(0, 5).sort(() => Math.random() - 0.5),
      ...result.soundcloud.slice(0, 5).sort(() => Math.random() - 0.5),
    ];

    let noResObj = {
      embeds: [
        new client.embed().desc(`${emoji.no} **No similar songs found**`),
      ],
    };

    if (!result.tracks.length || result.tracks.length == 0)
      return x
        ? x.edit(noResObj).catch(() => {})
        : message.reply(noResObj).catch(() => {});

    const tracks = result.tracks;

    const options = await Promise.all(
      tracks.map(async (track, index) => ({
        label: `${index} -  ${
          track.title.charAt(0).toUpperCase() + track.title.substring(1, 30)
        }`,
        value: `${index}`,
        description: `Author: ${track.author.substring(0, 30)}     Duration: ${
          track?.isStream ? "◉ LIVE" : client.formatTime(track.length)
        }`,
        emoji: emoji[track.sourceName],
      })),
    );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("menu")
      .setPlaceholder("Search results")
      .setMinValues(1)
      .setMaxValues(5)
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(menu);

    let resObj = {
      embeds: [
        new client.embed()
          .desc(`${emoji.track} **Select a track below**`)
          .setFooter({
            text: `made with love for ya'll ~ snoww. | Hard Musicㅤㅤㅤㅤㅤㅤ  ㅤㅤㅤㅤㅤㅤㅤ`,
          }),
      ],
      components: [row],
    };

    m = await m.edit(resObj).catch(() => {});

    const filter = async (interaction) => {
      if (interaction.user.id === message.author.id) {
        return true;
      }
      await interaction
        .reply({
          embeds: [
            new client.embed().desc(
              `${emoji.no} Only **${message.author.tag}** can use this`,
            ),
          ],
          ephemeral: true,
        })
        .catch(() => {});
      return false;
    };
    const collector = m?.createMessageComponentCollector({
      filter: filter,
      time: 60000,
      idle: 60000 / 2,
    });

    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await m
          .edit({
            embeds: [
              new client.embed()
                .desc(`${emoji.warn} **Timeout ! No track selected**`)
                .setFooter({
                  text: `made with love for ya'll ~ snoww. | Hard Musicㅤㅤㅤㅤㅤㅤ  ㅤㅤㅤㅤㅤㅤㅤ`,
                }),
            ],
            components: [],
          })
          .catch(() => {});
    });

    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) interaction.deferUpdate();
      await m?.delete().catch(() => {});

      let desc = ``;
      for (const value of interaction.values) {
        const song = tracks[value];
        if (song.length < 10000) {
          desc += `${emoji.no} **Not added as less than 30s [${song.title
            .replace("[", "")
            .replace("]", "")
            .substring(0, 15)}](https://0.0)**\n`;
          continue;
        }
        await player.queue.add(song);
        desc += `${emoji.yes} **Added to queue [${song.title
          .replace("[", "")
          .replace("]", "")}](https://0.0)**\n`;
      }
      await message
        .reply({
          embeds: [new client.embed().desc(desc)],
        })
        .catch(() => {});
      if (!player.playing && !player.paused) player.play();
    });
  },
};
