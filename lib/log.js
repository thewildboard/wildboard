module.exports = Log = {
  log: function(message, second) {
    this.console((second ? message : "") + 'Wb: ' + (second ? second : message));
  },
  
  console: console.log
}