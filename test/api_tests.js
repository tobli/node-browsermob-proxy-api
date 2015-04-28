'use strict';

var nock = require('nock'),
    assert = require('assert'),
    MobProxy = require('../index');

function mockGet(path) {
  return nock('http://localhost:8080').get(path);
}

function mockPost(path, body) {
  return nock('http://localhost:8080').post(path, body);
}

function mockPut(path, body) {
  return nock('http://localhost:8080').put(path, body);
}

function mockDelete(path) {
  return nock('http://localhost:8080').delete(path);
}

var JSON_MIME = 'application/json';
var JAVASCRIPT_MIME = 'application/javascript';
var FORM_MIME = 'application/x-www-form-urlencoded';

var PORT = 42;

describe('api', function() {
  var api;

  beforeEach(function() {
    api = new MobProxy();
  });

  describe('#getProxyList', function() {
    it('should call server', function(done) {
      var mock = mockGet('/proxy').reply(200, 'ABC123');
      api.getProxyList(function(err, result) {
        if (err) { throw err; }
        assert('ABC123' === result);
        assert(mock.isDone());
        done();
      });
    });

    it('should return errors', function(done) {
      var mock = mockGet('/proxy').reply(500);
      api.getProxyList(function(err) {
        assert(err);
        assert(mock.isDone());
        done();
      });
    });
  });

  describe('#startPort', function() {
    it('should call server', function(done) {
      var mock = mockPost('/proxy', {'port': PORT})
          .matchHeader('Content-Type', FORM_MIME)
          .reply(200);
      api.startPort(PORT, function(err, result) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should return errors', function(done) {
      var mock = mockPost('/proxy', {'port': PORT}).reply(500);
      api.startPort(PORT, function(err) {
        assert(err);
        assert(mock.isDone());
        done();
      });
    });
  });

  describe('#stopPort', function() {
    it('should call server', function(done) {
      var mock = mockDelete('/proxy/' + PORT)
          .reply(200);
      api.stopPort(PORT, function(err, result) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should return errors', function(done) {
      var mock = mockDelete('/proxy/' + PORT)
          .reply(500);
      api.stopPort(PORT, function(err) {
        assert(err);
        assert(mock.isDone());
        done();
      });
    });
  });

  describe('#createHAR', function() {
    var params = {'initialPageTitle': 'start'};

    it('should call server', function(done) {
      var mock = mockPut('/proxy/' + PORT + '/har', params)
          .reply(200);
      api.createHAR(PORT, params, function(err) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should return errors', function(done) {
      var mock = mockPut('/proxy/' + PORT + '/har', params)
          .reply(500);
      api.createHAR(PORT, params, function(err) {
        assert(err);
        assert(mock.isDone());
        done();
      });
    });
  });

  describe('#startNewPage', function() {
    var params = {'pageRef': 'start'};

    it('should call server with params as object', function(done) {
      var mock = mockPut('/proxy/' + PORT + '/har/pageRef', params)
          .reply(200);
      api.startNewPage(PORT, params, function(err) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should call server with params as string', function(done) {
      var mock = mockPut('/proxy/' + PORT + '/har/pageRef', params)
          .reply(200);
      api.startNewPage(PORT, 'start', function(err) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should return errors', function(done) {
      var mock = mockPut('/proxy/' + PORT + '/har/pageRef', params)
          .reply(500);
      api.startNewPage(PORT, params, function(err) {
        assert(err);
        assert(mock.isDone());
        done();
      });
    });
  });

  describe('#setHeaders', function() {
    it('should call server with headers as JSON string', function(done) {
      var mock = mockPost('/proxy/' + PORT + '/headers', {'foo': 'bar'})
          .matchHeader('Content-Type', JSON_MIME)
          .reply(200);
      api.setHeaders(PORT, '{"foo":"bar"}', function(err) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should call server with headers as object ', function(done) {
      var mock = mockPost('/proxy/' + PORT + '/headers', {'foo': 'bar'})
          .matchHeader('Content-Type', JSON_MIME)
          .reply(200);
      api.setHeaders(PORT, {'foo': 'bar'}, function(err) {
        if (err) { throw err; }
        assert(mock.isDone());
        done();
      });
    });

    it('should return errors', function(done) {
      var mock = mockPost('/proxy/' + PORT + '/headers')
          .reply(500);
      api.setHeaders(PORT, {}, function(err) {
        assert(err);
        assert(mock.isDone());
        done();
      });
    });
  });
});
