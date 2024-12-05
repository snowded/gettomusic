/* made by snow.ded - getto */

const { readdirSync } = require("fs");
module.exports = async (client) => {
  let count = 0;
  readdirSync("./events/client").forEach((file) => {
    const event = require(`${process.cwd()}/events/client/${file}`);
    client.on(event.name, (...args) => {
      event.run(client, ...args);
    });
    count++;
  });
  return count;
};
