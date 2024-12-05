/* made by snow.ded - getto */

const YML = require("js-yaml").load(
  require("fs").readFileSync("./config.yml", "utf8"),
);
const bot = require("../../main/extendedClient");

const client = new bot();
require("@utils/antiCrash")(client);
client.connect(
  YML.FUEGO.TOKEN,
  YML.FUEGO.PREFIX,
  YML.FUEGO.EMOJIS,
  YML.FUEGO.COLOR,
  YML.FUEGO.TOPGGAUTH,
  YML.FUEGO.VOTEURI,
);
module.exports = client;
