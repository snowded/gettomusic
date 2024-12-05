/* made by snow.ded - getto */

module.exports = (duration) => {
  var moment = require("moment");
  require("moment-duration-format");
  return moment
    .duration(duration, "milliseconds")
    .format("d[d] h[h] m[m] s[s]", {
      trim: true,
    });
};
