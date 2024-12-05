/* made by snow.ded - getto */

const generate = require("@gen/radio.js");
const radio = require("@assets/radioLinks.js");

module.exports = {
  name: "radio",
  aliases: ["rad"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "choose a radio",
  args: false,
  vote: false,
  new: true,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const { channel } = message.member.voice;

    let row1 = await generate(client, "lofi_radios", "Lofi");
    let row2 = await generate(client, "hindi_radios", "Hindi");
    let row3 = await generate(client, "english_radios", "English");
    const m = await message
      .reply({
        embeds: [
          new client.embed()
            .desc(
              `${emoji.radio} **Select a radio genre below**\n\n` +
                `**Avaliable Types : **\n` +
                `${emoji.radio} Lofi Radio\n` +
                `${emoji.radio} Hindi Songs Radio\n` +
                `${emoji.radio} English Songs Radio\n`,
            )
            .thumb(`https://cdn-icons-png.flaticon.com/512/5525/5525480.png`)
            .setFooter({
              text: `made with love for ya'll ~ snoww. | 11 -Genresㅤㅤㅤㅤㅤㅤ  ㅤㅤㅤㅤㅤㅤㅤ`,
            }),
        ],
        components: [row1, row2, row3],
      })
      .catch(() => {});

    const collector = m?.createMessageComponentCollector({
      filter: (i) => {
        if (i.user.id === message.author.id) return true;
        else {
          i.reply({
            ephemeral: true,
            content: `Only **${message.author.tag}** can use this`,
          }).catch((err) => {
            int.deferUpdate();
          });
          return false;
        }
      },
      time: 60000,
      idle: 60000 / 2,
    });
    collector?.on("end", async (collected, reason) => {
      if (collected.size == 0)
        await m
          .edit({
            embeds: [
              new client.embed().desc(
                `${emoji.warn} **Timeout ! No radio selected**`,
              ),
            ],
            components: [],
          })
          .catch(() => {});
    });

    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) interaction.deferUpdate();

      const query = radio[interaction.customId][interaction.values];

      const existing_player = await client.getPlayer(interaction.guild.id);
      if (existing_player) await existing_player.destroy();

      await m
        .edit({
          embeds: [
            new client.embed().desc(
              `${emoji.cool} **Existing player destroyed. Preparing radio ...**`,
            ),
          ],
          components: [],
        })
        .catch(() => {});

        await client.sleep(1500);
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
      });

      if (!result.tracks.length)
        return await m
          .edit({
            embeds: [
              new client.embed().desc(
                `${emoji.warn} **This radio is currently unavailable ! \n` +
                  `${emoji.support} Please contact [support](${client.support}) for help**`,
              ),
            ],
          })
          .catch(() => {});

      const tracks = result.tracks;

      if (result.type === "PLAYLIST")
        for (let track of tracks) await player.queue.add(track);
      else await player.queue.add(tracks[0]);

      if (!player.playing && !player.paused) player.play();
      return await m
        .edit({
          embeds: [
            new client.embed().desc(
              `${emoji.yes} **Started playing radio \`${interaction.values}\`**`,
            ),
          ],
        })
        .catch(() => {})
        .then((m) => setTimeout(() => m.delete().catch(() => {}), 5000));
    });
  },
};
