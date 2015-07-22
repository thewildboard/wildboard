module.exports = {
  default: {
    manifests: [{
      url: "https://dokify.net/wb/manifest.json",
      auth: {
        type: "oauth2",
        oauth2: {
          //id: "",
          //secret: "",
          secret: "", //ignorefile
          authorization_url: "https://dokify.net/oauth",
          token_url: "https://dokify.net/oauth/access_token"
        }
      }
    }],

    port: 3000,

    secure: true,
    
    express: {
      key: "./ssl/server-key.pem",
      cert: "./ssl/server-cert.pem"
    },
    

    server: {
      index: "app/views/index.html"
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