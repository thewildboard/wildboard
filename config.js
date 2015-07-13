module.exports = {
  development: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
    }
  },

  test: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      log: false,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
    }
  },

  production: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      log: false,
      cache: true,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
    }
  }
};