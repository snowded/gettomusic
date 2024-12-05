/* made by snow.ded - getto */

const genButtons = require("@gen/playerButtons.js");
module.exports = async (data, client, player) => {
  /*
  const title = data.title;
  const author = data.author;
  const thumbnail = data.thumbnail;
  const duration = data.duration;
  const color = data.color;
  const progress = data.progress;
  const source = data.source;
  */

  const title = data.title;
  const author = data.author;
  const duration = data.duration;
  const thumbnail = data.thumbnail;
  const requester = data.requester;

  const embed = new client.embed()

    .desc(
      `**${
        title.charAt(0).toUpperCase() +
        title.substring(0, 25).slice(1).toLowerCase()
      }**\n\n` +
        `<:tutuTimer:1267940152966381689> **Duration:** ${duration}\n` +
        `<:Getto:1271055916032331848> **Author**: ${
          author.charAt(0).toUpperCase() +
          author.substring(0, 15).slice(1).toLowerCase()
        }\n` +
        `<:GettoUser:1271049508645507144> **Requester:** ${requester}\n`,
    )
    .thumb(thumbnail);

  return [[embed], [], [genButtons(client, player, 4)[0]]];
};
