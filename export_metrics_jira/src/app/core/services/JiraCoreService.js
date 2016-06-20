module.exports = function JiraCoreService(AppService) {
    'ngInject';

//    gadgets.user = {};
    JiraCoreService.data = [];
    JiraCoreService.errors = [];
    JiraCoreService.status = 200;

    JiraCoreService.getAllProjects = function(){
        var url = AppService.baseUrl + "/rest/api/2/project";
        AppService.invokePromise(url).then(function(result) {
            return result;
        }, function(err) {
            AppService.setError(err.message);
        });
    }

    //get UserPref
//    var prefs = new gadgets.Prefs();

    // Get configured user prefs
//    var prefs = new gadgets.Prefs();
//    var numEntries = prefs.getInt("num_entries");

    // Fetch issues when the gadget loads
//    gadgets.util.registerOnLoadHandler(fetchUser);
//    gadgets.util.registerOnLoadHandler(getAllProject);


//    function getSprintsByProject(key) {
//        url = '/rest/greenhopper/1.0/sprint/picker';
//        var params = {};
//        params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
//        params['project'] = key;
//
//        gadgets.io.makeRequest(baseUrl+url, function(data) {
//                console.log(data);
//            }, params);
//    }
//
//    function sendEmail() {
//        $('#loading').show();
//        $.ajax({
//            type: "POST",
//            contentType: 'application/json',
//            url: 'http://172.16.59.54:8000/jira/send/email',
//            data: JSON.stringify({"name": "Bruno Rodrigues", "email": "brunofr@ciandt.com", "report": [gadgets.user]}),
//            dataType: 'json',
//            success: function(data) {
//                displayMessage(_message.status.success, data.message);
//            }
//        }).fail(function() {
//            displayMessage(_message.status.error, 'Unable to send');
//        }).always(function() {
//            $('#loading').hide();
//        });
//    }

    JiraCoreService.makePOSTRequest = function(url, handleRequest) {
        var refreshInterval = 0;
        var ts = new Date().getTime();
        var sep = "?";
        if (refreshInterval && refreshInterval > 0) {
            ts = Math.floor(ts / (refreshInterval * 1000));
        }
        if (url.indexOf("?") > -1) {
            sep = "&";
        }
        url = [ url, sep, "nocache=", ts ].join("");

        var params = {};
        params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;

        gadgets.io.makeRequest(baseUrl+url, handleRequest, params);
    };

    JiraCoreService.promisePOSTRequest = function(url){
        return new Promise(function(resolve, reject) {
        var refreshInterval = 0;
        var ts = new Date().getTime();
        var sep = "?";
        if (refreshInterval && refreshInterval > 0) {
            ts = Math.floor(ts / (refreshInterval * 1000));
        }
        if (url.indexOf("?") > -1) {
            sep = "&";
        }
        url = [ url, sep, "nocache=", ts ].join("");

        var params = {};
        params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;

        gadgets.io.makeRequest(AppService.baseUrl+url, function(result){
            if (result.errors.length === 0 && result.rc === 200) {
                resolve(result.data, result.rc);
            }
            else {
                reject(result.errors, result.rc);
            }
        }, params);
    })
    };
//    JiraCoreService.promisePOSTRequest = new Promise(function(resolve, reject) {
//        var refreshInterval = 0;
//        var ts = new Date().getTime();
//        var sep = "?";
//        if (refreshInterval && refreshInterval > 0) {
//            ts = Math.floor(ts / (refreshInterval * 1000));
//        }
//        if (url.indexOf("?") > -1) {
//            sep = "&";
//        }
//        url = [ url, sep, "nocache=", ts ].join("");
//
//        var params = {};
//        params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
//
//        gadgets.io.makeRequest(baseUrl+url, function(data){
//            if (result.errors.length === 0 && result.rc === 200) {
//                resolve(result.data, result.rc);
//            }
//            else {
//                reject(result.errors, result.rc);
//            }
//        }, params);
//    });

//    JiraCoreService.promise = new Promise(function(resolve, reject) {
//      // do a thing, possibly async, then…
//
//      if (/* everything turned out fine */) {
//        resolve("Stuff worked!");
//      }
//      else {
//        reject(Error("It broke"));
//      }
//    });

//    function handleProjects(data) {
//        gadgets.data = data.data;
//        gadgets.status = data.rc;
//
//        var options = '<option value="" disabled selected>Select some project</option>';
//        $.each(gadgets.data, function(key, value){
//            options += '<option value="' + value.key + '">' + value.name  + '</option>';
//        });
//        options += '<option value="">All projects</option>';
//        $("#project").html(options);
//
//        $('#loading').hide();
//        gadgets.window.adjustHeight();
//    }
//
//    function handleUser(data) {
//        gadgets.user = data.data;
//        gadgets.status = data.rc;
//        try{
//            $('#user').html(isValid(gadgets.user.emailAddress));
//        } catch(err){
//            $('#user').html(err);
//        }
//    }
//
//    function handleSprints(data) {
//
//
//        $('#metrics label').html('teste');
//    }
//
//    function handleIssues(data) {
//        gadgets.data = data.data;
//        gadgets.status = data.rc;
//        var out = '';
//
//        $.each(gadgets.data.issues, function(key, value){
//            out += '<tr><td>' + value.key + '</td><td>'
//                + value.fields.summary + '</td><td>'
//                + value.fields.status.name +'</td></tr>';
//        });
//        $('tbody').html(out);
//    }
//
//    //JQUERY EVENTS
//    $('#project').on('change', function() {
//        searchIssuesByProject(this.value);
//    });
//
//    $( 'button' ).click(function() {
//        sendEmail();
//    });
//
//    //Utils
//    function isValid(value) {
//        if( typeof value !== 'undefined' ) {
//            if( value ) {
//                return value;
//            }
//        }
//        return "erro!";
//    }
//
//    function displayMessage(type, message) {
//        var color = 'rgba(255, 0, 0, 0.5)';
//        if( type === 'warning'){
//            color = 'rgba(255,235,59,0.5)';
//        } else if(type === 'success') {
//            color = 'rgba(76, 175, 80, 0.5)';
//        }
//
//        $('.msgbox').css('background-color', color).html(message)
//            .hide()
//            .fadeIn('slow').delay(4500).fadeOut('slow');
//    }
//
//    JiraCoreService.getUser = function() {
//        var config = {
//            headers : {
//                'Content-Type':'application/json; charset=utf-8'
//            }
//        }
//
//        return $http.get('/rest/api/2/myself', config)
//            .success(successCallback)
//            .error(errorCallback);
//    };
//
//    var successCallback = function(data, status){
//        console.log(data);
//	    gadgets.data = data;
//	    gadgets.status = status;
//    };
//
//	var errorCallback = function(data, status){
//	    console.log(data);
//        gadgets.errors = data;
//		gadgets.status = status;
//    };

  return JiraCoreService;
}
