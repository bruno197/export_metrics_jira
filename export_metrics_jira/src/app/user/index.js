var moduleName = 'Orion.User';

angular
  .module(moduleName, [])
  .controller('UserController', require('./controllers/UserController'));

module.exports = moduleName;