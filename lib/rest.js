module.exports = REST;

function REST(core, expressApp) {
  this.core = core;

  expressApp.get('/api/dashboard/', function (req, res) {
    res.send('Hello World!');
  });

  this.log("Loaded API");
}

REST.prototype = {
  core: null,

  log: function(message) {
    this.core.log("(Rest) " + message)
  }
};