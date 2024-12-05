/* made by snow.ded - getto */

module.exports = async (client, category) => {
  let commands = await client.commands
    .filter((x) => x.category && x.category === category)
    .map(
      (x) =>
        `**[\`${x.name}\`](${client.support})**`,
    )
    .join(", ")
  return commands || "**No commands to display**";
};
