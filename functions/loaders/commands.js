/* made by snow.ded - getto */

const { readdirSync } = require("fs");

module.exports = async (client) => {
  let count = 0;
  readdirSync("./commands").forEach((dir) => {
    const commandFiles = readdirSync(`./commands/${dir}/`).filter((f) =>
      f.endsWith(".js"),
    );
    for (const file of commandFiles) {
      count++;
      const command = require(`${process.cwd()}/commands/${dir}/${file}`);
      client.commands.set(command.name, command);
    }
  });
  return count;
};
