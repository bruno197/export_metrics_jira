var moduleName = 'Gadget.Core';

angular.module(moduleName, [])
  .directive('loading', require('./directives/SpinerDirective'))
  .directive('metricsDetail', require('./directives/MetricsDetailDirective'))
  .controller('AppController', require('./controllers/AppController'))
  .controller('DashboardController', require('./controllers/DashboardController'))
  .controller('JiraCoreController', require('./controllers/JiraCoreController'))
  .service('AppService', require('./services/AppService'))
  .service('JiraCoreService', require('./services/JiraCoreService'));

module.exports = moduleName;