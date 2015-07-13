module.exports = {
  development: {
    manifests: ["localhost:3000/manifest.json"],

    serveme: {
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  },

  test: {
    manifests: ["localhost:3000/manifest.json"],

    serveme: {
      log: false,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  },

  production: {
    manifests: ["localhost:3000/manifest.json"],

    serveme: {
      log: false,
      cache: true,
      secure: true,
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem",
      home: "app/views/index.html"
    }
  }

};