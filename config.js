module.exports = {
  development: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      debug: true,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  },

  test: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      log: false,
      debug: true,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  },

  production: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      log: false,
      debug: false,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  }

};