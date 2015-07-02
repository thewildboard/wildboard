var request = require('request'),
  expect = require('expect.js'),
  urlParser = require('url');

var Core = require('../lib/core.js');

describe('Dashboard', function() {
  before(function(done) {
    core = Core("test");
    done();
  });

  it('can be required', function(done) {
    expect(Core).not.to.be(undefined);
    done();
  });

  it('can be started', function(done) {
    expect(core).not.to.be(null);
    done();
  });

  it('can be closed', function(done) {
    expect(function() {
      core.close();
    }).not.to.throwException();
    done();
  });

  it("can connect to db", function(done){
    expect(function() {
      require("../lib/db.js")(core);
    }).not.to.throwException();
    done();
  });

  after(function() {});
});
