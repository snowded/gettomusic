/* made by snow.ded - getto */

const { RateLimitManager } = require("@sapphire/ratelimits");
const spamRateLimitManager = new RateLimitManager(10000, 7);
const cooldownRateLimitManager = new RateLimitManager(5000);
const ignoreWarnRateLimitManager = new RateLimitManager(10000);
const coinRateLimitManager = new RateLimitManager(3600000, 15);

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (
      message.author.bot ||
      !message ||
      !message.guild ||
      !message.channel ||
      !message.content
    )
      return;

    let [pfxu, pfxg, ignoredChnl, blacklistUser, owner, admin] =
      await Promise.all([
        await client.db.pfx.get(`${client.user.id}_${message.author.id}`),
        await client.db.pfx.get(`${client.user.id}_${message.guild.id}`),
        (await client.db.ignore.get(`${client.user.id}_${message.guild.id}`)) ||
          [],
        await client.db.blacklist.get(`${client.user.id}_${message.author.id}`),
        await client.owners.find((x) => x === message.author.id),
        await client.admins.find((x) => x === message.author.id),
      ]);

    if (owner || admin) blacklistUser = false;

    if (blacklistUser == "warned") return;

    let [premiumGuild, premiumUser] = await require(
      `@functions/msgCrt/checkPremium.js`,
    )(message);

    if (message.content.toLowerCase().includes(`jsk`)) {
      client.jsk.run(message);
    }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
      if (blacklistUser)
        return await client.emit("blUser", message, blacklistUser);
      const mentionRlBucket = spamRateLimitManager.acquire(
        `${message.author.id}`,
      );
      if (mentionRlBucket.limited && !owner && !admin)
        return client.db.blacklist.set(
          `${client.user.id}_${message.author.id}`,
          true,
        );
      try {
        mentionRlBucket.consume();
      } catch (e) {}
      return await client.emit("mention", message);
    }

    let prefix = client.prefix;

    if (premiumUser && !message.content.startsWith(client.prefix)) {
      prefix =
        (message.content.toLowerCase().startsWith(pfxu?.toLowerCase())
          ? pfxu
          : "") ||
        (message.content.toLowerCase().startsWith(pfxg?.toLowerCase())
          ? pfxg
          : "");
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixes = pfxu
      ? pfxg
        ? [prefix, pfxu, pfxg]
        : [prefix, pfxu]
      : pfxg
        ? [prefix, pfxg]
        : [prefix];
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${prefixes.map(escapeRegex).join("|")})\\s*`,
      "i",
    );
    if (!prefixRegex.test(message.content.toLowerCase())) return;
    const [matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );

    if (!command) return;

    if (blacklistUser) {
      return await client.emit("blUser", message, blacklistUser);
    }

    if (ignoredChnl.includes(message.channel.id) && !(admin || owner)) {
      await require(`@functions/msgCrt/ignored.js`)(
        message,
        command,
        ignoreWarnRateLimitManager,
      );
      return;
    }

    if (
      !(await require(`@functions/msgCrt/cooldown.js`)(
        message,
        command,
        spamRateLimitManager,
        cooldownRateLimitManager,
        owner,
        admin,
      ))
    )
      return;

    if (!(await require(`@functions/msgCrt/checkPerms.js`)(message, command)))
      return;

    //if (args[0]?.toLowerCase() == "-h")
     // return await client.emit("infoRequested", message, command);

    if (command.admin) {
      if (!owner && !admin)
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.admin} **Only Team Members can use this command**`,
            ),
          ],
        });
    }

    if (command.owner && !command.admin) {
      if (!owner)
        return await message.reply({
          embeds: [
            new client.embed().desc(
              `${client.emoji.king} **Only [snoww.](https://discord.com/users/1092374628556615690) can use this command**`,
            ),
          ],
        });
    }

    if (command.vote && !(owner || premiumUser || premiumGuild)) {
      if (!(await require(`@functions/msgCrt/checkVote.js`)(message, command)))
        return;
    }

    if (command.args && !args.length) {
      let reply = `${client.emoji.no} **Invalid/No args provided**`;
      if (command.usage)
        reply += `\n${client.emoji.bell} Usage: \`${matchedPrefix}${command.name} ${command.usage}\``;
      return await message.reply({
        embeds: [new client.embed().desc(reply)],
      });
    }

    if (!(await require(`@functions/msgCrt/checkVoice.js`)(message, command)))
      return;

    const emoji = client.emoji[command.name];
    await command.execute(client, message, args, emoji);

    await require(`@functions/msgCrt/executed.js`)(
      message,
      premiumUser,
      coinRateLimitManager,
    );
  },
};
