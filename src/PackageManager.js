var AJL = (function PackageManager(window, document, AJL) {
    if (!AJL.PackageManager) {
        AJL.PackageManager = {
            /**
             * @property packages Object of packages in AJL
             * @type {object}
             */
            _packages: {},
            /**
             * Get package from AJL
             * @param {string} name Name of package
             * @returns {boolean|AJL.Package} Package if successful and false if not
             */
            getPackage: function (name) {
                var packages = this._packages;
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
                var packages = this._packages;
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
                var packages = this._packages;
                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack)) {
                        packages[pack].load();
                    }
                }
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean} True if loaded
             */
            loadByName: function (name) {
                var packages = this._packages;
                if (packages.hasOwnProperty(name)) {
                    packages[name].load();
                    return true;
                }
                return false;
            },
            /**
             * Delete all packages from PackageManager
             */
            deleteAll: function () {
                this._packages = {};
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});