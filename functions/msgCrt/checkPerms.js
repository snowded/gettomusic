/* made by snow.ded - getto */

module.exports = async (message, command, client = message.client) => {
  if (
    !message.guild.members.me
      .permissionsIn(message.channel)
      .has(["ViewChannel", "ReadMessageHistory"])
  )
    return false;

  if (
    !message.guild.members.me.permissionsIn(message.channel).has("SendMessages")
  ) {
    await message.author
      .send({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **I need \`SEND_MESSAGES\` permission in ${message.channel} to execute the command \`${command.name}\`**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  if (
    !message.guild.members.me.permissionsIn(message.channel).has("EmbedLinks")
  ) {
    await message.author
      .send({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **I need \`EMBED_LINKS\` permission in ${message.channel} to execute the command \`${command.name}\`**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  if (command.userPerms && !message.member.permissions.has(command.userPerms)) {
    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **You need \`${command.userPerms.join(
              ", ",
            )}\` permission/s to use this command**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  if (
    (command.botPerms &&
      !message.guild.members.me.permissions.has(command.botPerms)) ||
    !message.guild.members.me
      .permissionsIn(message.channel)
      .has(command.botPerms)
  ) {
    await message
      .reply({
        embeds: [
          new client.embed().desc(
            `${client.emoji.warn} **I need \`${command.userPerms.join(
              ", ",
            )}\` in ${message.channel} permission/s to execute this command**`,
          ),
        ],
      })
      .catch(() => {});
    return false;
  }

  return true;
};
