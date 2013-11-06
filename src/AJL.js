var AJL = (function (window, document, AJL) {
    AJL.init = function () {
        var currentPackage = {};
        var currentArg = {};
        for (var pack in arguments) {
            if (arguments.hasOwnProperty(pack)) {
                currentArg = arguments[pack];
                currentPackage = new AJL.Package(currentArg.name, currentArg.assets, currentArg.config);
                AJL.PackageManager.setPackage(currentPackage);
            }
        }
        return AJL.PackageManager;
    };
    return AJL;
})(window, document, window.AJL || {});