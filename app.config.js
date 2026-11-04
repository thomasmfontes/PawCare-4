module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      commitHash: 'c39ae65',
    },
  };
};
