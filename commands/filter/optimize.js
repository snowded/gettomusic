/* made by snow.ded - getto */

module.exports = {
  name: "optimize",
  aliases: [],
  cooldown: "",
  category: "filter",
  usage: "",
  description: "Optimize for poor network",
  args: false,
  vote: false,
  new: true,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const { channel } = message.member.voice;

    let res;
    try {
      channel.edit({
        bitrate: 8000,
      });
      res = `${emoji.yes} Set voice channel bitrate to **8kbps**`;
    } catch (e) {
      res = `${emoji.bell} Please set the vc bitrate to min manually`;
    }

    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.cool} **Adjusting parameters for better connectivity !**`,
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
                    `${emoji.yes} Optimized params for best experience\n` +
                    `${emoji.yes} Audio spectrum - **Sonarworks target**\n`
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
