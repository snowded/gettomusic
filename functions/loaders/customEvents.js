/* made by snow.ded - getto */

const { readdirSync } = require("fs");
module.exports = async (client) => {
  let count = 0;
  readdirSync("./events/custom").forEach((file) => {
    const event = require(`${process.cwd()}/events/custom/${file}`);
    client.on(event.name, (...args) => {
      event.run(client, ...args);
    });
    count++;
  });
  return count;
};
