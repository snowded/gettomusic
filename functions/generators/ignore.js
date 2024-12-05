/* made by snow.ded - getto */

const { AttachmentBuilder, ActionRowBuilder } = require("discord.js");

module.exports = async (client, message, emoji, ignored, menu = false) => {
  await message.guild.channels.fetch();

  let channels = await message.guild.channels.cache.filter(
    (ch) =>
      ch.type == 0 &&
      ch !== message.guild.rulesChannel &&
      ch
        .permissionsFor(message.guild.members.me)
        .has(["ViewChannel", "SendMessages", "EmbedLinks"]),
  );

  let options = channels.map((ch) => ({
    label: `${ch.name.substring(0, 25)}`,
    emoji: ignored.includes(ch.id) ? emoji.rem : emoji.add,
    value: `${ignored.includes(ch.id) ? `rem` : `add`}_${ch.id}`,
  }));

  const maxOptions = 25;
  const noOfMenus = Math.ceil(options.length / maxOptions);

  let menus = [];
  for (let i = 0; i < noOfMenus; i++) {
    const start = i * maxOptions;
    const end = Math.min((i + 1) * maxOptions, options.length);

    const menuOptions = options.slice(start, end);

    let menu = new (require("discord.js").StringSelectMenuBuilder)()
      .setCustomId(`menu_${i}`)
      .setMinValues(1)
      .setMaxValues(menuOptions.length - 1)
      .setPlaceholder("Select channel/(s) here . . . ")
      .addOptions(menuOptions);

    menus.push(new ActionRowBuilder().addComponents(menu));
  }
  let embed = new client.embed()
    .desc(
      `**${emoji.cog} Ignored Channels :**\n\n` +
        `${
          ignored.length > 0
            ? ignored.map((id) => `${emoji.point} <#${id}>\n`).join("")
            : `No ignored channels`
        } `,
    )
    .thumb(`https://cdn-icons-png.flaticon.com/512/6311/6311375.png`)
    .setFooter({
      text: `made with love for ya'll ~ snoww.ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ`,
    });

  return menu
    ? {
        embeds: [embed],
        components: menus,
      }
    : {
        embeds: [embed],
      };
};
