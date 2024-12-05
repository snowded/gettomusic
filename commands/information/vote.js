/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "vote",
  aliases: [],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's vote link",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: false,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const row = new ActionRowBuilder().addComponents(
      new client.button().link(
        "Click here to vote for me",
        client.vote || client.support,
      ),
    );
    await message.reply({
      embeds: [
        new client.embed().desc(
          `${emoji.vote} **Considering voting me on Top.gg ?**`,
        ),
      ],
      components: [row],
    });
  },
};
