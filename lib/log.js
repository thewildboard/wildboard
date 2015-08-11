module.exports = Log = {
  log: function(message, second) {
    this.console((second ? message : "") + 'Dashboard: ' + (second ? second : message));
  },
  
  console: console.log
}