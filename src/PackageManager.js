var AJL = (function PackageManager(window, document, AJL) {
    if (!AJL.PackageManager) {
        /**
         * Package's Manager of AJL
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @returns {AJL.PackageManager}
         * @constructor
         */
        AJL.PackageManager = function () {
            /**
             * @property packages Object of packages in AJL
             * @type {object}
             */
            this.packages = {};
            return this;
        };
        AJL.PackageManager.prototype = {
            /**
             * Get package from AJL
             * @param {string} name Name of package
             * @returns {boolean|AJL.Package} Package if successful and false if not
             */
            getPackage: function (name) {
                var packages = this.packages;
                if (packages.hasOwnProperty(name)) {
                    return packages[name];
                }
                return false;
            },
            /**
             * Add package to PackageManager or rewrite exists
             * @param {AJL.Package} pack Package what need to add
             * @returns {boolean} True if successful
             */
            setPackage: function (pack) {
                var packages = this.packages;
                if (!AJL.Helper.isEmpty(pack.name)) {
                    packages[pack.name] = pack;
                    return true;
                }
                return false;
            },
            /**
             * Load all packages in AJL
             */
            loadAll: function () {
                var packages = this.packages;
                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack)) {
                        packages[pack].load();
                    }
                }
            }
        };
        AJL.PackageManager = new AJL.PackageManager();
    }
    return AJL;
})(window, document, window.AJL || {});