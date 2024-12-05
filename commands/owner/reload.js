/* made by snow.ded - getto */

module.exports = {
  name: "reload",
  aliases: ["rl"],
  cooldown: "",
  category: "owner",
  usage: "<all / commands* / events>",
  description: "Reloads given argument",
  args: false,
  vote: false,
  new: false,
  admin: false,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    let res = ``;
    switch (args[0]) {
      case "events":
        res = await require("@reloaders/reloadEvents.js")(client);
        break;
      case "emojis":
        res = [await require("@reloaders/reloadEmojis.js")(client)];
        break;
      case "commands":
        res = [await require("@reloaders/reloadCommands.js")(client)];
        break;
      case "functions":
        res = [await require("@reloaders/reloadFunctions.js")(client)];
        break;
      case "presets":
        res = [await require("@reloaders/reloadPresets.js")(client)];
        break;
      case "all":
      default:
        res = await Promise.all([
          await require("@reloaders/reloadEmojis.js")(client),
          await require("@reloaders/reloadPresets.js")(client),
          await require("@reloaders/reloadFunctions.js")(client),
          await require("@reloaders/reloadCommands.js")(client),
          await require("@reloaders/reloadEvents.js")(client),
        ]);
        break;
    }

    await message.reply({ embeds: [new client.embed().desc(res.join("\n"))] });
  },
};
