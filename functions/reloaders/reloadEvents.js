/* made by snow.ded - getto */

module.exports = async (client) => {
  let eventsSize = {};
  await client.removeAllListeners();
  await client.manager.removeAllListeners();
  await client.manager.shoukaku.removeAllListeners();
  let eventFiles = Object.keys(require.cache).filter(
    (f) => f.includes("events") && !f.includes("node_modules"),
  );
  for (key of eventFiles) {
    try {
      delete require.cache[require.resolve(key)];
    } catch (e) {}
  }

  try {
    eventsSize.client = await require("@loaders/clientEvents.js")(client);
    eventsSize.node = await require("@loaders/nodeEvents")(client);
    eventsSize.player = await require("@loaders/playerEvents")(client);
    eventsSize.custom = await require("@loaders/customEvents.js")(client);
    return (
      `Re-Loaded Events [` +
      ` Client: ${eventsSize.client} ` +
      ` Node: ${eventsSize.node} ` +
      ` Player: ${eventsSize.player} ` +
      ` Custom: ${eventsSize.custom} ]`
    );
  } catch (error) {
    return `${error.stack}`;
  }
  return res;
};
