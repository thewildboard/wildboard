var request = require('request'),
  expect = require('expect.js'),
  urlParser = require('url');

var Core = require('../lib/core.js');

request = request.defaults({
  strictSSL: false  // Accept self signed certificates
});

describe('Dashboard', function() {
  before(function(done) {
    core = Core('test');
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

  it('can connect to db', function(done) {
    expect(function() {
      require('../lib/db.js')(core);
    }).not.to.throwException();
    done();
  });

  it('can get a page', function(done) {
    request({
      url: 'https://localhost:3000/chicken'
    }, function(err, res, body){
      expect(!err && res.statusCode === 200).to.be(true);
      done();
    });
  });

  it('can create a new user', function(done) {
    request.post({
      url: 'https://localhost:3000/signup',
      form: {
        username: 'johndoe',
        email: 'johndoe@whatever.com',
        password: '123'
      }
    }, function(err, res, body){
      expect(!err && res.statusCode === 201).to.be(true);
      done();
    });
  });

  after(function() {
    require('../lib/models/user').remove({}, function() {
      core.close();
    });
  });
});
