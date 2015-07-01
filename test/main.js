var request = require('request'),
  expect = require('expect.js'),
  urlParser = require('url');

var Core = require('../lib/core.js');

describe('Dashboard', function() {
  before(function(done) {
    done();
    var fakeCore = {
      log: function(msg){},
    }
  });

  it('can be required', function(done) {
    expect(Core).not.to.be(undefined);
    done();
  });

  it('can be started', function(done) {
    expect(Core("test")).not.to.be(null);
    done();
  });

  it('can be closed', function(done) {
    var core = Core("test");
    expect(function() {
      core.close();
    }).not.to.throwException();
    done();
  });
  it("can connect to db", function(done){
    expect(function() {
      var db = require("../lib/db.js")(fakeCore, 5432);
    }).not.to.throwException();
    done();
  });

  after(function() {});
});
