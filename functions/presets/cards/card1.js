/* made by snow.ded - getto */

const { AttachmentBuilder } = require("discord.js");
const genButtons = require("@gen/playerButtons.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont(`${process.cwd()}/assets/fonts/alka.ttf`, {
  family: "customFont",
});

module.exports = async (data, client, player) => {
  const color = "#aaaaaa";
  const title = data.title;
  const author = data.author;
  const duration = data.duration;
  const thumbnail = data.thumbnail;
  const progress = data.progress;

  const Jimp = require("jimp");
  const image = await Jimp.read(thumbnail);
  let thumbnailBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  const background = await loadImage(
    `${process.cwd()}/assets/cards/cardBg1.png`,
  );
  const thumbnailImage = await loadImage(thumbnailBuffer);

  const thumbnailCanvas = createCanvas(564, 564);
  const thumbnailCtx = thumbnailCanvas.getContext("2d");
  const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
  const cornerRadius2 = 45;

  thumbnailCtx.beginPath();
  thumbnailCtx.moveTo(0 + cornerRadius2, 0);
  thumbnailCtx.arcTo(
    thumbnailCanvas.width,
    0,
    thumbnailCanvas.width,
    thumbnailCanvas.height,
    cornerRadius2,
  );
  thumbnailCtx.arcTo(
    thumbnailCanvas.width,
    thumbnailCanvas.height,
    0,
    thumbnailCanvas.height,
    cornerRadius2,
  );
  thumbnailCtx.arcTo(0, thumbnailCanvas.height, 0, 0, cornerRadius2);
  thumbnailCtx.arcTo(0, 0, thumbnailCanvas.width, 0, cornerRadius2);
  thumbnailCtx.closePath();
  thumbnailCtx.clip();

  thumbnailCtx.drawImage(
    thumbnailImage,
    (thumbnailImage.width - thumbnailSize) / 2,
    (thumbnailImage.height - thumbnailSize) / 2,
    thumbnailSize,
    thumbnailSize,
    0,
    0,
    thumbnailCanvas.width,
    thumbnailCanvas.height,
  );

  const progressBarWidth = (parseFloat(progress) / 100) * 670;
  const progressBarCanvas = createCanvas(670, 25);
  const progressBarCtx = progressBarCanvas.getContext("2d");
  const cornerRadius = 10;

  progressBarCtx.beginPath();
  progressBarCtx.moveTo(cornerRadius, 0);
  progressBarCtx.lineTo(670 - cornerRadius, 0);
  progressBarCtx.arcTo(670, 0, 670, 25, cornerRadius);
  progressBarCtx.lineTo(670, 25 - cornerRadius);
  progressBarCtx.arcTo(670, 25, 670 - cornerRadius, 25, cornerRadius);
  progressBarCtx.lineTo(cornerRadius, 25);
  progressBarCtx.arcTo(0, 25, 0, cornerRadius, cornerRadius);
  progressBarCtx.lineTo(0, cornerRadius);
  progressBarCtx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
  progressBarCtx.closePath();
  progressBarCtx.fillStyle = "#ababab";
  progressBarCtx.fill();

  progressBarCtx.beginPath();
  progressBarCtx.moveTo(cornerRadius, 0);
  progressBarCtx.lineTo(progressBarWidth - cornerRadius, 0);
  progressBarCtx.arcTo(progressBarWidth, 0, progressBarWidth, 25, cornerRadius);
  progressBarCtx.lineTo(progressBarWidth, 25);
  progressBarCtx.lineTo(cornerRadius, 25);
  progressBarCtx.arcTo(0, 25, 0, cornerRadius, cornerRadius);
  progressBarCtx.lineTo(0, cornerRadius);
  progressBarCtx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
  progressBarCtx.closePath();
  progressBarCtx.fillStyle = color;
  progressBarCtx.fill();

  const circleCanvas = createCanvas(1000, 1000);
  const circleCtx = circleCanvas.getContext("2d");

  const circleRadius = 25;
  const circleY = 97;
  const circleX = progressBarWidth + 60;

  circleCtx.beginPath();
  circleCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  circleCtx.fillStyle = color;
  circleCtx.fill();

  const card = createCanvas(1280, 450);
  const ctx = card.getContext("2d");

  ctx.drawImage(background, 0, 0, 1280, 450);
  ctx.drawImage(thumbnailCanvas, 837, 8, 435, 435);
  ctx.drawImage(progressBarCanvas, 70, 340, 670, 25);
  ctx.drawImage(circleCanvas, 10, 255, 1000, 1000);

  ctx.textAlign = "left";
  ctx.fillStyle = color;
  ctx.font = "60px customFont";
  ctx.fillText(title, 40, 100, 747);

  ctx.font = "40px customFont";
  ctx.fillStyle = "white";
  ctx.fillText("Music by - " + author, 40, 170, 500);

  const gradient = ctx.createLinearGradient(500, 10, 800, 0);
  gradient.addColorStop(0, "#fa1982");
  gradient.addColorStop(1, "#faf600");
  ctx.fillStyle = gradient;
  ctx.textAlign = "right";
  ctx.font = "bold 35px customFont";
  ctx.fillText("- Immortality", 787, 240);

  ctx.fillStyle = "white";
  ctx.font = "bold 30px customFont";
  ctx.textAlign = "left";
  ctx.fillText("00.00", 70, 410);

  ctx.fillStyle = "white";
  ctx.font = "bold 30px customFont";
  ctx.textAlign = "right";
  ctx.fillText(duration, 740, 410);

  const buffer = card.toBuffer("image/png");

  const attachment = new AttachmentBuilder(buffer, {
    name: "card.png",
  });
  const embed = new client.embed()
    .setTitle(`${client.user.username} is currently playing :\n`)
    .img(`attachment://${attachment.name}`);

  return [[embed], [attachment], [genButtons(client, player)[0]]];
};
