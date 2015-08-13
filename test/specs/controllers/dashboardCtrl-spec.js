(function(){
  'use strict';

  describe('Controller: dashboardCtrl', function () {

    // load the controller's module
    beforeEach(module('dashboardApp'));

    var AboutCtrl;
    var scope;
    var q;
    var deferred;
    var apiDashboard;
    var rootScope;
    var timeout;
    var timerCallback;



    beforeEach(function() {
      timerCallback = jasmine.createSpy("timerCallback");
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });




    beforeEach(function () {
      //settings = {"netbiosName": "DIYController", "minutesBetweenNTPUpdate": "600000", "ntpServerName": "pool.ntp.org", "historyFilename": "temperatures.txt", "timeZoneOffset": "0", "temperatureOffset": "10", "minutesBetweenReadings": "600000", "enableDHCP": "true", "staticIPAddress": "0.0.0.0", "subnetMask": "255.255.255.0", "defaultGateway": "0.0.0.0", "primaryDNSAddress": "192.168.1.1", "secondaryDNSAddress": "0.0.0.0", "voltageReference": "3.3", "padResistance": "10000", "resistanceRT": "10000", "coefficientA": "0.003354016", "coefficientB": "0.0002744032", "coefficientC": "0.000003666944", "coefficientD": "0.0000001375492", "kpValue": "400", "kiValue": "435.56", "kdValue": "0"};
      //status = {"timeOfReading": "11\/29\/2011 04:09:31", "temperatureCelsius": "21.174", "temperatureFahrenheit": "70.112", "isHeating": "True", "pidOutput": "50", "setTemperature": "154.0", "currentMashStep": "0", "currentMashTemp": "154", "currentMashTime": "10"};
      //profiles = [{mashTemperature: 120, mashStepLength:20},{mashTemperature: 135, mashStepLength:20},{mashTemperature: 154, mashStepLength:60},{mashTemperature: 170, mashStepLength:20}];
      apiDashboard = {
        /*getSettings: function () {
          deferred = q.defer();
          return deferred.promise;
        },*/
        create: function (target) {
          return;
        },
        getCurrentDashboard: function(){
          return 34;
        },
        setCurrentDashboard: function(){

        },
        load_and_show_widgets : function(){}
      };
    });


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q, $timeout) {
      scope = $rootScope.$new();
      rootScope = $rootScope;
      timeout = $timeout;
      q = $q;
      AboutCtrl = $controller('dashboardCtrl', {
        $scope: scope,
        Dashboards: apiDashboard
        // place here mocked dependencies
      });
    }));


    describe('$scope.toggleModal', function(){
      it('should clean the controller name field and should change the showModal value', function(){
        AboutCtrl.name = 'some value';
        scope.showModal = true;

        scope.toggleModal();

        expect(AboutCtrl.name).toBe('');
        expect(scope.showModal).toBe(false);
      });
    });


    describe('controller.createDashboard', function(){
      it('should clean the controller.name field, should change the showModal to false and shoul cahgne the scope.item to the getCurrentDashboard value', function(){
        var deferred = q.defer();
        spyOn(apiDashboard, 'create').and.returnValue(deferred.promise);
        spyOn(apiDashboard, 'load_and_show_widgets').and.returnValue(deferred.promise);

        AboutCtrl.createDashboard();
        deferred.resolve();
        rootScope.$digest();
        timeout.flush();

        jasmine.clock().tick(1);
        expect(scope.item).toBe(34);
        expect(AboutCtrl.name).toBe('');
        expect(scope.showModal).toBe(false);
      });
    });

    

  });

}());
