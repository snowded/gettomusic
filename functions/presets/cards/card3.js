/* made by snow.ded - getto */

const { AttachmentBuilder } = require("discord.js");
const genButtons = require("@gen/playerButtons.js");
const drawText = require("./functions/drawText.js");
const { createCanvas, loadImage } = require("canvas");
const trimCanvas = require("./functions/trimCanvas.js");
const drawProgressBar = require("./functions/drawProgressBar.js");

module.exports = async (data, client, player) => {
  const title = data.title;
  const author = data.author;
  const duration = data.duration;
  const thumbnail = data.thumbnail;
  const progress = data.progress;

  const Jimp = require("jimp");
  const image = await Jimp.read(thumbnail);
  let thumbnailBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  const canvas = createCanvas(1475, 500);
  const ctx = canvas.getContext("2d");
  trimCanvas(10, 10, 30, canvas, ctx);
  const bgImage = await loadImage(`${process.cwd()}/assets/cards/cardBg4.png`);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  let gradient = ctx.createLinearGradient(800, 240, 1200, 250);
  gradient.addColorStop(0, "rgba(236, 170, 69, 1)");
  gradient.addColorStop(0.5, "rgba(242, 219, 133, 1)");
  gradient.addColorStop(1, "rgba(236, 170, 69, 1)");

  gradient = ctx.createLinearGradient(900, 180, 1200, 220);
  gradient.addColorStop(0, "rgba(236, 170, 69, 1)");
  gradient.addColorStop(0.5, "rgba(242, 219, 133, 1)");
  gradient.addColorStop(1.0, "rgba(236, 170, 69, 1)");

  drawProgressBar(ctx, {
    x: 800,
    y: 380,
    bg: "#dcdcdc",
    radius: 5,
    width: 600,
    height: 10,
    fg: gradient,
    progress: progress,
  });

  drawText(ctx, 1100, 200, 600, gradient, "alka", 60, "center", title);
  drawText(ctx, 1100, 300, 400, gradient, "alka", 40, "center", author);
  drawText(ctx, 820, 420, 100, gradient, "alka", 25, "center", "00:00");
  drawText(ctx, 1380, 420, 100, gradient, "alka", 25, "center", duration);

  gradient = ctx.createLinearGradient(0, 0, 800, 500);
  gradient.addColorStop(0.15, "rgba(236, 170, 69, 1)");
  gradient.addColorStop(0.2, "rgba(242, 219, 133, 1)");

  gradient.addColorStop(0.7, "rgba(242, 219, 133, 1)");
  gradient.addColorStop(0.8, "rgba(236, 170, 69, 1)");
  gradient.addColorStop(0.9, "rgba(242, 219, 133, 1)");
  gradient.addColorStop(1.0, "rgba(236, 170, 69, 1)");

  ctx.fillStyle = gradient;

  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(200, 0);
  ctx.lineTo(150, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(550, 500);
  ctx.lineTo(620, 500);
  ctx.lineTo(800, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(0, 300);
  ctx.lineTo(200, 0);
  ctx.lineTo(800, 0);
  ctx.lineTo(550, 500);
  ctx.closePath();
  ctx.clip();

  let thumb = await loadImage(thumbnailBuffer);
  ctx.drawImage(thumb, 0, -150, 800, 800);

  let buffer = canvas.toBuffer("image/png");

  const attachment = new AttachmentBuilder(buffer, {
    name: "card.png",
  });
  const embed = new client.embed()
    .setTitle(`${client.user.username} is currently playing :\n`)
    .img(`attachment://${attachment.name}`);

  return [[embed], [attachment], [genButtons(client, player)[0]]];
};
