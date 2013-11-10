var AJL = (function (window, document, AJL) {
    //TODO: make autodetect of needed method
    //This need for different params in AJL by one function for use
    /**
     * @return {boolean|PackageManager}
     */
    AJL = function () {
        var packageManager = AJL.PackageManager,
            namespace = AJL.Namespace,
            curPackage = {},
            curName = '',
            curAssets = [],
            curConfig = {},
            argLength = arguments.length,
            item;

        //If this two arguments
        if (argLength == 2) {
            //And first one is string and second object or function
            if (typeof arguments[0] == "string" && (typeof arguments[1] == "object" || typeof arguments[1] == "function")) {
                //Then I think that it's namespace setting
                namespace.setNamespace(arguments[0], arguments[1]);
                return true;
            }
        }

        //IMPORTANT: This cycle need to be execute in last
        //In other cases I go through all arguments
        for (item in arguments) {
            if (arguments.hasOwnProperty(item)) {
                //And if some of them not object than halt
                if (typeof arguments[item] != "object") {
                    return false;
                }
            }
        }

        //If all gone right than need initialize packages
        for (item in arguments) {
            if (arguments.hasOwnProperty(item)) {
                curName = arguments[item].name;
                curAssets = arguments[item].assets;
                curConfig = arguments[item].config;
                curPackage = new AJL.Package(curName, curAssets, curConfig);
                packageManager.setPackage(curPackage);
            }
        }

        return packageManager;
    };

    function getEntryPointUrl() {
        var scripts = document.getElementsByTagName('script'),
            entryPointUrl,
            i;
        for (i = 0; i < scripts.length; i++) {
            //TODO: make sure that this will work 100%
            entryPointUrl = scripts[i].getAttribute('data-ep');
            if (entryPointUrl) {
                return entryPointUrl;
            }
        }
        return false;
    }

    //TODO: think about waiting for loading AJL.Loader
    setTimeout(function () {
        AJL.Loader.appendScriptTag(getEntryPointUrl());
    }, 100);

    return AJL;
})(window, document, window.AJL || {});
