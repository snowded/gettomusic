/* made by snow.ded - getto */

module.exports = async (
  message,
  premiumUser,
  coinRateLimitManager,
  client = message.client,
) => {
  const coinBucket = coinRateLimitManager.acquire(`${message.author.id}`);
  if (!coinBucket.limited || premiumUser) {
    let coins = parseInt(
      (await client.db.coins.get(`${message.author.id}`)) || 0,
    );
    let total = coins + parseInt(Math.floor(Math.random() * (2 + 1)) + 1);
    await client.db.coins.set(`${message.author.id}`, total);
  }
  try {
    coinBucket.consume();
  } catch (e) {}

  await client.webhooks.command
    .send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [
        new client.embed().desc(
          `**User : **${message.author.tag}\n` +
            `**Channel : **${message.channel.name}\n` +
            `**Guild : **${message.guild.name.substring(0, 15)} [[${
              message.guild.id
            }](https://0.0)] \n\n` +
            `**Message Content : **\`\`\`\n${message.content}\`\`\``,
        ),
      ],
    })
    .catch(() => {});
};
