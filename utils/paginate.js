/* made by snow.ded - getto */

const { ActionRowBuilder } = require("discord.js");

module.exports = async (client, message, pages) => {
  if (pages.length == 1)
    return await message
      .reply({
        embeds: [
          pages[0].setFooter({
            text: `Page [1/1] By snoww.`,
          }),
        ],
      })
      .catch(() => {});

  let page = 0;
  const row = new ActionRowBuilder().addComponents(
    new client.button().secondary(`back`, `Back`),
    new client.button().secondary(`next`, `Next`),
    new client.button().secondary(`home`, `Home`),
    new client.button().danger(`end`, `<:gettostop:1277360986025627658>`),
  );

  const m = await message.channel
    .send({
      embeds: [
        pages[page].setFooter({
          text: `Page [${page + 1}/${pages.length}] By Immortality`,
        }),
      ],
      components: [row],
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
            `${client.emoji.no} **This isn't meant for you**`,
          ),
        ],
        ephemeral: true,
      })
      .catch(() => {});
    return false;
  };
  const collector = m?.createMessageComponentCollector({
    filter,
    time: 60000,
  });

  collector?.on("collect", async (interaction) => {
    await interaction.deferUpdate();

    switch (interaction.customId) {
      case "home":
        page = 0;
        await m
          .edit({
            embeds: [
              pages[page].setFooter({
                text: `Page [${page + 1}/${pages.length}] By Immortality`,
              }),
            ],
          })
          .catch(() => {});
        break;

      case "back":
        page = page > 0 ? --page : pages.length - 1;
        await m
          .edit({
            embeds: [
              pages[page].setFooter({
                text: `Page [${page + 1}/${pages.length}] By Immortality`,
              }),
            ],
          })
          .catch(() => {});
        break;

      case "next":
        page = page + 1 < pages.length ? ++page : 0;
        await m
          .edit({
            embeds: [
              pages[page].setFooter({
                text: `Page [${page + 1}/${pages.length}] By Immortality`,
              }),
            ],
          })
          .catch(() => {});
        break;

      case "end":
        await collector.stop();
        break;
    }
  });

  collector?.on("end", (collected, reason) => {
    m.edit({
      components: [],
    }).catch(() => {});
  });
};
