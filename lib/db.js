module.exports = DB;

function DB(core){
  this.core = core;
}

DB.prototype = {
  core: null,
};