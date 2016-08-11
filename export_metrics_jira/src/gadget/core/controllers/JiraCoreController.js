module.exports = function(AppService, $scope, $q, $http, $mdDialog, $mdToast, $mdSidenav) {
    'ngInject';
    AppService.setLoading(false);

    $scope.selectSprint;
    //$scope.colunas = [{type:'number', name: 'Sprint'},{type:'number', name: 'Points'}];

    var init = function() {
        $scope.selectProject;
        $scope.selectBoard;

        $scope.hourlyRate = 0;

        $scope.metrics = {};

        $scope.showmetrics = false;
        AppService.setShowSprint(false);
    }

    $scope.showBoardInfo = function() {
        init();
        getSprintsByBoard();
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
                    $scope.sprints[key].issues = result.data.issues;
                }, function(err) {
                    AppService.setError(err.message);
                })
            );
        });

        $scope.showmetrics = true;
        AppService.setTitle('Aggregate Metrics');

        $q.all(promises).then(function () {
            updateMetrics($scope.sprints);
        });
    }

    var updateMetrics = function(sprints) {
        costofSprint(sprints);
        failureLoad(sprints);
        reworkPercentage(sprints);
        leadTime(sprints);
        relativeVelocity();
        unplannedWork(sprints);
        costOfProject(sprints);
        reworkByEpic(sprints);
    }

    var costofSprint = function(sprints) {
        $scope.metrics.cost = {alltime: 0, sprintstotal: 0};

        $scope.metrics.cost.sprintstotal = sprints.length;
        angular.forEach(sprints, function(sprint, key) {
            angular.forEach(sprint.issues, function(issue, key) {
                if(issue.fields.timespent !== null) {
                    $scope.metrics.cost.alltime += issue.fields.timespent;
                }
            });
        });
    }

    var failureLoad = function(sprints) {
        $scope.metrics.failure = {allbugs: 0, completedbugs: 0};

        angular.forEach(sprints, function(sprint, key) {
            angular.forEach(sprint.issues, function(value, key) {
                if(value.fields.issuetype.name === 'Bug') {
                    $scope.metrics.failure.allbugs += 1;
                    if(value.fields.status.name === 'Done') {
                        $scope.metrics.failure.completedbugs += 1;
                    }
                }
            });
        });
    }

    var reworkPercentage = function(sprints) {
        $scope.metrics.reworkpercentage = {alltime: 0, bugtime: 0};

        angular.forEach(sprints, function(sprint, key) {
            angular.forEach(sprint.issues, function(value, key) {
                if(value.fields.timespent !== null) {
                    $scope.metrics.reworkpercentage.alltime += value.fields.timespent;
                    if(value.fields.issuetype.name === 'Bug') {
                        $scope.metrics.reworkpercentage.bugtime += value.fields.timespent;
                    }
                }
            });
        });
    }

    var leadTime = function(sprints) {
        $scope.metrics.leadtime = {allstory: 0, completedstory: 0};

        angular.forEach(sprints, function(sprint, key) {
            angular.forEach(sprint.issues, function(value, key) {
                if(value.fields.issuetype.name === 'Story') {
                    $scope.metrics.leadtime.allstory += 1;
                    if(value.fields.status.name === 'Done') {
                        $scope.metrics.failure.completedstory += 1;
                    }
                }
            });
        });
    }

    var teamSprintVelocity = function(sprints) {
        $scope.metrics.team = [];
    }

    var relativeVelocity = function() {
        $scope.metrics.relativevelocity = {storypointscurrent: 0, storypointsfirst: 0};

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

    var unplannedWork = function(sprints) {
        $scope.metrics.unplannedwork = {completedIssuesEstimateSum: 0, allIssuesEstimateSum: 0};

        var url = "/rest/greenhopper/1.0/rapid/charts/sprintreport?";
        url += "rapidViewId=" + $scope.selectBoard.id;

        var defer = $q.defer();
        var promises = [];

        angular.forEach(sprints, function(sprint, key){
            promises.push(
                AppService.invokeJiraPromise(url+"&sprintId="+sprint.id).then(function(result) {
                    $scope.sprints[key].completedIssuesEstimateSum = result.data.contents.completedIssuesEstimateSum.value;
                    $scope.sprints[key].allIssuesEstimateSum = result.data.contents.allIssuesEstimateSum.value;
                    return result.data.contents;
                }, function(err) {
                    AppService.setError(err.message);
                    return err;
                })
            );
        });

        $q.all(promises).then(function (result) {
            angular.forEach($scope.sprints, function(contents, key){
                $scope.metrics.unplannedwork.completedIssuesEstimateSum += contents.completedIssuesEstimateSum;
                $scope.metrics.unplannedwork.allIssuesEstimateSum += contents.allIssuesEstimateSum;
            });
        });;
    }

    var planningAccuracy = function(sprints) {
        $scope.metrics.planningaccuracy = {completedStoryPoints: 0, commitedStoryPoints: 0};

        angular.forEach(sprints, function(sprint, key) {
            $scope.metrics.planningaccuracy.completedStoryPoints += sprint.completedIssuesEstimateSum;
        });
    }

    var costOfProject = function(sprints) {
        $scope.metrics.costofproject = {};

        angular.forEach(sprints, function(sprint, key) {
            angular.forEach(sprint.issues, function(issue, key) {
                if(issue.fields.customfield_10005 !== null){
                    if($scope.metrics.costofproject[issue.fields.customfield_10005] !== undefined) {
                        if(issue.fields.timespent !== null) {
                            $scope.metrics.costofproject[issue.fields.customfield_10005].hoursspent += issue.fields.timespent;
                        }
                        if(issue.fields.timeestimate !== null) {
                            $scope.metrics.costofproject[issue.fields.customfield_10005].hourlyrate += issue.fields.timeestimate;
                        }
                    } else {
                        $scope.metrics.costofproject[issue.fields.customfield_10005] = {hoursspent: 0, hourlyrate: 0};
                        if(issue.fields.timespent !== null) {
                            $scope.metrics.costofproject[issue.fields.customfield_10005].hoursspent = issue.fields.timespent;
                        }
                        if(issue.fields.timeestimate !== null) {
                            $scope.metrics.costofproject[issue.fields.customfield_10005].hourlyrate = issue.fields.timeestimate;
                        }
                    }
                }
            });
        });
    }

    var backlogHealth = function(sprints) {
        $scope.metrics.backloghealth = {currentapprovedstories: 0};


    }

    var reworkByEpic = function(sprints) {
        $scope.metrics.reworkepic = {};

        angular.forEach(sprints, function(sprint, key) {
            angular.forEach(sprint.issues, function(issue, key) {
                if(value.fields.issuetype.name === 'Bug') {
                    if(issue.fields.customfield_10005 !== null){
                        if($scope.metrics.reworkepic[issue.fields.customfield_10005] !== undefined) {
                            if(issue.fields.timespent !== null) {
                                if(issue.fields.status.name === 'Done') {
                                    $scope.metrics.reworkepic[issue.fields.customfield_10005].completedbugs += issue.fields.timespent;
                                }
                                $scope.metrics.reworkepic[issue.fields.customfield_10005].alltime += issue.fields.timespent;
                            }
                        } else {
                            $scope.metrics.costofproject[issue.fields.customfield_10005] = {alltime: 0, completedbugs: 0};
                            if(issue.fields.timespent !== null) {
                                if(issue.fields.status.name === 'Done') {
                                    $scope.metrics.reworkepic[issue.fields.customfield_10005].completedbugs = issue.fields.timespent;
                                }
                                $scope.metrics.reworkepic[issue.fields.customfield_10005].alltime = issue.fields.timespent;
                            }
                        }
                    }
                }
            });
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

        $mdDialog.show(confirm).then(function() {
            var request = {
                method: 'GET',
                url: AppService.API_HOST.concat('/api/sendemail'),
                data: {user: AppService.user, metrics: $scope.metrics}
            }
            AppService.invoke(request).then(function(result) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(result.data.message)
                        .position('top right')
                        .parent('.main-content')
                        .hideDelay(3000)
                );
            });
        }, function() {
            console.log('error!');
        });
    }

    $scope.filterIssueBySprint = function(sprint) {
        var sprints = [sprint];
        updateMetrics([sprint]);
    }

    $scope.showDetail = function(template){
        $scope.template = template;
        $mdSidenav('right').toggle();
    }

    $scope.close = function () {
        $mdSidenav('right').close();
    };

    $scope.selectTab = function (env) {
        AppService.setTitle(env.target.attributes[0].nodeValue);
        AppService.setShowSprint(env.target.attributes[0].nodeValue === 'Team Metrics (Steve)' ? true : false);
        if(!AppService.showSprint){
            updateMetrics($scope.sprints);
        }
    };

    $scope.showCostOfSprintSettings = function(ev) {
        var confirm = $mdDialog.prompt()
          .title('Modal "Labor Cost of Sprint" settings')
          .textContent('Blended Hourly Rate.')
          .placeholder('Rate')
          .ok('Submit')
          .cancel('Cancel');
        $mdDialog.show(confirm).then(function(result) {
            if(!isNaN(result)){
                $scope.hourlyRate = result;
            } else {
                $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent("The value isn't numeric")
                    .ok('Got it!')
                );
            }
        }, function() {
        });
    };

    $scope.showReworkPercentageSettings = function(ev) {
        var confirm = $mdDialog.prompt()
          .title('Modal "Rework percentage" settings')
          .textContent('Quality Rate.')
          .placeholder('Rate')
          .ok('Submit')
          .cancel('Cancel');
        $mdDialog.show(confirm).then(function(result) {
            if(!isNaN(result)){
                $scope.qualityRate = result;
            } else {
                $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent("The value isn't numeric")
                    .ok('Got it!')
                );
            }
        }, function() {
        });
    };

    init();
    getBoards();

};
