/* made by snow.ded - getto */

const { AttachmentBuilder } = require("discord.js");
const genButtons = require("@gen/playerButtons.js");
const drawText = require("./functions/drawText.js");
const { createCanvas, loadImage } = require("canvas");
const trimCanvas = require("./functions/trimCanvas.js");
const drawProgressBar = require("./functions/drawProgressBar.js");

const thumbs = {
  youtube:
    "https://media.discordapp.net/attachments/1188399617121984542/1192720573231538216/yt1.png",
  soundcloud:
    "https://media.discordapp.net/attachments/1188399617121984542/1192720572329762937/soundcloud.png",
  spotify:
    "https://media.discordapp.net/attachments/1188399617121984542/1192720573231538216/yt1.png",
  deezer:
    "https://media.discordapp.net/attachments/1188399617121984542/1192720855847940106/image.png",
  nicovideo:
    "https://media.discordapp.net/attachments/1188399617121984542/1192720572052947084/nicovideo.png",
};

const canvas = createCanvas(2000, 585);

module.exports = async (data, client, player) => {
  const title = data.title;
  const author = data.author;
  const duration = data.duration;
  const thumbnail = data.thumbnail;
  const color = data.color;
  const progress = data.progress;
  const source = data.source;

  const Jimp = require("jimp");
  const image = await Jimp.read(thumbnail);
  let thumbnailBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  const ctx = canvas.getContext("2d");

  const backgroundImage = await loadImage(thumbnailBuffer);
  // const logoImage = await loadImage(thumbs[`${source}`]);

  const blur = 10;
  const overlay_opacity = 0.75;
  const album = "snoww";
  trimCanvas(15, 15, 30, canvas, ctx);

  ctx.filter = `blur(${blur}px)`;
  ctx.drawImage(backgroundImage, 0, -500, canvas.width, 2000);
  ctx.filter = "none";

  ctx.beginPath();
  ctx.globalAlpha = overlay_opacity;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.globalAlpha = 1;

  drawProgressBar(ctx, {
    x: 300,
    y: 400,
    bg: "#dcdcdc",
    radius: 5,
    width: 1400,
    height: 10,
    fg: color,
    progress: progress,
  });

  //ctx.drawImage(logoImage, 950, 50, 100, 100);

  drawText(ctx, 1000, 200, 800, "#ffffff", "alka", 30, "center", author);
  drawText(ctx, 1000, 280, 600, "#ffffff", "alka", 60, "center", title);
  drawText(ctx, 200, 410, 100, "#ffffff", "alka", 40, "center", "00:00");
  drawText(ctx, 1800, 410, 100, "#ffffff", "alka", 40, "center", duration);

  let gradient = ctx.createLinearGradient(1800, 350, 1980, 350);
  gradient.addColorStop(0, "#faf600");
  gradient.addColorStop(1, "#fa1982");
  ctx.fillStyle = gradient;
  ctx.textAlign = "right";
  ctx.font = `50px Sans`;
  ctx.fillText(
    `${album.length >= 40 ? album.slice(0, 40) + "..." : album}`,
    1900,
    500,
  );

  const buffer = canvas.toBuffer("image/png");

  const attachment = new AttachmentBuilder(buffer, {
    name: "card.png",
  });
  const embed = new client.embed()
    .setTitle(`${client.user.username} is currently playing :\n`)
    .img(`attachment://${attachment.name}`);

  return [[embed], [attachment], [genButtons(client, player)[0]]];
};
