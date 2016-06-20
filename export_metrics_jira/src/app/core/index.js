var moduleName = 'Gadget.Core';

angular.module(moduleName, [])
  .controller('AppController', require('./controllers/AppController'))
  .controller('JiraCoreController', require('./controllers/JiraCoreController'))
  .service('AppService', require('./services/AppService'))
  .service('JiraCoreService', require('./services/JiraCoreService'));

module.exports = moduleName;