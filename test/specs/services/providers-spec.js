(function(){
  'use strict';

  describe('Service: providers', function () {

    // load the service's module
    beforeEach(module('dashboardApp'));

    // instantiate service
    var Providers;
    var $httpBackend;
    var MY_CONFIG;
    
    var data = [
      {
        "name": "Wildboard Repository",
        "url": "https://github.com/thewildboard/wildboard",
        "sources": {
          "coverage": {
            "id": "coverage",
            "description": "Coverage of Wildboard",
            "url": "http://localhost:7654/thewildboard/wildboard/coverage",
            "type": "number",
            "unit": "%",
            "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
          },
          "open-issues": {
            "id": "open-issues",
            "description": "Open Issues",
            "url": "http://localhost:7654/thewildboard/wildboard/open-issues",
            "type": "number",
            "unit": "open issues",
            "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
          }
        }
      }
    ];

    var processing_data = [
      {
        "name": "Wildboard Repository",
        "sources" : [{
          "id": "coverage",
          "description": "Coverage of Wildboard",
          "url": "http://localhost:7654/thewildboard/wildboard/coverage",
          "type": "number",
          "unit": "%",
          "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
        },{
          "id": "open-issues",
          "description": "Open Issues",
          "url": "http://localhost:7654/thewildboard/wildboard/open-issues",
          "type": "number",
          "unit": "open issues",
          "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
        }
      ]
    }
  ];

  beforeEach(inject(function (_Providers_, _$httpBackend_, _MY_CONFIG_) {
    Providers = _Providers_;
    $httpBackend = _$httpBackend_;
    MY_CONFIG = _MY_CONFIG_;
  }));

  it('when I call _generate_providerList I should return the data with the sources like an array instead objects', function(){
    Providers._generate_providerList(data);
    expect(Providers.getProviderList()).toEqual(processing_data);
  });

  it('When I call the "all" action I shoul get the data', function () {
    $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers')
    .respond(200, data);
    var _Providers = Providers.all();
    $httpBackend.flush();
    expect(_Providers).not.toBe(null);
  });

  it('When I use the "get" funtion I should get the providers data proceesing', function(){
    $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers')
    .respond(200, data);

    Providers.get();
    $httpBackend.flush();
    expect(Providers.getProviderList()).toEqual(processing_data);

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
}());
