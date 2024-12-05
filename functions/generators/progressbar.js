/* made by snow.ded - getto */

module.exports = progressBar = (player, size = 15) => {
  const redLine = "<:light_divider:1266548300170006589>";
  const whiteLine = "<:Dash5:1277581529106612309>";
  const slider = "<a:playing:1277581642432643134>";

  if (!player.queue.current) {
    return `${slider}${whiteLine.repeat(size - 1)}`;
  }

  const current = player.shoukaku.position || 0;
  const total = player.queue.current.length;

  if (current > total) {
    return `${redLine.repeat(size - 1)}${slider}`;
  }

  const progress = Math.round((size - 1) * (current / total));
  const remaining = size - 1 - progress;
  const bar = `${redLine.repeat(progress)}${slider}${whiteLine.repeat(
    remaining,
  )}`;

  return bar;
};
