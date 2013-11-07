//TODO: make namespaces
var AJL = (function (window, document, AJL) {
    if (typeof AJL !== 'function') {
        AJL = function () {
            var packageManager = AJL.PackageManager,
                curPackage = {},
                curName = '',
                curAssets = [],
                curConfig = {};

            for (var item in arguments) {
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
    }
    return AJL;
})(window, document, window.AJL || {});