/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j", "move"],
  cooldown: "",
  category: "music",
  usage: "",
  description: "join a voice channel",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const { channel } = message.member.voice;
    const player = await client.getPlayer(message.guild.id);

    if (player) {
      let row = new ActionRowBuilder().addComponents(
        new client.button().success("move", "Move Me"),
      );
      let m = await message
        .reply({
          embeds: [
            new client.embed()
              .desc(
                `${emoji.bell} **I'm already connected to <#${player.voiceId}>**`,
              )
              .setFooter({
                text: `This move/shift(s) both text and voice channel/(s)`,
              }),
          ],
          components: [row],
        })
        .catch(() => {});

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
        if (!interaction.deferred) interaction.deferUpdate();

        m?.edit({
          embeds: [
            new client.embed().desc(
              `${emoji.cool} **Joining <#${channel.id}> . . . **`,
            ),
          ],
          components: [],
        }).catch(() => {});

        let res = null;
        try {
          await message.guild.members.me.voice.setChannel(channel);
          res = 1;
        } catch (e) {
          res = e;
        }

        if (res != 1) {
          return await m?.edit({
            embeds: [new client.embed().desc(`${res} \`MoveMembers\``)],
          });
        }

        let newPlayer = await client.getPlayer(message.guild.id);
        newPlayer.voiceId = channel.id;
        newPlayer.textId = message.channel.id;
        let data = await client.db.twoFourSeven.get(
          `${client.user.id}_${message.guild.id}`,
        );
        if (data)
          await client.db.twoFourSeven.set(
            `${client.user.id}_${message.guild.id}`,
            {
              TextId: newPlayer.textId,
              VoiceId: newPlayer.voiceId,
            },
          );

        let emb = new client.embed().desc(
          `${emoji.on} **Joined <#${channel.id}> and bound to <#${message.channel.id}>**`,
        );

        await m.edit({ embeds: [emb], components: [] }).catch(() => {});
      });

      collector?.on("end", async (collected, reason) => {
        await m
          ?.edit({
            components: [],
          })
          .catch(() => {});
      });
      return;
    }

    let msg = await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.bell} **Joining <#${channel.id}> . . . **`,
          ),
        ],
      })
      .catch(() => {});

    await client.manager.createPlayer({
      voiceId: channel.id,
      textId: message.channel.id,
      guildId: message.guild.id,
      shardId: message.guild.shardId,
      loadBalancer: true,
      deaf: true,
    });

    let emb = new client.embed().desc(
      `${emoji.on} **Joined <#${channel.id}> and bound to <#${message.channel.id}>**`,
    );

    let newPlayer = await client.getPlayer(message.guild.id);
    newPlayer.voiceId = channel.id;
    newPlayer.textId = message.channel.id;

    let data = await client.db.twoFourSeven.get(
      `${client.user.id}_${message.guild.id}`,
    );
    if (data)
      await client.db.twoFourSeven.set(
        `${client.user.id}_${message.guild.id}`,
        {
          TextId: newPlayer.textId,
          VoiceId: newPlayer.voiceId,
        },
      );

    await msg?.edit({ embeds: [emb] }).catch(() => {});
  },
};
