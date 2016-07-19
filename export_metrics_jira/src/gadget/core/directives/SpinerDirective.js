module.exports = function($http, AppService) {
    'ngInject';
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (loading)
            {
                if(loading){
                    AppService.setLoading(true);
                }else{
                    AppService.setLoading(false);
                }
            });
        }
    };
};