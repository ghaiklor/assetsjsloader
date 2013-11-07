var AJL = (function PackageManager(window, document, AJL) {
    if (typeof AJL.PackageManager !== 'object') {
        var packages = {};

        AJL.PackageManager = {
            /**
             * Get package from AJL
             * @param {string} name Name of package
             * @returns {boolean|AJL.Package} Package if successful and false if not
             */
            getPackage: function (name) {
                if (packages.hasOwnProperty(name)) {
                    return packages[name];
                }
                return false;
            },
            /**
             *
             * @param names
             * @returns {Array}
             */
            getPackages: function (names) {
                var result = [],
                    namesLength,
                    i;

                namesLength = names.length;
                for (i = 0; i < namesLength; i++) {
                    if (packages.hasOwnProperty(names[i])) {
                        result.push(packages[names[i]]);
                    }
                }
                return result;
            },
            /**
             * Add package to PackageManager or rewrite exists
             * @param {AJL.Package} pack Package what need to add
             * @returns {boolean} True if successful
             */
            setPackage: function (pack) {
                var helper = AJL.Helper;
                if (!helper.isEmpty(pack.name)) {
                    packages[pack.name] = pack;
                    return true;
                }
                return false;
            },
            //TODO: think about setPackages function
            /**
             * Load all packages in AJL
             */
            loadAll: function () {
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
                if (packages.hasOwnProperty(name)) {
                    packages[name].load();
                    return true;
                }
                return false;
            },
            /**
             *
             * @param names
             */
            loadByNames: function (names) {
                var i,
                    namesLength;

                namesLength = names.length;
                for (i = 0; i < namesLength; i++) {
                    if (packages.hasOwnProperty(names[i])) {
                        packages[names[i]].load();
                    }
                }
                return this;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});