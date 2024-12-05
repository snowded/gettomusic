/* made by snow.ded - getto */

const fs = require("fs");
const yaml = require("js-yaml");

const YML = yaml.load(fs.readFileSync("./config.yml", "utf8"));

module.exports = {
  spotify: {
    id: YML.SPOTIFY.ID,
    secret: YML.SPOTIFY.SECRET,
  },

  bot: {
    owners: YML.BOT.OWNERS,
    admins: YML.BOT.ADMINS,
  },

  links: {
    support: YML.LINKS.SUPPORT,
    mongoURI: YML.LINKS.MONGO_URI,
  },
  webhooks: {
    error: YML.WEBHOOKS.ERROR,
    static: YML.WEBHOOKS.STATIC,
    server: YML.WEBHOOKS.SERVER,
    player: YML.WEBHOOKS.PLAYER,
    command: YML.WEBHOOKS.COMMAND,
  },
};
