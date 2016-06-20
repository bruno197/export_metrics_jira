module.exports = function($http) {
    'ngInject';
    var app = {
        user: {},
        loading: true,
        baseUrl: "http://"+window.location.host,
        error: '',
        params: {}
    };

    app.invokeJiraPromise = function(url){
        return new Promise(function(resolve, reject) {
            var path = app.baseUrl.concat(url);
            //Disable gadget cache
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

  app.setLoading = function(loading) {
    app.loading = loading;
  };

  app.setUser = function(user) {
    app.user = user;
  };

  app.setError = function(erro) {
    app.error = erro;
  };

  return app;
};