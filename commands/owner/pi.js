/* made by snow.ded - getto */

module.exports = {
  name: "pi",
  aliases: [],
  cooldown: "",
  category: "owner",
  usage: "",
  description: "jishaku",
  args: false,
  vote: false,
  new: false,
  admin: true,
  owner: true,
  botPerms: [],
  userPerms: [],
  player: false,
  queue: false,
  inVoiceChannel: false,
  sameVoiceChannel: false,
  execute: async (client, message, args, emoji) => {
    const m = await message.reply("Fetching data, please wait...");

    const intents = require("discord.js").GatewayIntentBits;
    const DateFormatting = (date) => `<t:${Math.floor(Number(date) / 1000)}:R>`;

    const clusters = () => {
      let arr = client.options.shards;
      let subarrayCount = 0;
      for (const element of arr) {
        if (Array.isArray(element)) {
          subarrayCount++;
        }
      }
      return subarrayCount === 0 ? 1 : subarrayCount;
    };

    let cpu =
      (await new Promise((resolve, reject) => {
        require("os-utils").cpuUsage((v) => resolve(v.toFixed(2)));
      })) || "[ N/A ]";

    const type = client.shard ? "shard" : "cluster";

    const getValues = async () => {
      const res = await client[type].broadcastEval((client) => {
        const mcount = client.guilds.cache.reduce(
          (sum, g) => sum + g.memberCount,
          0,
        );
        return [client.users.cache.size, mcount, client.guilds.cache.size];
      });

      const [mcc, mc, gc] = res.reduce(
        (acc, n) => [acc[0] + n[0], acc[1] + n[1], acc[2] + n[2]],
        [0, 0, 0],
      );

      return [mcc, mc, gc];
    };

    const total = await getValues();

    m.edit(
      `**Fuego v5.0.0 **\n` +
        `│\n` +
        `│ **Process Information:**\n` +
        `│ㅤ ├ PID \`${process.pid}\`\n` +
        `│ㅤ ├ PPID \`${process.ppid}\`\n` +
        `│ㅤ ├ Djs \`v${require("discord.js").version}\`\n` +
        `│ㅤ ├ Node.js \`${process.version}\`\n` +
        `│ㅤ ├ Platform \`${process.platform}\`\n` +
        `│ㅤ ├ CPU Usage \`${cpu}%\`\n` +
        `│ㅤ ├ Memory Usage  \`${client.formatBytes(
          process.memoryUsage().rss,
        )}\`\n` +
        `│ㅤ ├ Took \`${(client.readyAt - performance.timeOrigin).toFixed(
          2,
        )}ms\` to load\n` +
        `│ㅤ └ Bot was ready ${DateFormatting(client.readyAt ?? 0)}\n` +
        `│\n` +
        `│ **Guild and User Statistics:**\n` +
        `│ㅤ ├ Mode:  Cluster\n` +
        `│ㅤ ├ Options: \n` +
        `│ㅤ │ㅤ ├ \`${client.options.shardCount}\` Shard(s)\n` +
        `│ㅤ │ㅤ └\`${clusters()}\` Cluster/(s)\n` +
        `│ㅤ ├ Current Cluster: \n` +
        `│ㅤ │ㅤ ├ \`${client.guilds.cache.size}\` guilds, \n` +
        `│ㅤ │ㅤ └ Users :\n` +
        `│ㅤ │ㅤㅤ ├ Cached: \`${client.users.cache.size}\`\n` +
        `│ㅤ │ㅤㅤ └ Total: \`${client.guilds.cache.reduce(
          (sum, g) => sum + g.memberCount,
          0,
        )}\` users\n` +
        `│ㅤ └ Total: \n` +
        `│ㅤ  ㅤ ├ \`${total[0]}\` cached\n` +
        `│ㅤ  ㅤ ├ \`${total[1]}\` users\n` +
        `│ㅤ  ㅤ └ \`${total[2]}\` guilds\n` +
        `│\n` +
        `│ **Client Intents:**\n` +
        `│ㅤ ├ Guild Presences intent is : \`${
          client.options.intents.has(intents[`GuildPresences`])
            ? "enabled"
            : "disabled"
        }\`\n` +
        `│ㅤ ├ Guild Members intent is : \`${
          client.options.intents.has(intents[`GuildMembers`])
            ? "enabled"
            : "disabled"
        }\`\n` +
        `│ㅤ └ Message Content intent is : \`${
          client.options.intents.has(intents[`MessageContent`])
            ? "enabled"
            : "disabled"
        }\`\n` +
        `│\n` +
        `└ **Latency Information:**\n` +
        `ㅤ  └ Shard ${message.guild.shardId}\n` +
        `ㅤ   ㅤ ├ WS latency \`${client.ws.ping}ms\`\n` +
        `ㅤ   ㅤ └ Message latency \`${m.createdAt - message.createdAt}ms\``,
    );
  },
};
