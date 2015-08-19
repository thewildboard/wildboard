module.exports = {
  default: {
    manifests: [{
      url: "https://localhost:3000/manifest.json",
      auth: {
        "type": "oauth2",
        "oauth2": {
            "authorization_url": "https://dokify.net/oauth",
            "token_url": "https://dokify.net/oauth/access_token"
        }
      }
    }],

    port: 3000,

    secure: true,

    // Https
    express: {
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem"
    },

    server: {
      index: "app/index.html"
    },

    sessions: {
      // cookie name dictates the key name added to the request object
      cookieName: 'session',
      // should be a large unguessable string
      secret: 'mynameisralphwiggum',
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
