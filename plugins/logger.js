/* made by snow.ded - getto */

const chalk = require("chalk");
const moment = require("moment");

module.exports = class logger {
  static log(content, type = "log", client = "Process") {
    const date = moment().format("DD-MM-YYYY hh:mm:ss");

    const logTypeColors = {
      log: {
        headingColor: (text) => chalk.hex("#ffffff")(text),
        display: "Log",
      },
      warn: {
        headingColor: (text) => chalk.hex("#ffaa00")(text),
        display: "Warning",
      },
      error: {
        headingColor: (text) => chalk.hex("#ff2200")(text),
        display: "Error",
      },
      debug: {
        headingColor: (text) => chalk.hex("#dddd55")(text),
        display: "Debug",
      },
      cmd: {
        headingColor: (text) => chalk.hex("#ff2277")(text),
        display: "Command",
      },
      event: {
        headingColor: (text) => chalk.hex("#0088cc")(text),
        display: "Event",
      },
      ready: {
        headingColor: (text) => chalk.hex("#77ee55")(text),
        display: "Ready",
      },
      database: {
        headingColor: (text) => chalk.hex("#55cc22")(text),
        display: "Database",
      },
      cluster: {
        headingColor: (text) => chalk.hex("#00cccc")(text),
        display: "Cluster",
      },
      player: {
        headingColor: (color) => chalk.hex("#22aaff")(color),
        display: "Player",
      },
      lavalink: {
        headingColor: (color) => chalk.hex("#ff8800")(color),
        display: "Lavalink",
      },
    };

    const log = logTypeColors[type];

    client = client.length > 15 ? client.substring(0, 15) : client;

    const logMessage =
      chalk.bold(
        `${chalk.hex("#2222FF")(date)} -   ` +
          `${chalk.hex("#222255")(client)} ` +
          `${" ".repeat(17 - client.length)}=>   ` +
          `${log.headingColor(
            log.display + " ".repeat(8 - log.display.length),
          )} - `,
      ) + `${chalk.hex("#880088")(content)}`;

    console.log(logMessage);
  }
};
