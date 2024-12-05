/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "rejoin",
  aliases: [],
  cooldown: "",
  category: "music",
  usage: "",
  description: "rejoin a voice channel",
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
    const { channel } = message.member.voice;
    const player = await client.getPlayer(message.guild.id);

    let msg = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.cool} **Re-creating player and rejoining**`,
          ),
        ],
      })
      .catch(() => {});

    await player.destroy();
    await client.sleep(1500);
    await client.manager.createPlayer({
      voiceId: channel.id,
      textId: message.channel.id,
      guildId: message.guild.id,
      shardId: message.guild.shardId,
      loadBalancer: true,
      deaf: true,
    });

    let emb = new client.embed().desc(
      `${emoji.on} **Re-joined <#${channel.id}> and bound to <#${player.textId}>**`,
    );
    await msg?.edit({ embeds: [emb] }).catch(() => {});
  },
};
