/** @format
 *
 * Manager By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

const time = 1800000;
const YML = require("js-yaml").load(
  require("fs").readFileSync("./config.yml", "utf8"),
);
module.exports = (client) => {
  client.once("ready", async () => {
    const owner = await client.users.fetch(YML.MANAGER.OWNER);
    const { channel } = await owner.send("Getting DM channel");
    const messages = await channel.messages.fetch({ limit: 10 });
    const toDel = messages.filter((msg) => msg.author.id === client.user.id);
    await toDel.forEach(async (m) => await m.delete().catch(() => {}));
    await channel.send("Backup Manager Started").then(async (m) => {
      await client.sleep(10000);
      await m.delete().catch(() => {});
    });
    setInterval(async () => {
      await require("@functions/backup.js")(
        `./fuego-backup.zip`,
        channel,
        time,
      );
    }, time);
  });
};
