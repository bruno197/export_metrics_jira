module.exports = function($rootScope, $mdSidenav, $scope, $mdMedia, $window, AppService) {

  'ngInject';

  var self = this;
  AppService.setLoading(false);
  this.data = AppService;

  if ($mdMedia('gt-md')) {
    self.lockedNavigation = true;
  } else {
    self.lockedNavigation = false;
  }

  self.openedNavigation = true;

  $scope.$watch(function() {
    return $mdMedia('xl');
  }, function(mediumScreen) {
    self.mediumScreen = mediumScreen;
    self.lockedNavigation = mediumScreen;

    if (mediumScreen) {
      $mdSidenav('navigation-drawer').open();
    }
  });

  this.toggleNavigation = function() {
    $mdSidenav('navigation-drawer').toggle();
    self.openedNavigation = !$mdSidenav('navigation-drawer').isOpen();
  };

  this.notificationsVisible = false;

  this.toggleNotifications = function() {
    this.notificationsVisible = !this.notificationsVisible;
  };

};
