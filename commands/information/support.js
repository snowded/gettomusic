/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "support",
  aliases: [],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows link to support server",
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
      new client.button().link("Click to join Support Server", client.support),
    );
    await message.reply({
      embeds: [
        new client.embed().desc(
          `${emoji.support} **Need human assistance / help ?**`,
        ),
      ],
      components: [row],
    });
  },
};
