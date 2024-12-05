const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

// Load the badges.json file
const specialFilePath = path.join(__dirname, './badges.json');
let specialData = require(specialFilePath);

module.exports = {
  name: "special",
  aliases: ["addspecial", "removespecial"],
  cooldown: 5,
  category: "config",
  usage: "<@user/userID> or list",
  description: "Add, remove a user, or list users in the Special badge list.",
  args: true,
  vote: false,
  new: false,
  admin: true, // Ensure only admins or owners can run this command
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args) => {
    // Handle the list argument

    if (!message.author.id === '1092374628556615690') {
      return;
    }
    if (args[0].toLowerCase() === 'list') {
      if (specialData.snowspe.length === 0) {
        const emptyEmbed = new EmbedBuilder()
          .setDescription("The snowspe badge list is currently empty.")
          .setColor("#000000");

        return message.reply({ embeds: [emptyEmbed] });
      }

      const users = specialData.snowspe.map(id => {
        const user = client.users.cache.get(id);
        return user ? `<@${user.id}>` : `Unknown User (ID: ${user.username} | ${id})`;
      });

      const listEmbed = new EmbedBuilder()
        .setTitle("Special Badge List")
        .setDescription(users.join('\n'))
        .setColor("#000000");

      return message.reply({ embeds: [listEmbed] });
    }

    // Handle adding/removing users
    const targetUser = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!targetUser) {
      const errorEmbed = new EmbedBuilder()
        .setDescription("Please mention a valid user or provide a valid user ID.")
        .setColor("#000000");

      return message.reply({ embeds: [errorEmbed] });
    }

    if (specialData.snowspe.includes(targetUser.id)) {
      // Remove the user if they are already in the list
      specialData.snowspe = specialData.snowspe.filter(id => id !== targetUser.id);
      const removeEmbed = new EmbedBuilder()
        .setDescription(`${targetUser.tag} has been removed from the snowspe badge list.`)
        .setColor("#000000");

      message.reply({ embeds: [removeEmbed] });
    } else {
      // Add the user to the list
      specialData.snowspe.push(targetUser.id);
      const addEmbed = new EmbedBuilder()
        .setDescription(`${targetUser.tag} has been added to the snowspe badge list.`)
        .setColor("#000000");

      message.reply({ embeds: [addEmbed] });
    }

    // Save the updated data back to badges.json
    fs.writeFileSync(specialFilePath, JSON.stringify(specialData, null, 2), 'utf-8');
  },
};
