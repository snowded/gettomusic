/* made by snow.ded - getto */

const Jishaku = require("dokdo");
require("module-alias/register");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");
const { Collection, Partials, Client, WebhookClient } = require("discord.js");

module.exports = class ExtendedClient extends Client {
  constructor() {
    super({
      intents: 3276543,

      failIfNotExists: false,
      restRequestTimeout: 60000,

      rest: {
        timeout: 60000,
      },

      sweepers: {
        messages: {
          interval: 1800,
          lifetime: 1800,
        },
      },

      allowedMentions: {
        repliedUser: false,
        parse: ["users", "roles"],
      },

      partials: [
        Partials.User,
        Partials.Guilds,
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
      ],

      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });

    this.setMaxListeners(25);

    this.manager;

    this.cluster = new ClusterClient(this);

    this.aliases = new Collection();
    this.commands = new Collection();
    this.cooldowns = new Collection();

    this.config = require("../config/options");

    this.owners = this.config.bot.owners;
    this.admins = this.config.bot.admins;
    this.webhooks = this.config.webhooks;
    this.support = this.config.links.support;

    this.button = require("@plugins/button.js");
    this.logger = require("@plugins/logger.js");

    this.db = {
      pfx: require("@db/prefix.js"),
      coins: require("@db/coins.js"),
      preset: require("@db/preset.js"),
      ignore: require("@db/ignore.js"),
      premium: require("@db/premium.js"),
      vouchers: require("@db/vouchers.js"),
      blacklist: require("@db/blacklist.js"),
      twoFourSeven: require("@db/twoFourSeven.js"),
    };
    this.formatTime = require("@formatters/formatTime.js");
    this.formatBytes = require("@formatters/formatBytes.js");

    this.categories = require("fs").readdirSync("./commands");

    this.once("ready", async (client) => {
      await require("@functions/handleReadyEvent.js")(this);
    });

    this.webhooks = {
      error: new WebhookClient({ url: this.webhooks.error }),
      static: new WebhookClient({ url: this.webhooks.static }),
      server: new WebhookClient({ url: this.webhooks.server }),
      player: new WebhookClient({ url: this.webhooks.player }),
      command: new WebhookClient({ url: this.webhooks.command }),
    };
  }

  sleep = (t) => {
    return new Promise((r) => setTimeout(r, t));
  };

  getPlayer = async (id) => {
    let player = await this.manager.getPlayer(id);
    return player ? player : null;
  };

  log = (message, type = "log") => {
    return this.logger.log(message, type, this.user?.username || undefined);
  };

  connect = async (token, prefix = "%", emoji, color, auth, voteUri) => {
    this.prefix = prefix;
    this.jsk = new Jishaku.Client(this, {
      aliases: ["jsk"],
      prefix: this.prefix,
      owners: this.owners,
    });
    this.vote = voteUri;
    this.emojiSet = emoji;
    this.topGgAuth = auth;
    this.color = color || "#2c2d31";
    await require("@plugins/player")(this);
    this.emoji = require("@assets/emoji.js")[this.emojiSet];
    this.embed = require("@plugins/embed.js")(this.color);
    await super
      .login(token)
      .then((token) => {
        this.log(`Client logged in !!!`, `ready`);
      })
      .catch((error) => {
        this.log(`Client cannot be logged in !!! ${error}`, `warn`);
      });
  };
};
