module.exports = function($mdThemingProvider, $interpolateProvider) {

  'ngInject';

  $interpolateProvider.startSymbol('//');
  $interpolateProvider.endSymbol('//');

  $mdThemingProvider.definePalette('white', {
    50: 'ffffff',
    100: 'ffffff',
    200: 'ffffff',
    300: 'ffffff',
    400: 'ffffff',
    500: 'ffffff',
    600: 'ffffff',
    700: 'ffffff',
    800: 'ffffff',
    900: 'ffffff',
    A100: 'ffffff',
    A200: 'ffffff',
    A400: 'ffffff',
    A700: 'ffffff',
    contrastDefaultColor: 'dark'
  });

  $mdThemingProvider
    .theme('default')
    .primaryPalette('indigo')
    .accentPalette('grey', {
      default: '900'
    })
    .backgroundPalette('white', {
      default: '300'
    });

  $mdThemingProvider
    .theme('eventlow')
    .primaryPalette('light-green')
    .backgroundPalette('light-green', {
      default: '500'
    });

  $mdThemingProvider
     .theme('producthigh')
     .primaryPalette('amber')
     .accentPalette('amber', {
       default: '900'
     })
    .backgroundPalette('amber', {
      default: '500'
    });

  $mdThemingProvider
     .theme('productveryhigh')
     .primaryPalette('amber')
    .backgroundPalette('amber', {
      default: '900'
    });

  $mdThemingProvider.alwaysWatchTheme(true);

};
