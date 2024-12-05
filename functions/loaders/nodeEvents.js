/* made by snow.ded - getto */

const { readdirSync } = require("fs");
module.exports = async (client) => {
  let count = 0;
  readdirSync("./events/node").forEach((file) => {
    const event = require(`${process.cwd()}/events/node/${file}`);
    client.manager.shoukaku.on(event.name, (...args) =>
      event.run(client, ...args),
    );
    count++;
  });
  return count;
};
