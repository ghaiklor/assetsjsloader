var AJL = (function Package(window, document, AJL) {
    if (typeof AJL.Package !== 'function') {
        /**
         * Creating new Package
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @param {string} name Name of Package
         * @param {collection|object} assets Collection of assets URL for loading
         * @param {object} [params] Parameters for extend default config
         * @returns {AJL.Package}
         * @constructor
         */
        AJL.Package = function (name, assets, params) {
            /**
             * @property name Name of Package
             * @type {string}
             */
            this.name = name;
            /**
             * @property assets Collections of asset's URLs
             * @type {collection|Object}
             */
            this.assets = assets;
            /**
             * @property config Configuration object of this Package
             * @type {AJL.PackageConfig}
             */
            this.config = new AJL.PackageConfig(params);
            /**
             * @property loaded Is this package already loaded?
             * @type {boolean}
             */
            this.loaded = false;
            return this;
        };
        AJL.Package.prototype = {
            /**
             * Load Package and Assets Files from this Package
             * @returns {boolean|AJL.Package} True if Package successful loaded
             */
            load: function () {
                var self = this,
                    config = self.config,
                    assets = self.assets,
                    helper = AJL.Helper;
                //If assets array empty then halt loading of package
                if (helper.isEmpty(assets) || self.isLoaded()) {
                    return false;
                }
                //If need to wait window.load than call lazyLoad and return
                if (config.getItem('lazy') == true) {
                    lazyLoad();
                    return this;
                }
                //In other cases just call initLoader directly for start loading
                initLoader();
                return this;
            },
            /**
             * Check if package already loaded
             * @returns {boolean}
             */
            isLoaded: function () {
                var self = this;
                return self.loaded;
            },
            /**
             * Trigger when package fully loaded into DOM
             */
            onPackageLoad: function () {
                this.loaded = true;
            }
        };
        /**
         * Lazy loading of package.
         * This method attachEvent window.onload by {AJL.Helper.attachEvent}
         */
        function lazyLoad() {
            var helper = AJL.Helper;
            helper.attachEvent(window, 'load', function () {
                initLoader();
            });
        }

        /**
         * Init generating and append tags into head.
         * Call methods from {AJL.Loader}
         */
        function initLoader() {
            var self = this,
                assets = self.assets,
                config = self.config,
                currentUrl = '';
            for (var url in assets) {
                if (assets.hasOwnProperty(url)) {
                    currentUrl = assets[url];
                    if (AJL.Helper.isScriptFile(currentUrl)) {
                        //We need use call 'cause Loader must execute in context of current package's config
                        AJL.Loader.appendScriptTag.call(config, currentUrl);
                        continue;
                    }
                    if (AJL.Helper.isCssFile(currentUrl)) {
                        //We need use call 'cause Loader must execute in context of current package's config
                        AJL.Loader.appendLinkTag.call(config, currentUrl);
                    }
                }
            }
            //TODO: replace it into tag callback
            //self.onPackageLoad();
        }
    }
    return AJL;
})(window, document, window.AJL || {});