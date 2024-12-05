/* made by snow.ded - getto */

const total = 25;
const dots = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const sleep = async (t) => await new Promise((r) => setTimeout(r, t));
const wrapper = {
  update: (...args) =>
    import("log-update").then(({ default: logUpdate }) => logUpdate(...args)),
  done: () =>
    import("log-update").then(({ default: logUpdate }) => logUpdate.done()),
};

async function animateConsole(text) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let animatedText = "";
    for (let j = 0; j < lines[i].length; j++) {
      animatedText = lines[i].substring(0, j + 1);
      wrapper.update(animatedText);
      await sleep(10);
    }
    await sleep(10);
    wrapper.done();
  }
  wrapper.done();
}

const animate = async (index, progress, type) => {
  const dot = dots[index % dots.length];
  const progressBar = `[0%] [${"#".repeat(progress)}${".".repeat(
    total - progress,
  )}] [100%]`;
  await wrapper.update(`${dot} ${type} ${progressBar}`);
};

module.exports = async (text) => {
  let counts = require("@utils/codestats.js");

  let res = [
    `Found a total of ${counts.fileCount} Files ` +
      `| ${counts.directoryCount} Directories ` +
      `| ${counts.totalLines} Lines of code`,

    `Found a total of ${counts.totalWhitespaces} whitespaces ` +
      `| ${counts.totalCharacters} characters (including whitespace) ` +
      `| ${counts.totalCharactersExcludingWhitespace} characters (excluding whitespace)`,
  ];

  for (let i = 0; i < total + 1; i++) {
    await sleep(30);
    await animate(i, i, `Compiling`);
  }
  await sleep(100);
  await wrapper.update("Compilation Successful");
  wrapper.done();
  await sleep(100);
  await wrapper.update(`${res[0]}\n${res[1]}`);
  wrapper.done();

  for (let i = 0; i < total + 1; i++) {
    await sleep(30);
    await animate(i, i, `Booting`);
  }
  await sleep(100);
  await wrapper.update("Boot Successful");
  await sleep(100);
  await wrapper.update("Booting . . .");
  await wrapper.done();
  await sleep(100);
  for (i = 0; i < 10; i++) {
    await wrapper.update("Starting Launcher [ / / / ]");
    await sleep(30);
    await wrapper.update("Starting Launcher [ | | | ]");
    await sleep(30);
    await wrapper.update("Starting Launcher [ \\ \\ \\ ]");
    await sleep(30);
    await wrapper.update("Starting Launcher [ - - - ]");
    await sleep(30);
  }
  await wrapper.update("Launcher started");
  await sleep(100);
  await wrapper.update("Launcher started .");
  await sleep(100);
  await wrapper.update("Launcher started . .");
  await sleep(100);
  await wrapper.update("Launcher started . . .");
  await sleep(100);

  await wrapper.done();
  await animateConsole(text);
};
