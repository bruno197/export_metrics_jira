module.exports = function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

  'ngInject';

  $urlMatcherFactoryProvider.strictMode(false);

  $urlRouterProvider
    .otherwise('/error/not-found')
    .when('/', '');

  $stateProvider
    .state('root', {
      abstract: true,
      template: '<div ui-view flex layout="column"></div>',
    });

};
