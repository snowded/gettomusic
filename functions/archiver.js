/* made by snow.ded - getto */

"use strict";

const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

const excludes = [
  ".git",
  ".pm2",
  "logs",
  ".config",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
  "node_modules",
  ".npm",
  ".yarn-integrity",
  ".cache",
  ".vscode",
  "yarn.lock",
  ".yarn",
  "package-lock.json",
  "npm-shrinkwrap.json",
];

const directoryPath = "./";
const includeBaseDirectory = false;
const ignorableExtensions = [".zip", ".jar"];

async function createZip(zipPath) {
  const excludesNormalized = excludes.map((element) => path.normalize(element));
  const ignorableExtensionsSet = new Set(
    ignorableExtensions.map((ext) => ext.toLowerCase()),
  );
  const resolvedDirectoryPath = path.resolve(directoryPath);
  const resolvedZipPath = path.resolve(zipPath);
  const baseDirectory = path.basename(resolvedDirectoryPath);

  function shouldExcludeFile(filePath) {
    const relativePath = path.relative(resolvedDirectoryPath, filePath);
    const fileExtension = path.extname(filePath).toLowerCase();

    return (
      excludesNormalized.includes(relativePath) ||
      ignorableExtensionsSet.has(fileExtension)
    );
  }

  function traverseDirectoryTree(currentPath, archive) {
    const files = fs.readdirSync(currentPath);
    for (const i in files) {
      const filePath = path.join(path.resolve(currentPath), files[i]);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && !shouldExcludeFile(filePath)) {
        const relativePath = path.relative(resolvedDirectoryPath, filePath);
        archive.file(filePath, {
          name: includeBaseDirectory
            ? path.join(baseDirectory, relativePath)
            : relativePath,
        });
      } else if (stats.isDirectory() && !shouldExcludeFile(filePath)) {
        traverseDirectoryTree(filePath, archive);
      }
    }
  }

  if (fs.existsSync(resolvedZipPath)) {
    fs.unlinkSync(resolvedZipPath);
  }

  const output = fs.createWriteStream(resolvedZipPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.log(err);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  traverseDirectoryTree(resolvedDirectoryPath, archive);

  archive.finalize();

  return await new Promise((res, rej) => {
    output.on("close", () => {
      res(`Created ${resolvedZipPath}`);
    });
  });
}

module.exports = createZip;
