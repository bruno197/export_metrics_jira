module.exports = function() {
  'ngInject';
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      template: '@',
    },
    link: function (scope, element, attrs) {
        if(scope.template == "cost_of_sprint"){
            element.html(buildCostOfSprint(scope));
        }
    }
  };

  function buildCostOfSprint(metrics){
    return '<md-content layout="row" layout-align="center start">' +
        '<md-list flex>' +
        '<md-subheader class="md-no-sticky">Cost of sprint</md-subheader>' +
        '<md-list-item class="md-2-line">' +
            '<div class="md-list-item-text">' +
                '<h3>titulo</h3>' +
            '</div>' +
            '<p class="md-secondary">' +
            '</p>' +
        '</md-list-item>' +
        '<md-divider ></md-divider>' +
        '</md-list>' +
    '</md-content>'
  }
};