/* made by snow.ded - getto */

const radio = require("@assets/radioLinks.js");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = async (client, customId, language) => {
  rad = radio[customId];
  const options = await Promise.all(
    Object.entries(rad).map(async ([key, label]) => ({
      label: key.charAt(0).toUpperCase() + key.substring(1),
      value: key,
      emoji: client.emoji.rad,
    })),
  );
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder("Select radio genre (" + language + ") . . .")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(options);

  return new ActionRowBuilder().addComponents(menu);
};
