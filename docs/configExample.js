module.exports = {
  default: {
    manifests: ["https://localhost:3000/manifest.json"],

    port: 3000,

    secure: true,
    
    // Https
    express: {
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem"
    },
    
    server: {
      index: "app/views/index.html"
    },
    
    sessions: {
      // cookie name dictates the key name added to the request object
      cookieName: 'cookie_name',
      // should be a large unguessable string
      secret: 'secret_name',
      // how long the session will stay valid in ms
      duration: 259200 * 1000
    }
  },

  development: {},

  test: {
    secure: false
  },

  production: {
    port: 80,
  }
};