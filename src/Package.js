var AJL = (function (window, document, AJL) {
    if (!AJL.Package) {
        AJL.Package = function (name, assets, params) {
            this.name = name;
            this.assets = assets;
            this.config = new AJL.PackageConfig(params);
            return this;
        };

        AJL.Package.prototype = {
            getName: function () {
                return this.name;
            },
            setName: function (name) {
                this.name = name;
            },
            getAssets: function () {
                return this.assets;
            },
            setAssets: function (assets) {
                this.assets = assets;
            },
            getConfig: function () {
                return this.config;
            },
            setConfig: function (config) {
                this.config = config;
            },
            load: function () {
                AJL.Loader.loadPackage.call(this);
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});