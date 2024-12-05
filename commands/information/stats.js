/* made by snow.ded - getto */

const genGraph = require("@gen/pingGraph.js");
const { ActionRowBuilder } = require("discord.js");
const moment = require('moment');


module.exports = {
  name: "stats",
  aliases: ["about", "info", "botinfo"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's shard stats",
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
    let e = new client.embed().desc(
      `<a:bongolovewave:1308028305341026336> — *fetching info for you.. hold tight!*`,
    );
    let wait = await message.reply({ embeds: [e] });


    let v = await client.cluster.broadcastEval(async (x) => {
      let cpu = "[ N/A ]";
      await new Promise(async (resolve, reject) => {
        require("os-utils").cpuUsage((v) => {
          resolve(v);
        });
      }).then((value) => {
        return (cpu = value);
      });

      let users = `> - Users: Users : **\`${(x.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0, ))} users.`

      let stats =
        `
        > drizzle is a music bot made with love for people who enjoy rythymically fantastic audio.
        
        > <a:discord_rise:1309791049019031632> **[https://discord.gg/drizzle](https://discord.gg/snoww) — <:tutuadd:1309791258822184961> [https://drizzle.gg/invite](https://discord.com/oauth2/authorize?client_id=1277355922955567104)**`;

      return [stats];
    });

    let statsEmbed = new client.embed()
      //.setImage("https://github.com/snowded/Getto.DiscordBot/blob/main/gettobannernew.png?raw=true")
      .setAuthor({
        name: `drizzle xd. — About.`,
        iconURL: client.user.displayAvatarURL(),
  })
      .setFooter({
        text: `healing mfs through music — drizzle xd.`,
        iconURL: client.user.displayAvatarURL(),
      });
    let nodeStatsEmbed = new client.embed()
      .setAuthor({
        name: `drizzle xd. — Information.`,
        iconURL: client.user.displayAvatarURL(),
  })
  
      .desc(
        [...client.manager.shoukaku.nodes.values()]
          .map(
            (node, x) =>
              `> - Latency: ${node.latency}ms.
               > - Shards: ${client.manager.shoukaku.nodes.size}.
               > - Ping: ${client.ws.ping}ms.
               > - Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB.
               > - Servers: ${client.guilds.cache.size} servers.
               > - Users: ${client.guilds.memberCount.size} users.
               > - Channels: ${client.channels.cache.size} channels.
               > - Created: <t:${Math.floor(client.user.createdTimestamp / 1000)}:F>.
               > - Uptime: ${client.uptime}.
               > - Commands: ${client.commands.size}.
            `,
          )
          .join("\n\n"),
      )
      .setFooter({
        text: `healing mfs through music — drizzle xd.`,
      });

    const uri = await genGraph(
      client.ws.ping,
      wait.createdAt - message.createdAt,
    );
    const graphEmbed = new client.embed().setAuthor({
      name: `drizzle xd. — Developer.`,
      iconURL: client.user.displayAvatarURL(),
}).desc(
      `<:dottutu:1253125764686020683>\`:\` **Below is the info about the Bot Developer.**\n\n` + 
      `<:code:1270710529933185096> **Owner & Developer**\n` +
      `**\`・\` [snoww.](https://discord.com/channels/@me/1092374628556615690)**\n` +
      `<:rdx_white_arrow:1309498347668901919> **Status : <a:sleeping_vw:1266164794654986251> Sleeping Zzz**\n` +
      `> -# Socials \`:\` [GitHub](https://github.com/snowded) — [Discord](https://discord.gg/snoww) — [Guns](https://guns.lol/snoww.)`
    ).thumb(client.user.displayAvatarURL()).setFooter({
      text: `healing mfs through music — drizzle xd.`,
      iconURL: client.user.displayAvatarURL(),
    });

    for (i = 0; i < v.length; i++) {
      statsEmbed.addFields({
        name: ` `,
        value: `
        > <:rdx_white_arrow:1309498347668901919> **drizzle is a music bot made with love for people who enjoy rythymically fantastic audio.**
        
        > <a:discord_rise:1309791049019031632> **[drizzle.gg/support](https://discord.gg/snoww) — <:tutuadd:1309791258822184961> [drizzle.gg/invite](https://discord.com/oauth2/authorize?client_id=1277355922955567104)**`,
        inline: false,
      });
    }

    let page = 0;
    let pages = [statsEmbed, nodeStatsEmbed, graphEmbed];

    const btn1 = new client.button().primary(`stats`, ``, `<:tutuhome:1271864355771908166>`);
    const btn2 = new client.button().primary(`node`, `Information`);
    const btn3 = new client.button().primary(`graph`, `About Developer`, `<:tutucode:1270710529933185096>`);
    const btn4 = new client.button().danger(`stop`, ``, `<:gettostop:1277360986025627658>`);

    const row = new ActionRowBuilder().addComponents(btn1, btn2, btn3, btn4);

    let m = await wait
      .edit({ embeds: [pages[page]], components: [row] })
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
      time: 100000,
      idle: 100000 / 2,
    });

    collector?.on("collect", async (c) => {
      if (!c.deferred) await c.deferUpdate();

      switch (c.customId) {
        case "stats":
          page = 0;
          await m.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "node":
          page = 1;
          await m.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "graph":
          page = 2;
          await m.edit({ embeds: [pages[page]] }).catch(() => {});
          break;

        case "stop":
          await collector.stop();
          break;

        default:
          break;
      }
    });

    collector?.on("end", async (collected, reason) => {
      await m
        .edit({
          components: [],
        })
        .catch(() => {});
    });
  },
};
