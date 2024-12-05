const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  cooldown: "",
  category: "information",
  usage: "",
  description: "Shows bot's help menu",
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
    let categories = ['music', 'config', 'filter', 'information', 'all'];

    const categoryEmbeds = {
      music: new EmbedBuilder()
        .setDescription('<:reonVoice:1258806010001231942> **Music Commands**\n\n> <:DND:1274842952237056142> `autoplay`, `clear`, `grab`, `join`, `leave`, `loop`, `nowplaying`, `pause`, `play`, `previous`, `queue`, `radio`, `rejoin`, `remove`, `resume`, `search`, `seek`, `shuffle`, `similar`, `skip`, `stop`, `volume`')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }),

      config: new EmbedBuilder()
        .setDescription('<:cogs:1274729909444677743> **Config Commands**\n\n> <:DND:1274842952237056142> `247`, `buy`, `config`, `ignore`, `prefix`, `premium`, `preset`, `profile`, `redeem`')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }),

      filter: new EmbedBuilder()
        .setDescription('<:tutu:1267939473652580382> **Filter Commands**\n\n> <:DND:1274842952237056142> `enhance`, `equalizer`, `filter`, `optimize`')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }),

      information: new EmbedBuilder()
        .setDescription('<:tutuWarn:1267939299983364227> **Information Commands**\n\n> <:DND:1274842952237056142> `balance`, `help`, `invite`, `ping`, `report`, `stats`, `support`, `vote`')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }),
      
      all: new EmbedBuilder()
        .setDescription(`${emoji.music} **[Music](${client.support})**\n> \`autoplay\`, \`clear\`, \`grab\`, \`join\`, \`leave\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`previous\`, \`queue\`, \`radio\`, \`rejoin\`, \`remove\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`similar\`, \`skip\`, \`stop\`, \`volume\`\n\n${emoji.config} **[Config](${client.support})**\n> \`247\`, \`buy\`, \`config\`, \`ignore\`, \`prefix\`, \`premium\`, \`preset\`, \`profile\`, \`redeem\`\n\n${emoji.filter} **[Filter](${client.support})**\n> \`enhance\`, \`equalizer\`, \`filter\`, \`optimize\`\n\n${emoji.information} **[Information](${client.support})**\n> \`balance\`, \`help\`, \`invite\`, \`ping\`, \`report\`, \`stats\`, \`support\`, \`vote\``)
        .setFooter({ text: `Requested by ${message.author.tag}.`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }),
    };

    const embed = new EmbedBuilder()
    .setAuthor({
      name: `Hey ${message.author.displayName} — Clove here!`,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setDescription(
      `<a:bongolovewave:1308028305341026336> **Welcome to Clove's Help Lounge!**\n` +
        `-# <:reoncontbranch:1308034060249071728> **Prefix For This Server** \`${client.prefix}\`\n` +
        `-# <:reoncontbranch:1308034060249071728> **Commands Options : \`${client.commands.size}\` — Categories Count: \`5\`**\n` +
        `-# <:reonendbranch:1308028142648299530> **Browse Through In the Drop Down Below!**`
    )
    
    .setFooter({
      text: `Requested by ${
        message.author.globalName || message.author.tag
      } in ${message.guild.name}.`,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    let menu = new StringSelectMenuBuilder()
      .setCustomId("menu")
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder("Browse Commands of getto. ~ snoww.")
      .addOptions([
        {
          label: "Music",
          value: "music",
          //emoji: `${emoji.music}`,
        },
        {
          label: "Config",
          value: "config",
          //emoji: `${emoji.config}`,
        },
        {
          label: "Filter",
          value: "filter",
          //emoji: `${emoji.filter}`,
        },
        {
          label: "Information",
          value: "information",
          //emoji: `${emoji.information}`,
        },
        {
          label: "Show all commands",
          value: "all",
          //emoji: `${emoji.all}`,
        },
      ]);

    const selectMenu = new ActionRowBuilder().addComponents(menu);

    const backButton = new ButtonBuilder()
      .setCustomId("back")
      .setEmoji("1308036172605554720")
      .setStyle(ButtonStyle.Success);

    const m = await message.reply({
      embeds: [embed],
      components: [selectMenu],
    });

    const filter = async (interaction) => {
      if (interaction.user.id === message.author.id) {
        return true;
      }
      await interaction
        .reply({
          embeds: [
            new client.embed().setDescription(
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
      time: 300000, // 5 minutes timeout
    });

    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      const category = interaction.values?.[0] || interaction.customId;
      let newEmbed;
      let components = [];

      switch (category) {
        case "home":
          newEmbed = embed;
          components = [selectMenu];
          break;

        case "all":
          newEmbed = categoryEmbeds.all; 
          components = [
            new ActionRowBuilder().addComponents(backButton),
          ];
          break;

        case "back":
          newEmbed = embed;
          components = [selectMenu];
          break;

        default:
          newEmbed = categoryEmbeds[category] || embed;
          components = [
            new ActionRowBuilder().addComponents(backButton),
          ];
          break;
      }

      await m.edit({
        embeds: [newEmbed],
        components: components,
      }).catch(() => {});
    });

    collector?.on("end", async () => {
      await m.edit({ components: [] }).catch(() => {});
    });
  },
};