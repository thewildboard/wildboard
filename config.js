module.exports = {
  default: {
    manifests: ["https://dokify.net/wb/manifest.json"],

    port: 3000,

    express: {
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem"
    },

    server: {
      index: "app/views/index.html"
    }
  },

  development: {
  },

  test: {
  },

  production: {
    port: 80,
  }

};