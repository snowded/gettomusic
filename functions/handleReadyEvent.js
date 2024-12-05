/* made by snow.ded - getto */

const { url } = require("inspector");

module.exports = async (client) => {
  await client.user.setPresence({
    activities: [
      {
        name: `${client.prefix}help | getto.`,
        type: require("discord.js").ActivityType.Streaming,
        url: `https://twitch.tv`
      },
    ],
    status: "online",
  });

  let mcount = 0;
  let gcount = client.guilds.cache.size;
  client.guilds.cache.forEach((g) => {
    mcount += g.memberCount;
  });

  let eventsSize = {};
  let commandsSize = {};
  commandsSize.slash = {};
  [
    eventsSize.client,
    eventsSize.node,
    eventsSize.player,
    eventsSize.custom,
    commandsSize.message,
  ] = await Promise.all([
    await require("@loaders/clientEvents.js")(client),
    await require("@loaders/nodeEvents")(client),
    await require("@loaders/playerEvents")(client),
    await require("@loaders/customEvents.js")(client),
    await require("@loaders/commands.js")(client),
  ]);

  client.invite = {
    required: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=37080065&scope=bot`,
    admin: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`,
  };

  client.endEmbed = new client.embed()
    .desc(
      `**Thanks For Using Getto.**\n` +
        `**Would be Great If You'd Vote for me. :))) [voting me](https://discord.gg/snoww)**`,
    )
    .thumb(client.user.displayAvatarURL())
    .setAuthor({
      iconURL: client.user.displayAvatarURL(),
      name: client.user.username,
    })
    .setFooter({ text: "made with love for ya'll ~ snoww",
      iconURL: "https://cdn.discordapp.com/emojis/1131909990630834217.webp",
     });

  client.log(
    `Loaded ` +
      ` Client: ${eventsSize.client} ` +
      ` Node: ${eventsSize.node} ` +
      ` Player: ${eventsSize.player} ` +
      ` Custom: ${eventsSize.custom} `,
    "event",
  );
  client.log(`Loaded ` + ` Message: ${commandsSize.message} `, "cmd");
  client.log(`Ready for ${gcount} Servers | ${mcount} Users`, "ready");
};
