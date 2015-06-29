var request = require('request'),
  expect = require('expect.js'),
  urlParser = require('url');

describe('Dashboard', function() {
  var App;

  before(function(done) {
    App = require("..");
    done();
  });

  it('can be required', function(done) {
    expect(App).not.to.be(undefined);
    done();
  });

  it('can be started', function(done) {
    expect(App()).not.to.be(null);
    done();
  });

  after(function() {});
});

