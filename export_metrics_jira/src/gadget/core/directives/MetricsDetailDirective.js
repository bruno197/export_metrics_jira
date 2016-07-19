module.exports = function() {
  'ngInject';
  return {
    require: '?ngModel',
    restrict: 'AE',
    link: function(scope, element, attr, controller) {
      var gradlineSize = angular.isUndefined(scope.sprints) ? -1 : scope.sprints.length;
      var settings = {
        legend: { position: 'bottom' },
         hAxis: { 
          title: 'Sprint',
          gridlines: {count: gradlineSize},
        },
        vAxis: { 
          title: 'Story points',
          format: 'short'
        },
        width: 450
      };

      var getOptions = function() {
        return angular.extend({ }, settings, scope.$eval(attr.qnPiechart));
      };

      // creates instance of datatable and adds columns from settings
      var getDataTable = function() {
          var columns = scope.$eval(attr.qnColumns);
          var data = new google.visualization.DataTable();
          angular.forEach(columns, function(column) {
              data.addColumn(column.type, column.name);
          });
          return data;
      };

      var getRows = function() {
        if(scope.template == "cost_of_sprint"){
          var rows = [];
          angular.forEach(scope.sprints, function(sprint, key) { 
            var sprintTime = 0;
            angular.forEach(sprint.issues, function(issue, key) { 
              if(issue.fields.timespent !== null) { 
                sprintTime += issue.fields.timespent;
              } 
            });
            rows.push([key, sprintTime]); 
          });
         return rows;
        }
        return [[0,5], [1,2], [2,5], [3,3]];
      }

      var init = function() {
          var options = getOptions();
          var rows = getRows();
          if (controller) {

              var drawChart = function() {
                  var data = getDataTable();
                  // set model
                  data.addRows(rows);

                  // Instantiate and draw our chart, passing in some options.
                  var pie = new google.visualization.LineChart(element[0]);
                  pie.draw(data, options);
              };

              controller.$render = function() {
                  drawChart();
              };
          }

          if (controller) {
              // Force a render to override
              controller.$render();
          }
      };

      // Watch for changes to the directives options
      scope.$watch(getOptions, init, true);
      scope.$watch(getDataTable, init, true);
      scope.$watch(getRows, init, true);
    }
  };

  function buildTable(body){
    return '<md-content layout-padding layout="row" layout-align="center start">' +
        '<table md-colresize="md-colresize" class="md-table">' +
            '<thead>' +
                '<tr class="md-table-headers-row">' +
                    '<th colspan="2" class="md-table-header">' +
                        '<h2>Failure load</h2>' +
                    '</th>' +
                '</tr>' +
                '<tr class="md-table-headers-row">' +
                    '<th class="md-table-header">' +
                        '<span>Field</span>' +
                    '</th>' +
                    '<th class="md-table-header">' +
                        '<span>Value</span>' +
                    '</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
                body
            '</tbody>' +
        '</table>' +
    '</md-content>'
  }

  function buildLeadTime(leadtime){
    return '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'All story' +
      '</td>' +
      '<td class="md-table-content">' +
        leadtime.allstory +
      '</td>' +
    '</tr>' +
    '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'Sprints total' +
      '</td>' +
      '<td class="md-table-content">' +
        leadtime.completedstory +
      '</td>' +
    '</tr>'
  }

  function buildCostOfSprint(cost){
    return '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'All time' +
      '</td>' +
      '<td class="md-table-content">' +
        cost.alltime +
      '</td>' +
    '</tr>' +
    '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'Sprints total' +
      '</td>' +
      '<td class="md-table-content">' +
            cost.sprintstotal +
      '</td>' +
    '</tr>'
  }

  function buildFailureLoad(failure){
    return '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'All sprints' +
      '</td>' +
      '<td class="md-table-content">' +
        failure.allbugs +
      '</td>' +
    '</tr>' +
    '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'Sprints total' +
      '</td>' +
      '<td class="md-table-content">' +
            failure.completedbugs +
      '</td>' +
    '</tr>'
  }

  function buildRelativeVelocity(relativevelocity){
    return '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'All sprints' +
      '</td>' +
      '<td class="md-table-content">' +
        relativevelocity.storypointscurrent +
      '</td>' +
    '</tr>' +
    '<tr class="md-table-content-row">' +
      '<td class="md-table-content">' +
        'Sprints total' +
      '</td>' +
      '<td class="md-table-content">' +
         relativevelocity.storypointsfirst +
      '</td>' +
    '</tr>'
  }
};