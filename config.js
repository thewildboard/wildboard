module.exports = {
  development: {
    manifests: ["localhost:3000/manifest.json"]
  },

  test: {
    manifests: ["localhost:3000/manifest.json"]
  },

  production: {
    manifests: []
  }
};