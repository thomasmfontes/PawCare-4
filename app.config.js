const { execSync } = require('child_process');

module.exports = ({ config }) => {
  let commitHash = 'ac477ed';
  try {
    commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    // fallback
  }

  return {
    ...config,
    extra: {
      ...config.extra,
      commitHash,
    },
  };
};
