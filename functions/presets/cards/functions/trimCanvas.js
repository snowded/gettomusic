/* made by snow.ded - getto */

module.exports = (x, y, rad, canvas, ctx) => {
  let width = canvas.width - 2 * x;
  let height = canvas.height - 2 * y;
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x, y, x, y + height, rad);
  ctx.arcTo(x, y + height, x + width, y + height, rad);
  ctx.arcTo(x + width, y + height, x + width, y, rad);
  ctx.arcTo(x + width, y, x, y, rad);
  ctx.clip();
};
