/** @format
 *
 * Manager By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = (client) => {
  client.log = (message, type = "log") => {
    return client.logger.log(message, type, client.user?.username || "Manager");
  };

  client.sleep = (t) => {
    return new Promise((r) => setTimeout(r, t));
  };

  client.send = async (user, desc) => {
    try {
      await user.send({ embeds: [new client.embed().desc(desc)] });
      console.log(`Sent message to user ${user.username}[${user.id}]`);
    } catch (error) {
      console.error(
        `Failed to send message to user ${user.username}[${user.id}]: ${error.message}`,
      );
    }
  };
};
