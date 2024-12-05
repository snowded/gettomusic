/* made by snow.ded - getto */

const JOSH = require("@joshdb/core");
const JSON = require("@joshdb/json");

module.exports = new JOSH({
  name: "blacklist",
  provider: JSON,
  providerOptions: {
    cleanupEmpty: true,
    dataDir: "./josh-data/blacklist",
  },
});
