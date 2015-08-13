(function(){
  'use strict';

  describe('Service: providers', function () {

    // load the service's module
    beforeEach(module('dashboardApp'));

    // instantiate service
    var Providers;
    var $httpBackend;
    var MY_CONFIG;
    var provider_list_result;
    var providers = [
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
          },
          "closed-issues": {
            "id": "closed-issues",
            "description": "Closed Issues",
            "url": "http://localhost:7654/thewildboard/wildboard/closed-issues",
            "type": "number",
            "unit": "closed issues",
            "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
          },
          "activity": {
            "id": "activity",
            "description": "Commits per Week",
            "url": "http://localhost:7654/thewildboard/wildboard/activity",
            "type": "number",
            "unit": "commits per week",
            "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
          }
        }
      }
    ];

    var providers_result = [
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
        },{

          "id": "closed-issues",
          "description": "Closed Issues",
          "url": "http://localhost:7654/thewildboard/wildboard/closed-issues",
          "type": "number",
          "unit": "closed issues",
          "refresh_rate": "0,5,10,15,20,25,30,35,40,45,50,55 * * * *"
        },
        {
          "id": "activity",
          "description": "Commits per Week",
          "url": "http://localhost:7654/thewildboard/wildboard/activity",
          "type": "number",
          "unit": "commits per week",
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

  it('should GET the providers from the server', function () {
    $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers')
    .respond(200, providers);

    var _Providers = Providers.all();
    $httpBackend.flush();
    expect(_Providers).not.toBe(null);
  });

  it('should get the providerList', function(){
    $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/providers')
    .respond(200, providers);

    //Provider get
    Providers.get();
    $httpBackend.flush();
    provider_list_result = Providers.getProviderList();
    expect(providers_result).toEqual(provider_list_result);


  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
}());
