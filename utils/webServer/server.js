/* made by snow.ded - getto */

const app = require("express")();
const port = process.env.PORT || 443;
const logger = require("@plugins/logger");

app.use(require("express").json());

app.use(require("express-status-monitor")());

app.use(require("express").static(require("path").join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(require("path").join(__dirname, "index.html"));
});

app.get("/add", (req, res) => {
  res.send(
    '<meta http-equiv="refresh" content="0; URL=https://discord.com/api/oauth2/authorize?client_id=1050423676689985606&permissions=8&scope=bot"/>',
  );
});

app.get("/support", (req, res) => {
  res.send(
    '<meta http-equiv="refresh" content="0; URL=https://discord.gg/snoww"/>',
  );
});

app.listen(port, () => {
  logger.log(`Loaded Web server | Port : (${port})`, `ready`);
});
