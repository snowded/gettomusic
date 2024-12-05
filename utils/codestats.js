/* made by snow.ded - getto */

const fs = require("fs");
const path = require("path");

function countLines(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  return lines.length;
}

function countCharacters(filePath, includeWhitespace = true) {
  const content = fs.readFileSync(filePath, "utf8");
  if (includeWhitespace) {
    return content.length;
  } else {
    return content.replace(/\s/g, "").length;
  }
}

function countWhitespaces(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const whitespaceMatches = content.match(/\s/g);
  return whitespaceMatches ? whitespaceMatches.length : 0;
}

function countLinesAndCharactersInDirectory(directoryPath, options) {
  let totalLines = 0;
  let fileCount = 0;
  let directoryCount = 0;
  let totalCharacters = 0;
  let totalCharactersExcludingWhitespace = 0;
  let totalWhitespaces = 0;

  function traverseDirectory(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);

      if (options.excludedDirectories.includes(file)) {
        return;
      }

      if (fs.statSync(filePath).isDirectory()) {
        directoryCount++;
        traverseDirectory(filePath);
      } else {
        const fileExtension = path.extname(filePath).toLowerCase();

        if (
          !options.excludedFiles.includes(file) &&
          !options.excludedExtensions.includes(fileExtension)
        ) {
          fileCount++;
          totalLines += countLines(filePath);
          totalCharacters += countCharacters(filePath);
          totalCharactersExcludingWhitespace += countCharacters(
            filePath,
            false,
          );
          totalWhitespaces += countWhitespaces(filePath);
        }
      }
    });
  }

  traverseDirectory(directoryPath);
  return {
    totalLines,
    fileCount,
    directoryCount,
    totalCharacters,
    totalCharactersExcludingWhitespace,
    totalWhitespaces,
  };
}

const directoryPath = ".";
const options = {
  excludedFiles: [],
  excludedExtensions: [".png", ".ttf", ".json"],
  excludedDirectories: [
    "node_modules",
    ".cache",
    ".config",
    ".npm",
    ".git",
    ".pm2",
  ],
};

const counts = countLinesAndCharactersInDirectory(directoryPath, options);

module.exports = {
  fileCount: counts.fileCount,
  directoryCount: counts.directoryCount,
  totalLines: counts.totalLines,
  totalWhitespaces: counts.totalWhitespaces,
  totalCharacters: counts.totalCharacters,
  totalCharactersExcludingWhitespace: counts.totalCharactersExcludingWhitespace,
};
