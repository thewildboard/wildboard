(function(){
  'use strict';

  describe('Service: dashbaordsApi', function () {

    // load the service's module
    beforeEach(module('dashboardApp'));
    beforeEach(module('boardsApp'));

    // instantiate service
    var DashboardsApi;
    var $httpBackend;
    var MY_CONFIG;
    var scope;
    var rootScope;

    var data = [
      {
        "id": "55cb1dae655795941bc1e994",
        "name": "aaa"
      },
      {
        "id": "55cb1e2d73cd61e41b2d81d0",
        "name": "vodka"
      }
    ];

    var dashboard_create = {
      "id" : "55cc618f8cb66c8310c9e5e6",
      "name" : "ss"
    };

    var dashboards_widgets = [
      {
        "id": "55cc7a3d8cb66c8310c9ea17",
        "name": "Coverage of Remote Helper",
        "position": {
          "col": 0,
          "row": 0,
          "width": 1,
          "height": 1
        },
        "style": {
          "color": "blue0"
        },
        "indicator": {
          "source": {
            "provider": {
              "name": "Remote Helper Repository",
              "token": ""
            },
            "id": "coverage",
            "unit": "%"
          },
          "values": [
            {
              "value": 0,
              "date": "2015-08-11T07:50:06.511Z"
            }
          ]
        }
      }
    ];


    beforeEach(inject(function (_DashboardsApi_, _$httpBackend_, _MY_CONFIG_, $rootScope) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      DashboardsApi = _DashboardsApi_;
      $httpBackend = _$httpBackend_;
      MY_CONFIG = _MY_CONFIG_;

    }));

    describe('When I call "all"', function(){
      it('should list the dashboards saved in the backend', function(){
        $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards').respond(200, data);
        var _dashboards = DashboardsApi.all();
        //rootScope.$digest();
        $httpBackend.flush();
        expect(_dashboards.$$state.value.data).toEqual(data);
      });
    });

    describe('When I make a post', function(){
      it('should create a new dashboard', function(){
        $httpBackend.expectPOST(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards').respond(202, dashboard_create);
        var _dashboards = DashboardsApi.post(data);
        $httpBackend.flush();
        expect(_dashboards.$$state.value.data).toEqual(dashboard_create);
      });
    });

    describe('When I make delete a dashbaord', function(){
      it('should', function(){
        $httpBackend.expectDELETE(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/1').respond(202, {"message":"Removed succesfully"});
        var _dashboards = DashboardsApi.delete(1);
        $httpBackend.flush();
        expect(_dashboards.$$state.value.data).toEqual({"message":"Removed succesfully"});
      });
    });

    describe('When I call all dashboards widgets', function(){
      it('should', function(){
        $httpBackend.expectGET(MY_CONFIG.url + ':' + MY_CONFIG.port + '/api/boards/1/widgets').respond(dashboards_widgets);
        var _dashboards = DashboardsApi.allWidgets(1);
        $httpBackend.flush();
        expect(_dashboards.$$state.value.data).toEqual(dashboards_widgets);
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });
}());
