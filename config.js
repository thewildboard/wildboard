module.exports = {
  default: {
    manifests: ["https://localhost:8080/manifest.json"],

    serveme: {
      debug: true,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  },

  development: {
  },

  test: {
    serveme: {
      log: false
    }
  },

  production: {
    serveme: {
      log: false,
      debug: false
    }
  }

};