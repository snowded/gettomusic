/* made by snow.ded - getto */

const progressbar = require("@gen/progressbar");
const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "seek",
  aliases: [],
  cooldown: "",
  category: "music",
  usage: "[ Xmin or s eg. 5s, 5min ]",
  description: "seek song to duration",
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
    let player = await client.getPlayer(message.guild.id);

    if (args[0]) {
      let track = await player.queue.current.length;

      const parseTime = (input) => {
        const timeRegex = /^((\d+)\s*(min|m|minutes?))?\s*((\d+)\s*(s|sec)?)?$/;
        const match = input.match(timeRegex);

        if (!match) {
          return null;
        }

        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        const seconds = match[4] ? parseInt(match[4], 10) : 0;

        return minutes * 60 + seconds;
      };

      const timeInSeconds = parseTime(args.join(" "));
      let time = timeInSeconds ? timeInSeconds * 1000 : null;

      if (time) {
        if (track?.isStream) {
          return message
            .reply({
              embeds: [
                new client.embed().desc(
                  `${emoji.no} **Seek Failed !**\n` +
                    `${emoji.bell} \`<:DND:1274842952237056142> LIVE\` track cannot be seeked`,
                ),
              ],
            })
            .catch(() => {});
        }

        if (time > track) {
          return message
            .reply({
              embeds: [
                new client.embed().desc(
                  `${emoji.no} **Seek Failed !**\n` +
                    `${emoji.bell} Seek duration must be less than song duration`,
                ),
              ],
            })
            .catch(() => {});
        }

        await player.seek(time);

        let emb = new client.embed().desc(
          `${emoji.yes} **Seeked to \`${require("ms")(time)}\`**`,
        );
        return message.reply({ embeds: [emb] }).catch(() => {});
      }
    }

    const generateEmbed = async () => {
      let player = await client.getPlayer(message.guild.id);
      let track = player?.queue?.current;
      let total = track?.isStream
        ? `<:DND:1274842952237056142> LIVE`
        : client.formatTime(player?.queue?.current?.length);
      let current = client.formatTime(player?.position);

      let embed = new client.embed().addFields({
        name: `<:Getto:1271049490576441378> Progress・${current} / ${total}`,
        value: `${progressbar(player, 14)}`,
        inline: false,
      });

      return embed;
    };

    let track = await player.queue.current;
    let row1 = new ActionRowBuilder().addComponents(
      new client.button().secondary("-30s", "", `<:MekoDoubleArrowLeft:1266028933128650855>`, false),
      new client.button().secondary("-10s", "", `<:MekoArrowLeft:1268525399906979851>`, false),
      new client.button().secondary("+10s", "", `<:MekoArrowRight:1268525396513656903>`, false),
      new client.button().secondary("+30s", "", `<:MekoDoubleArrowRight:1266028930226192416>`, false),
    );

    let row2 = new ActionRowBuilder().addComponents(
      new client.button().secondary("-30s", "", `<:MekoDoubleArrowLeft:1266028933128650855>`, true),
      new client.button().secondary("-10s", "", `<:MekoArrowLeft:1268525399906979851>`, true),
      new client.button().secondary("+10s", "", `<:MekoArrowRight:1268525396513656903> `, true),
      new client.button().secondary("+30s", "", `<:MekoDoubleArrowRight:1266028930226192416>`, true),
    );

    let row = track?.isStream ? row2 : row1;
    let m = await message
      .reply({
        embeds: [await generateEmbed()],
        components: [row],
      })
      .catch(() => {});

    const seek = async (m, time) => {
      await player.seek(time);
      await client.sleep(300);
      await m.edit({ embeds: [await generateEmbed()] }).catch(() => {});
    };

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
      idle: 30000 / 2,
    });

    collector?.on("collect", async (interaction) => {
      player = await client.getPlayer(message.guild.id);
      switch (interaction.customId) {
        case "-30s":
          time = player.position - 30000;
          if (time < 0) time = 0;
          await seek(m, time);
          break;

        case "-10s":
          time = player.position - 10000;
          if (time < 0) time = 0;
          await seek(m, time);
          break;

        case "+10s":
          time = player.position + 10000;
          if (time > (await player.queue.current.length))
            time = (await player.queue.current.length) + 10000;
          await seek(m, time);
          break;

        case "+30s":
          time = player.position + 30000;
          if (time > (await player.queue.current.length))
            time = (await player.queue.current.length) + 30000;
          await seek(m, time);
          break;
      }
      if (!interaction.deferred) interaction.deferUpdate();
    });
    collector?.on("end", async (collected, reason) => {
      return m.edit({ components: [row2] }).catch(() => {});
    });
  },
};
