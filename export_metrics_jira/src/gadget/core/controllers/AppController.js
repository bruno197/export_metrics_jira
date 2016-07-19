module.exports = function($scope, $mdDialog, AppService) {
    'ngInject';

    //Fix Jira bug version 6
    try{
        var edit = window.parent.document.getElementById(window.frameElement.id + '-edit');
        edit.classList.remove('hidden');
        edit.style.display = 'none';

        // Get configured user prefs
        this.prefs = new gadgets.Prefs();
    }catch(err) {
        $mdDialog.show(
            $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Gadget error')
            .textContent("This is a gadget page, you can't open outside the container.")
            .ariaLabel('Alert Gadget Error')
            .ok('Got it!')
        );
    }

    this.data = AppService;

    AppService.invokeJiraPromise("/rest/api/2/myself").then(function(result) {
        AppService.setUser(result.data);
    }, function(err) {
        AppService.setError(err.message);
    });
};
