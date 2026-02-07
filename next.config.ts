module.exports = {
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      // other paths
    }
  },
  output: 'export',
};