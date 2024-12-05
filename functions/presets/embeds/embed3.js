/* made by snow.ded - getto */

const genButtons = require("@gen/playerButtons.js");
const { AttachmentBuilder } = require("discord.js");

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

  const embed = new client.embed()
  .setAuthor({
    name: `Now Playing — ${title.substring(0, 20)}...`,
    iconURL: "https://cdn.discordapp.com/emojis/1308325367165227058.webp?size=96&animated=true",
  })
  .setDescription(
    `
    <:reoncontbranch:1308034060249071728> **${author}.**
    <:reoncontbranch:1308034060249071728> **${player.queue.current.requester}.**
    <:reonendbranch:1308028142648299530> **${duration}.**
    `
  )
    
    .thumb(thumbnail);

  return [[embed], [], [genButtons(client, player, 5)[0]]];
};
