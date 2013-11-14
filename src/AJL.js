var AJL = (function (window, document, AJL) {
    /**
     * Make calls of other function in shorthand
     * @returns {AJL.PackageManager|Boolean}
     * @constructor
     * @namespace AJL
     */
    AJL = function () {
        var packageManager = AJL.PackageManager,
            namespace = AJL.Namespace,
            helper = AJL.Helper,
            packageInstance = {},
            packageName = '',
            packageAssets = [],
            packageConfig = {},
            argLength = arguments.length,
            argFirst,
            argSecond,
            i;

        switch (argLength) {
            case 0:
                //If arguments not exists then just return PackageManager instance
                return packageManager;
            case 1:
                argFirst = arguments[0];
                //If this arg is string then return package with this name
                if (helper.isString(argFirst)) {
                    return packageManager.getPackage(argFirst);
                }
                break;
            case 2:
                argFirst = arguments[0];
                argSecond = arguments[1];
                //If first arg is string and second object or function
                if (helper.isString(argFirst) && (helper.isObject(argSecond) || helper.isFunction(argSecond))) {
                    //Then I think that it's namespace setting
                    namespace.setNamespace(argFirst, argSecond);
                    return packageManager;
                }
                break;
            default:
                break;
        }
        //If all predefined templates in arguments didn't decided then create packages from them
        for (i = 0; i < argLength; i++) {
            if (!helper.isUndefined(arguments[i])) {
                packageName = arguments[i].name;
                packageAssets = arguments[i].assets;
                packageConfig = arguments[i].config;
                packageInstance = new AJL.Package(packageName, packageAssets, packageConfig);
                packageManager.setPackage(packageInstance);
            }
        }

        return packageManager;
    };

    //This hack needed for init EntryPoint.js when all AJL.min.js will loaded
    setTimeout(function () {
        AJL.Loader.loadEntryPoint();
    }, 0);

    return AJL;
})(window, document, window.AJL || {});
