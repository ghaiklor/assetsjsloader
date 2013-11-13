var AJL = (function (window, document, AJL) {
    if (!AJL.Package) {
        /**
         * Create Package
         * @param {String} name Name of package
         * @param {Array} assets Array of assets that need load
         * @param {Object} params Configuration object for this package
         * @returns {AJL.Package}
         * @constructor
         * @class {AJL.Package}
         * @example
         * new AJL.Package('My Own Package', [
         *          'foo.js',
         *          'bar.js',
         *          'style.css'
         *      ], {
         *          async: false,
         *          lazy: true
         *      });
         */
        AJL.Package = function (name, assets, params) {
            /**
             * Name of package
             * @type {String}
             */
            this.name = name;
            /**
             * Assets of this package
             * @type {Array}
             */
            this.assets = assets;
            /**
             * Configuration object of this package
             * @type {AJL.PackageConfig}
             */
            this.config = new AJL.PackageConfig(params);
            return this;
        };

        AJL.Package.prototype = {
            /**
             * Get name of package
             * @returns {String}
             * @example
             * myPackage.getName();
             */
            getName: function () {
                return this.name;
            },
            /**
             * Set new name for package
             * @param {String} name New name of package
             * @example
             * myPackage.setName('New name');
             */
            setName: function (name) {
                this.name = name;
            },
            /**
             * Get assets from package
             * @returns {Array}
             * @example
             * myPackage.getAssets();
             */
            getAssets: function () {
                return this.assets;
            },
            /**
             * Set new assets for package
             * @param {Array} assets New array of assets for package
             * @example
             * myPackage.setAssets([
             *          'new.js',
             *          'new2.js'
             *      ]);
             */
            setAssets: function (assets) {
                this.assets = assets;
            },
            /**
             * Get config object from package
             * @returns {AJL.PackageConfig}
             * @example
             * myPackage.getConfig();
             */
            getConfig: function () {
                return this.config;
            },
            /**
             * Set new config object for package
             * @param {AJL.PackageConfig} config New object of configuration
             * @example
             * myPackage.setConfig(
             *      new AJL.PackageConfig({
             *          lazy: true,
             *          depend: ['mySecondPackageName']
             *      }));
             */
            setConfig: function (config) {
                this.config = config;
            },
            /**
             * Start loading of package
             * @example
             * myPackage.load();
             */
            load: function () {
                AJL.Loader.loadPackage.call(this);
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});