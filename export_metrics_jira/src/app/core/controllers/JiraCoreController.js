module.exports = function(AppService, $scope, $q, $http, $mdDialog, $mdToast) {
    'ngInject';

    var init = function() {
        $scope.selectProject;
        $scope.selectBoard;
        $scope.issues = [];
        $scope.metrics = {};

        $scope.metrics.failure = {};
        $scope.metrics.failure.allbugs = 0;
        $scope.metrics.failure.completedbugs = 0;

        $scope.metrics.cost = {};
        $scope.metrics.cost.alltime = 0;
        $scope.metrics.cost.sprintstotal = 0;

        $scope.metrics.leadtime = {};
        $scope.metrics.leadtime.allstory = 0;
        $scope.metrics.failure.completedstory = 0;

        $scope.metrics.relativevelocity = {};
        $scope.metrics.relativevelocity.storypointscurrent = 0;
        $scope.metrics.relativevelocity.storypointsfirst = 0;

        $scope.showmetrics = false;
    }

    $scope.showSprintsByProject = function(){
        AppService.params['project'] = $scope.selectProject.key;
        AppService.invokeJiraPromise("/rest/greenhopper/1.0/sprint/picker").then(function(result) {
        //http://192.168.99.100:8080/rest/greenhopper/1.0/integration/teamcalendars/sprint/list?jql=project=GK
            $scope.issues = result.data.suggestions;
        }, function(err) {
            $scope.issues = ['c', 'd'];
            AppService.setError(err.message);
        });
    }

    $scope.showBoardInfo = function() {
        init();
        getSprintsByBoard();
    }

    var getAllProjects = function() {
        AppService.invokeJiraPromise("/rest/api/2/project").then(function(result) {
            $scope.projects = result.data;
        }, function(err) {
            $scope.projects = ['a', 'b'];
            AppService.setError(err.message);
        });
    }

    var getBoards = function() {
        AppService.invokeJiraPromise("/rest/greenhopper/1.0/rapidviews/list").then(function(result) {
            $scope.boards = result.data.views;
        }, function(err) {
            $scope.boards = ['board a', 'board b'];
            AppService.setError(err.message);
        });
    }

    var getSprintsByBoard = function() {
        var url = "/rest/greenhopper/1.0/sprintquery/";
        url += $scope.selectBoard.id;
        url += "?includeHistoricSprints=true&includeFutureSprints=true";

        AppService.invokeJiraPromise(url).then(function(result) {
            $scope.sprints = result.data.sprints;
            searchIssuesBySprint();
        }, function(err) {
            $scope.sprints = ['sprint a', 'sprint b'];
            AppService.setError(err.message);
        });
    }

    var searchIssuesBySprint = function() {
        var url = "/rest/api/2/search";

        var promises = [];

        angular.forEach($scope.sprints, function(value, key){
            promises.push(
                AppService.invokeJiraPromise(url+"?" +
                    gadgets.io.encodeValues({jql: 'sprint=' + value.id}))
                .then(function(result) {
                    $scope.issues.push.apply($scope.issues, result.data.issues);
                }, function(err) {
                    $scope.issues.push(['issue a', 'issue b']);
                    AppService.setError(err.message);
                })
            );
        });
        $scope.showmetrics = true;
        $q.all(promises).then(function () {
            costofSprint();
            failureLoad();
            leadTime();
            relativeVelocity();
        });
    }

    var failureLoad = function() {
        angular.forEach($scope.issues, function(value, key) {
            if(value.fields.issuetype.name === 'Bug') {
                $scope.metrics.failure.allbugs += 1;
                if(value.fields.status.name === 'Done') {
                    $scope.metrics.failure.completedbugs += 1;
                }
            }
        });
    }

    var costofSprint = function() {
        $scope.metrics.cost.sprintstotal = $scope.sprints.length;
        angular.forEach($scope.issues, function(value, key) {
            if(value.fields.timespent !== null) {
                $scope.metrics.cost.alltime += value.fields.timespent;
            }
        });
    }

    var leadTime = function() {
        angular.forEach($scope.issues, function(value, key) {
            if(value.fields.issuetype.name === 'Story') {
                $scope.metrics.leadtime.allstory += 1;
                if(value.fields.status.name === 'Done') {
                    $scope.metrics.failure.completedstory += 1;
                }
            }
        });
    }

    var relativeVelocity = function() {
        var url = "/rest/greenhopper/1.0/rapid/charts/sprintreport?";
        url += "rapidViewId=" + $scope.selectBoard.id;

        var defer = $q.defer();
        var promises = [];

        promises.push(
            AppService.invokeJiraPromise(url+"&sprintId="+$scope.sprints[0].id).then(function(result) {
                $scope.metrics.relativevelocity.storypointsfirst = result.data.contents.completedIssuesEstimateSum.value;
            }, function(err) {
                AppService.setError(err.message);
            })
        );

        angular.forEach($scope.sprints, function(value, key){
            if(value.state === 'ACTIVE') {
                promises.push(
                    AppService.invokeJiraPromise(url+"&sprintId="+value.id).then(function(result) {
                        $scope.metrics.relativevelocity.storypointscurrent = result.data.contents.completedIssuesEstimateSum.value;
                    }, function(err) {
                        AppService.setError(err.message);
                    })
                );
            }
        });

        $q.all(promises).then(function () {
            //After all promises run
        });
    }

    AppService.sendEmail = function() {
        var confirm;
        if(angular.isUndefined($scope.selectBoard)) {
            confirm = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("None board was selected!")
                .textContent('Before sending an email, select a board.')
                .ariaLabel("None board was selected!")
                .ok('Got it!')
        } else {
        confirm = $mdDialog.prompt()
                .title('Send report by email.')
                .textContent("Fill the field with a valid email if you want to send a copy to another address, or leave it blank.")
                .placeholder('Email')
                .ariaLabel('Email')
                .ok('Send!')
                .cancel('Cancel');
        }

        $mdDialog.show(confirm).then(function(result) {
            $http({
                method: 'POST',
                url: 'https://blooming-oasis-63387.herokuapp.com/api/sendemail',
                data: {user: AppService.user, metrics: $scope.metrics},
            }).then(function successCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .parent('.main-content')
                        .hideDelay(3000)
                );
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .parent('.main-content')
                        .hideDelay(3000)
                );
            });
        }, function() {
            console.log('error!');
        });
    }

    init();
    getBoards();

};
