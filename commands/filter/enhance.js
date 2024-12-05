/* made by snow.ded - getto */

module.exports = {
  name: "enhance",
  aliases: [],
  cooldown: "",
  category: "filter",
  usage: "",
  description: "Optimize for best audio quality",
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
    const player = await client.getPlayer(message.guild.id);

    const { channel } = message.member.voice;

    let bitrate = 64000;
    switch (message.guild.premiumTier) {
      case 0:
        bitrate = 96000;
        break;
      case 1:
        bitrate = 128000;
        break;
      case 2:
        bitrate = 256000;
        break;
      case 3:
        bitrate = 384000;
        break;
    }

    let res;
    try {
      channel.edit({
        bitrate: bitrate,
      });
      res = `${emoji.yes} Set voice channel bitrate to **${
        bitrate / 1000
      }kbps**`;
    } catch (e) {
      res = `${emoji.bell} *Please set the vc bitrate to max manually*`;
    }

    await player.shoukaku.setFilters({
      op: "filters",
      guildId: message.guild.id,
      equalizer: [
        { band: 0, gain: 0.05 * 0.5 },
        { band: 1, gain: 0.06 * 0.5 },
        { band: 2, gain: 0.12 * 0.5 },
        { band: 3, gain: 0.02 * 0.5 },
        { band: 4, gain: 0.125 * 0.5 },
        { band: 5, gain: 0.025 * 0.5 },
        { band: 6, gain: -0.05 * 0.5 },
        { band: 7, gain: -0.1 * 0.5 },
        { band: 8, gain: -0.05 * 0.5 },
        { band: 9, gain: 0.02 * 0.5 },
        { band: 10, gain: 0.01 * 0.5 },
        { band: 11, gain: 0.065 * 0.5 },
        { band: 12, gain: 0.1 * 0.5 },
        { band: 13, gain: 0.14 * 0.5 },
        { band: 14, gain: 0.08 * 0.5 },
      ],
    });

    await player.setVolume(80);

    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.cool} **Adjusting parameters for a richer and fuller sound !**`,
          ),
        ],
        components: [],
      })
      .then(async (fb) =>
        setTimeout(async () => {
          await fb
            .edit({
              embeds: [
                new client.embed().desc(
                  `${
                    `${res}\n` +
                    `${emoji.yes} Set vol to **80%** to reduce distortions\n` +
                    `${emoji.yes} Optimized params for best experience\n` +
                    `${emoji.yes} Audio spectrum - **Harman target 2019**\n`
                  }`,
                ),
              ],
              components: [],
            })
            .catch(() => {});
        }, 2000),
      )
      .catch(() => {});
  },
};
