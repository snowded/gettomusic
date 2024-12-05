/* made by snow.ded - getto */

const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "buy",
  aliases: [],
  cooldown: "",
  category: "config",
  usage: "",
  description: "Use coins to buy premium",
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
    let [coins, premiumUser, premiumGuild] = await Promise.all([
      parseInt((await client.db.coins.get(`${message.author.id}`)) || 0),
      await client.db.premium.get(`${client.user.id}_${message.author.id}`),
      await client.db.premium.get(`${client.user.id}_${message.guild.id}`),
    ]);

    let user = new StringSelectMenuBuilder()
      .setCustomId("user")
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder("Choose your premium plan (User)")
      .addOptions([
        {
          label: "7 days premium (300 coins)",
          value: "7_300",
          emoji: `${emoji.premium}`,
        },
        {
          label: "28 days premium (1000 coins)",
          value: "28_1000",
          emoji: `${emoji.premium}`,
          disabled: true,
        },
        {
          label: "84 days premium (2500 coins)",
          value: "84_2500",
          emoji: `${emoji.premium}`,
        },
        {
          label: "168 days premium (5000 coins)",
          value: "168_5000",
          emoji: `${emoji.premium}`,
        },
      ]);
    let guild = new StringSelectMenuBuilder()
      .setCustomId("guild")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions([
        {
          label: "7 days premium (500 coins)",
          value: "7_500",
          emoji: `${emoji.premium}`,
        },
        {
          label: "28 days premium (1800 coins)",
          value: "28_1800",
          emoji: `${emoji.premium}`,
          disabled: true,
        },
        {
          label: "84 days premium (5000 coins)",
          value: "84_5000",
          emoji: `${emoji.premium}`,
        },
        {
          label: "168 days premium (7500 coins)",
          value: "168_7500",
          emoji: `${emoji.premium}`,
        },
      ]);

    let rows = [
      premiumUser
        ? new ActionRowBuilder().addComponents(
            user
              .setDisabled(true)
              .setPlaceholder("User premium is already active"),
          )
        : new ActionRowBuilder().addComponents(
            user
              .setDisabled(false)
              .setPlaceholder("Choose your premium plan (User)"),
          ),
      premiumGuild
        ? new ActionRowBuilder().addComponents(
            guild
              .setDisabled(true)
              .setPlaceholder("Guild premium is already active"),
          )
        : new ActionRowBuilder().addComponents(
            guild
              .setDisabled(false)
              .setPlaceholder("Choose your premium plan (Guild)"),
          ),
    ];

    const m = await message
      .reply({
        embeds: [
          new client.embed()
            .desc(
              `${emoji.coin} **You have a total of ${coins || `0`} coins\n\n` +
                `${emoji.bell} No refunds applicable. [T&C apply](${client.support})**`,
            )

            .setFooter({
              text: `This isn't a real but an in-game currency. User discretion is advised.ㅤㅤ`,
            }),
        ],
        components: rows,
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
      idle: 60000 / 2,
    });

    collector?.on("collect", async (interaction) => {
      if (!interaction.deferred) await interaction.deferUpdate();

      const choice = interaction.values[0];
      let duration = choice.split("_")[0];
      let coinsNeeded = choice.split("_")[1];
      let type = interaction.customId;

      if (coins < coinsNeeded) {
        await m.edit({ components: rows });
        return interaction.followUp({
          embeds: [
            new client.embed().desc(
              `**ayy! you need coins? right. I gotcha**\n\n` +
                `<a:dot:1213156294219931760> **Easy Peasyy.. <:downarrow_lucid:1213161628208594964>**\n` +
                `> Each command used (1-3 coins).\n` +
                `> Add getto in server (150 coins).\n\n` +
                `<a:dot:1213156294219931760> **We Talkin Ragss.. <:downarrow_lucid:1213161628208594964>**\n` +
                `> Boost [support server](https://discord.gg/snoww) (1000 coins).\n` +
                `> Pay 1M 0w0 or 1$ (1800 coins).\n\n` +
                `${emoji.warn} **You need ${
                  coinsNeeded - coins
                } more coins for this plan**`,
            ),
          ],
          ephemeral: true,
        });
      }

      coins = coins - coinsNeeded;
      await client.db.coins.set(`${message.author.id}`, coins);
      let time = new Date();
      time = time.setDate(time.getDate() + parseInt(duration));
      await client.db.premium.set(
        `${client.user.id}_${
          type == "user" ? message.author.id : message.guild.id
        }`,
        time,
      );

      interaction.CustomId;
      await m
        .edit({
          embeds: [
            new client.embed()
              .title(`Premium Activated !`)
              .desc(
                `**${emoji.cool} Expiry : **<t:${Math.round(
                  time / 1000,
                )}:R>\n` +
                  `**${emoji.premium} Premium Type : **${type.toUpperCase()}\n`,
              )
              .addFields({
                name: `Privilages attained :\n`,
                value: `${
                  type == "user"
                    ? `${emoji.on} \`No prefix\`\n` +
                      `${emoji.on} \`Vote bypass\`\n` +
                      `${emoji.on} \`Support priority\`\n` +
                      `${emoji.on} \`Badge in profile\`\n` +
                      `${emoji.on} \`Role in support Server\`\n` +
                      `${emoji.on} \`Early access & more...\``
                    : `${emoji.on} \`Vote bypass\`\n` +
                      `${emoji.on} \`Customizable playEmbed\`\n` +
                      `${emoji.on} \`Better sound quality\`\n` +
                      `${emoji.on} \`Volume limit increase\`\n` +
                      `${emoji.on} \`Early access & more...\``
                }`,
              })
              .thumb(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `thanks ${message.author.username} <3`,
              }),
          ],
          components: [],
        })
        .catch(() => {});
    });

    collector?.on("end", async () => {
      await m.edit({ components: [] }).catch(() => {});
    });
  },
};
