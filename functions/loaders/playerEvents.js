/* made by snow.ded - getto */

const { readdirSync } = require("fs");
module.exports = async (client) => {
  let count = 0;
  readdirSync("./events/player").forEach((file) => {
    const event = require(`${process.cwd()}/events/player/${file}`);
    client.manager.on(event.name, (...args) => event.run(client, ...args));
    count++;
  });
  return count;
};
