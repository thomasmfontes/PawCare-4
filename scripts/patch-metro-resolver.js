const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '..', 'node_modules', '@expo', 'metro', 'node_modules', 'metro', 'src', 'node-haste', 'DependencyGraph.js'),
  path.join(__dirname, '..', 'node_modules', 'metro', 'src', 'node-haste', 'DependencyGraph.js'),
];

targets.forEach((target) => {
  if (!fs.existsSync(target)) return;

  let code = fs.readFileSync(target, 'utf8');

  // Patch 1: fileSystemLookup fallback to fs.existsSync
  const originalLookup = `    const fileSystemLookup = (path) => {
      const result = this._fileSystem.lookup(path);
      if (result.exists) {
        return {
          exists: true,
          realPath: result.realPath,
          type: result.type,
        };
      }
      return {
        exists: false,
      };
    };`;

  const patchedLookup = `    const fileSystemLookup = (path) => {
      const result = this._fileSystem.lookup(path);
      if (result.exists) {
        return {
          exists: true,
          realPath: result.realPath,
          type: result.type,
        };
      }
      if (_fs.default.existsSync(path)) {
        try {
          const stat = _fs.default.statSync(path);
          return {
            exists: true,
            realPath: path,
            type: stat.isDirectory() ? "d" : "f",
          };
        } catch (e) {}
      }
      return {
        exists: false,
      };
    };`;

  if (code.includes(originalLookup)) {
    code = code.replace(originalLookup, patchedLookup);
  }

  // Patch 2: getOrComputeSha1 fallback
  const originalSha1 = `  async getOrComputeSha1(mixedPath) {
    const result = await this._fileSystem.getOrComputeSha1(mixedPath);
    if (!result || !result.sha1) {
      throw new Error(\`Failed to get the SHA-1 for: \${mixedPath}.`;

  const patchedSha1 = `  async getOrComputeSha1(mixedPath) {
    let result = null;
    try {
      result = await this._fileSystem.getOrComputeSha1(mixedPath);
    } catch (e) {}
    if (result && result.sha1) {
      return result;
    }
    if (_fs.default.existsSync(mixedPath)) {
      const crypto = require("crypto");
      const content = _fs.default.readFileSync(mixedPath);
      const sha1 = crypto.createHash("sha1").update(content).digest("hex");
      return { sha1, content };
    }
    if (!result || !result.sha1) {
      throw new Error(\`Failed to get the SHA-1 for: \${mixedPath}.`;

  if (code.includes(originalSha1)) {
    code = code.replace(originalSha1, patchedSha1);
  }

  fs.writeFileSync(target, code, 'utf8');
  console.log(`[PawCare] Patch aplicado com sucesso no Metro DependencyGraph: ${target}`);
});
