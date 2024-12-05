/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "invite",
  aliases: ["inv"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's invite link",
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
    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${emoji.bell} **Click one of the buttons below to add me**`,
          ),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new client.button().link("Admin Perms", client.invite.admin),
            new client.button().link("Required Perms", client.invite.required),
          ),
        ],
      })
      .catch(() => {});
  },
};
