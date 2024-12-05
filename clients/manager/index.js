/** @format
 *
 * Manager By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

require("module-alias/register");
const dokdo = require("dokdo");
const YML = require("js-yaml").load(
  require("fs").readFileSync("./config.yml", "utf8"),
);

const client = new (require("discord.js").Client)({ intents: 3276799 });

client.logger = require("@plugins/logger");
client.embed = require("@plugins/embed")("#FFFF00");
client.Jsk = new dokdo.Client(client, {
  prefix: ".",
  aliases: ["jsk"],
  owners: [YML.MANAGER.OWNER],
});

require("./func.js")(client);
require("./events/backup.js")(client);
require("./events/dbCheck.js")(client);
//require('./commands/YoutubeNotifications/YtHandler.js')(client);

client.once("ready", async () => {
  client.logger.log(`Ready! Logged in as ${client.user.tag}`, "ready");
});

client.on("messageCreate", (message) => {
  message.content.includes(`jsk`) ? client.Jsk.run(message) : null;
});

require("@utils/antiCrash.js")(client);

client.login(YML.MANAGER.TOKEN);
