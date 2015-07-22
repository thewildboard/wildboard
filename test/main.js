var request = require('request'),
  expect = require('expect.js'),
  urlParser = require('url');

var Core = require('../lib/core.js');

request = request.defaults({
  strictSSL: false  // Accept self signed certificates
});

var core;

beforeEach(function (done) {
  core = Core('test', undefined, done);
});

afterEach(function() {
  core.close();
});

describe('Core', function() {
  it('can be started', function(done) {
    expect(core.server).not.to.be(null);
    done();
  })

  it('can connect to database', function(done) {
    expect(core.db).not.to.be(null);
    done();
  });

  it('can serve a page', function(done) {
    request({
      url: 'http://localhost:3000/chicken'
    }, function(err, res, body){
      expect(!err && res.statusCode === 200).to.be(true);
      done();
    });
  });
});

describe('User', function() {
  it('can be created', function(done) {
    request.post({
      url: 'http://localhost:3000/api/signup',
      form: {
        username: 'johndoe',
        email: 'johndoe@whatever.com',
        password: '123'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(201);
      done();
    });
  });

  it('can\'t be created if it already exists', function(done) {
    request.post({
      url: 'http://localhost:3000/api/signup',
      form: {
        username: 'johndoe',
        email: 'johndoe@whatever.com',
        password: '123'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(400);
      done();
    });
  });

  it('can\'t be created without username', function(done) {
    request.post({
      url: 'http://localhost:3000/api/signup',
      form: {
        email: 'johndoe2@whatever.com',
        password: '123'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(400);
      done();
    });
  });

  it('can\'t be created without email', function(done) {
    request.post({
      url: 'http://localhost:3000/api/signup',
      form: {
        username: 'johndoe2',
        password: '123'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(400);
      done();
    });
  });

  it('can\'t be created without password', function(done) {
    request.post({
      url: 'http://localhost:3000/api/signup',
      form: {
        email: 'johndoe2@whatever.com',
        username: 'johndoe2'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(400);
      done();
    });
  });

  it('can log in', function(done) {
    request.post({
      url: 'http://localhost:3000/api/login',
      form: {
        username: 'johndoe',
        password: '123'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(200);
      done();
    });
  });

  it('can\'t log in if it doesn\'t exist', function(done) {
    request.post({
      url: 'http://localhost:3000/api/login',
      form: {
        username: 'notjohndoe',
        password: '123'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(401);
      done();
    });
  });

  it('can\'t log in with a wrong password', function(done) {
    request.post({
      url: 'http://localhost:3000/api/login',
      form: {
        username: 'johndoe',
        password: '456'
      }
    }, function(err, res, body) {
      expect(res.statusCode).to.be(401);
      done();
    });
  });

  after(function() {
    require('../lib/models/user').remove({}, function() {});
  });
});

describe('Board', function() {
  it('can be created');
  it('can\'t be created without logging in first');
  it('can\'t be created without a name');

  after(function() {
    require('../lib/models/board').remove({}, function() {});
  });
});

describe('Widget', function() {
  it('can be created');
  it('can\'t be created without logging in first');
  it('can\'t be created without a name');
  it('can\'t be created without an associated board');

  after(function() {
    require('../lib/models/widget').remove({}, function() {});
  });
});