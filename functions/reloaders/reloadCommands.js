/* made by snow.ded - getto */

module.exports = async (client) => {
  let commandFiles = Object.keys(require.cache).filter(
    (f) =>
      f.includes("commands") &&
      !f.includes("slash") &&
      !f.includes("loaders") &&
      !f.includes("node_modules"),
  );

  for (key of commandFiles) {
    try {
      delete require.cache[require.resolve(key)];
    } catch (e) {}
  }

  try {
    commandSize = await require("@loaders/commands.js")(client);
    return `Re-Loaded Commands: ${commandSize}`;
  } catch (error) {
    return `${error.stack}`;
  }
};
