/* made by snow.ded - getto */

const { Collection } = require("discord.js");

module.exports = async (
  message,
  command,
  spamRateLimitManager,
  cooldownRateLimitManager,
  owner,
  admin,
  client = message.client,
) => {
  const commandRlBucket = spamRateLimitManager.acquire(`${message.author.id}`);

  if (commandRlBucket.limited && !owner && !admin) {
    await client.db.blacklist.set(
      `${client.user.id}_${message.author.id}`,
      true,
    );
    return false;
  }

  try {
    commandRlBucket.consume();
  } catch (e) {}

  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = parseInt(command.cooldown) * 1000 || 5 * 1000;

  if (timestamps.has(message.author.id) && !owner && !admin) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const cooldownRlBucket = cooldownRateLimitManager.acquire(
        `${message.author.id}_${command.name}`,
      );
      if (cooldownRlBucket.limited) return;
      try {
        cooldownRlBucket.consume();
      } catch (e) {}

      const expiredTimestamp = Math.round(expirationTime - now);
      description = ` Please wait ${require("ms")(
        expiredTimestamp,
      )} before reusing the command **\`${command.name}\``;
      await message
        .reply({
          embeds: [
            new client.embed().desc(`${client.emoji.cool} **${description}`),
          ],
        })
        .then(async (m) =>
          setTimeout(async () => {
            await m.delete().catch(() => {});
          }, 5000),
        )
        .catch(() => {});

      return false;
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  return true;
};
