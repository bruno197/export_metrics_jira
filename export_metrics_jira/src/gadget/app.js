require('angular');

angular.module('Gadget', [
require('angular-animate'),
  require('angular-material'),
  require('angular-material-sidemenu'),
  require('angular-messages'),
  require('angular-sanitize'),
  require('angular-ui-router'),
  require('./core')
])
.config(require('./config'));
