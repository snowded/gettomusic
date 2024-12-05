/* made by snow.ded - getto */

const JOSH = require("@joshdb/core");
const JSON = require("@joshdb/json");

module.exports = new JOSH({
  name: "premium",
  provider: JSON,
  providerOptions: {
    cleanupEmpty: true,
    dataDir: "./josh-data/premium",
  },
});
