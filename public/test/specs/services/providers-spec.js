'use strict';

describe('Service: providers', function () {

  // load the service's module
  beforeEach(module('widgetsApp', function(){
  }));

  // instantiate service
  var Providers;
  var $httpBackend;
  var MY_CONFIG;

  beforeEach(inject(function (_Providers_, _$httpBackend_, _MY_CONFIG_) {
    Providers = _Providers_;
    $httpBackend = _$httpBackend_;
    MY_CONFIG = _MY_CONFIG_
  }));



  it('should GET the providers from the server', function () {
      $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers')
        .respond(200, [{
        "added": "2015-03-20T13:08:55Z",
        "averageRating": null,
        "canArchive": null,
        "canDelete": null,
        "canDiscuss": true,
        "canEdit": false,
        "canLike": true,
        "canPublish": false,
        "canRemove": null,
        "canRequest": false
        }]);

        var _Providers = Providers.get();
        $httpBackend.flush();
        expect(_Providers).not.toBe(null);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
