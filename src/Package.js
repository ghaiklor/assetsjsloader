var AJL = (function Package(window, document, AJL) {
    if (!AJL.Package) {
        /**
         * Creating new Package
         * @param {string} name Name of Package
         * @param {(collection|object)} [assets] Collection of assets URL for loading
         * @param {object} [params] Parameters for extend default config
         * @returns {AJL.Package}
         * @constructor
         */
        AJL.Package = function (name, assets, params) {
            this.name = name;
            this.assets = assets;
            this.config = new AJL.Config(params);
            return this;
        };
        AJL.Package.prototype = {
            /**
             * Load Package and Assets Files from this Package
             * @returns {boolean} True if Package successful loaded
             */
            load: function () {
                //TODO: think how refactor this
                var self = this,
                    config = self.config,
                    assets = self.assets,
                    currentUrl = '';
                if (AJL.Helper.isEmpty(assets)) {
                    return false;
                }
                for (var url in assets) {
                    if (assets.hasOwnProperty(url)) {
                        currentUrl = assets[url];
                        if (AJL.Helper.isScriptFile(currentUrl)) {
                            AJL.Loader.appendScriptTag(currentUrl);
                            continue;
                        }
                        if (AJL.Helper.isCssFile(currentUrl)) {
                            AJL.Loader.appendLinkTag(currentUrl);
                        }
                    }
                }
                return true;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});