module.exports = function($http) {
    'ngInject';
    var app = {
        //API_HOST: 'https://blooming-oasis-63387.herokuapp.com',
        API_HOST: 'http://172.16.59.54:8000',
        user: {},
        loading: true,
        baseUrl: "http://"+window.location.host,
        error: '',
        params: {},
        title: '',
        showSprint: false
    };

    app.invokeJiraPromise = function(url){
        return new Promise(function(resolve, reject) {
            var path = app.baseUrl.concat(url);
            /* Disable gadget cache
            ** Set nocache for all request
            */
            var refreshInterval = 0;
            var ts = new Date().getTime();
            var sep = "?";
            if (refreshInterval && refreshInterval > 0) {
                ts = Math.floor(ts / (refreshInterval * 1000));
            }
            if (path.indexOf("?") > -1) {
                sep = "&";
            }
            path = [ path, sep, "nocache=", ts ].join("");
            //END Disable gadget cache

            app.params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;

            gadgets.io.makeRequest(path, function(result){
                if (result.errors.length === 0 && result.rc === 200) {
                    resolve(result);
                }
                else {
                    reject(result);
                }
            }, app.params);
        })
    };

    app.invoke = function(request) {
        return $http(request);
    }

    app.setLoading = function(loading) {
        app.loading = loading;
    };

    app.setUser = function(user) {
        app.user = user;
    };

    app.setError = function(erro) {
        app.error = erro;
    };

    app.setTitle = function(title) {
      app.title = title;
    };

    app.setShowSprint = function(showSprint) {
      app.showSprint = showSprint;
    };

    return app;
};