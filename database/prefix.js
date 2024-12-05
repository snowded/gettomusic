/* made by snow.ded - getto */

const JOSH = require("@joshdb/core");
const JSON = require("@joshdb/json");

module.exports = new JOSH({
  name: "prefix",
  provider: JSON,
  providerOptions: {
    cleanupEmpty: true,
    dataDir: "./josh-data/prefix",
  },
});
