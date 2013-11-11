var AJL = (function (window, document, AJL) {
    if (!AJL.Package) {
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
             * @type {PackageConfig}
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
             * @returns {AJL.Package|boolean} True if Package successful loaded
             */
            load: function () {
                var helper = AJL.Helper,
                    self = this,
                    config = self.config,
                    assets = self.assets;
                //If assets array empty then halt loading of package
                //TODO: make right checking of loaded package
                if (helper.isEmpty(assets)) {
                    return false;
                }
                //If this package depend with other package than load dependencies first
                if (!AJL.Helper.isEmpty(config.getItem('dependMap'))) {
                    loadDependencies.call(config);
                }
                //If need to wait window.load than call lazyLoad and return
                if (config.getItem('lazy') == true) {
                    lazyLoad.call(this);
                    return this;
                }
                //In other cases just call initLoader directly for start loading
                initLoader.call(this);
                return this;
            },
            /**
             * Check if package already loaded
             * @returns {boolean}
             */
            isLoaded: function () {
                var self = this;
                return self.loaded;
            }
        };
        /**
         * Lazy loading of package.
         * This method attachEvent window.onload by {AJL.Helper.attachEvent}
         * @this {Package}
         */
        function lazyLoad() {
            var helper = AJL.Helper,
                pack = this;
            helper.attachEvent(window, 'load', function () {
                console.debug("Lazy");
                initLoader.call(pack);
            });
        }

        /**
         * Init generating and append tags into head.
         * Call methods from {AJL.Loader}
         * @this {Package}
         */
        function initLoader() {
            var pack = this,
                assets = pack.assets,
                config = pack.config,
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
            onPackageLoad();
        }

        /**
         * Load dependencies of current package
         * @this {AJL.PackageConfig}
         */
        function loadDependencies() {
            //TODO: make loading dependencies
            var config = this;
        }

        /**
         * Trigger when package fully loaded into DOM
         */
        function onPackageLoad() {
            //TODO: make working loaded status of package
            this.loaded = true;
        }
    }
    return AJL;
})(window, document, window.AJL || {});