/* made by snow.ded - getto */

module.exports = async (message, command, client = message.client) => {
  if (!client.vote || !client.topGgAuth) return false;
  let voted = false;
  await fetch(
    //`https://top.gg/api/bots/1050423676689985606/check?userId=${message.author.id}`,
    `https://top.gg/api/bots/${client.user.id}/check?userId=${message.author.id}`,
    {
      method: "GET",
      headers: {
        Authorization: client.topGgAuth,
      },
    },
  )
    .then(async (res) => {
      let json = await res.json();
      return (voted = json?.voted > 0 ? true : false);
    })
    .catch((err) => {
      client.log(`Commands cannot be vote locked !!! ${err}`);
      return (voted = true);
    });

  if (!voted) {
    await message.reply({
      embeds: [
        new client.embed().desc(
          `${client.emoji.diamond} **Only my Voter/s can use this command**\n` +
            `[Click to vote me](https://discord.gg/snoww)`,
        ),
      ],
    });
    return false;
  }

  return true;
};
