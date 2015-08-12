(function(){
  'use strict';

  describe('Controller: dashboardCtrl', function () {

    // load the controller's module
    beforeEach(module('widgetsApp'));
    beforeEach(module('dashboardApp'));

    var AboutCtrl,
    scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      AboutCtrl = $controller('dashboardCtrl', {
        $scope: scope
        // place here mocked dependencies
      });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
      expect(AboutCtrl.message).toBe("The Wildboard");
    });
  });

}());
