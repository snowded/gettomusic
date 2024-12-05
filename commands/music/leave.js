/* made by snow.ded - getto */

module.exports = {
  name: "leave",
  aliases: ["dc"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "leave voice channel",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: true,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (client, message, args, emoji) => {
    const player = await client.getPlayer(message.guild.id);

    let id = player.voiceId;

    let m = await message
      .reply({
        embeds: [
          new client.embed().desc(`${emoji.cool} **Leaving <#${id}> . . .**`),
        ],
      })
      .catch(() => {});

    await player.destroy();

    await m
      ?.edit({
        embeds: [new client.embed().desc(`${emoji.off} **Left <#${id}>**`)],
      })
      .catch(() => {});
  },
};
