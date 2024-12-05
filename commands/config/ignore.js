/* made by snow.ded - getto */
const gen = require("@gen/ignore.js");
module.exports = {
  name: "ignore",
  aliases: ["set"],
  cooldown: "",
  category: "config",
  usage: "<add/del> <channel>",
  description: "Choose your playEmbed",
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
    let ignoredList =
      (await client.db.ignore.get(`${client.user.id}_${message.guild.id}`)) ||
      [];

    if (args[0]) {
      if (args[0].toLowerCase() == "list") {
        return await message.reply(
          await gen(client, message, emoji, ignoredList),
        );
      }

      let channel = message.channel;
      if (args[1]) {
        let id = args[1].match(/<#(\d+)>|(\d+)/);
        id = id ? id.find((group) => group !== undefined) : null;
        channel = message.guild.channels.cache.get(id) || null;
      }

      if (!channel && ["add", "del"].includes(args[0].toLowerCase()))
        return await message.reply({
          embeds: [
            new client.embed().desc(`${emoji.no} **Invalid channel provided**`),
          ],
        });

      switch (args[0].toLowerCase()) {
        case "add":
          if (ignoredList.includes(channel.id))
            return await message.reply({
              embeds: [
                new client.embed().desc(
                  `${emoji.no} **<#${channel.id}> is already present list of ignored channels**`,
                ),
              ],
            });

          await ignoredList.push(channel.id);
          await client.db.ignore.set(
            `${client.user.id}_${message.guild.id}`,
            ignoredList,
          );
          await message.reply({
            embeds: [
              new client.embed().desc(
                `${emoji.yes} **Added <#${channel.id}> to list of ignored channels**`,
              ),
              await gen(client, message, emoji, ignoredList).then(
                (res) => res.embeds[0],
              ),
            ],
          });

          break;
        case "del":
          if (!ignoredList.includes(channel.id))
            return await message.reply({
              embeds: [
                new client.embed().desc(
                  `${emoji.no} **<#${channel.id}> is not present list of ignored channels**`,
                ),
              ],
            });

          let index = ignoredList.indexOf(channel.id);
          index !== -1 ? await ignoredList.splice(index, 1) : null;
          await client.db.ignore.set(
            `${client.user.id}_${message.guild.id}`,
            ignoredList,
          );
          await message.reply({
            embeds: [
              new client.embed().desc(
                `${emoji.yes} **Removed <#${channel.id}> from list of ignored channels**`,
              ),
              await gen(client, message, emoji, ignoredList).then(
                (res) => res.embeds[0],
              ),
            ],
          });
          break;

        default:
          await message.reply({
            embeds: [
              new client.embed().desc(
                `${emoji.no} **Provide a valid sub cmd (add/del)**`,
              ),
            ],
          });
          break;
      }
      return;
    }

    const m = await message.reply(
      await gen(client, message, emoji, ignoredList, true),
    );

    const filter = async (interaction) => {
      if (interaction.user.id === message.author.id) {
        return true;
      }
      await interaction.message.edit({
        components: [selectMenu],
      });
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

      for (let value of interaction.values) {
        let action = value.split("_")[0];
        let id = value.split("_")[1];

        if (action == `add`) {
          ignoredList.push(id);
        } else {
          let index = ignoredList.indexOf(id);
          index !== -1 ? ignoredList.splice(index, 1) : null;
        }
      }

      await client.db.ignore.set(
        `${client.user.id}_${message.guild.id}`,
        ignoredList,
      );

      let updatedIgnoreList =
        (await client.db.ignore.get(`${client.user.id}_${message.guild.id}`)) ||
        [];

      await m.edit(await gen(client, message, emoji, updatedIgnoreList));
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
