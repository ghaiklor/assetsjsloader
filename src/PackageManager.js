var AJL = (function (window, document, AJL) {
    if (!AJL.PackageManager) {
        var packages = [];

        AJL.PackageManager = {
            /**
             * Get package from AJL
             * @param {string} name Name of package
             * @returns {boolean|Package} Package if successful and false if not
             */
            getPackage: function (name) {
                var helper = AJL.Helper;

                if (packages.hasOwnProperty(name)) {
                    if (helper.isInstanceOf(packages[name], AJL.Package)) {
                        return packages[name];
                    }
                    return false;
                }
                return false;
            },
            /**
             *
             * @param names
             * @returns {Array}
             */
            getPackages: function (names) {
                var helper = AJL.Helper,
                    result = [],
                    namesLength,
                    i;

                namesLength = names.length;
                for (i = 0; i < namesLength; i++) {
                    if (packages.hasOwnProperty(names[i])) {
                        if (helper.isInstanceOf(packages[names[i]], AJL.Package)) {
                            result.push(packages[names[i]]);
                        }
                    }
                }
                return result;
            },
            /**
             * Add package to PackageManager or rewrite exists
             * @param {Package} pack Package what need to add
             * @returns {boolean|PackageManager} True if successful
             */
            setPackage: function (pack) {
                var helper = AJL.Helper;
                if (!helper.isEmpty(pack.name) && helper.isInstanceOf(pack, AJL.Package)) {
                    packages[pack.name] = pack;
                    return this;
                }
                return false;
            },
            /**
             * Set packages to PackageManager
             * @param packs
             * @returns {PackageManager}
             */
            setPackages: function (packs) {
                var helper = AJL.Helper,
                    pack;

                for (pack in packs) {
                    if (packs.hasOwnProperty(pack)) {
                        if (helper.isInstanceOf(packs[pack], AJL.Package)) {
                            packages[pack[packs].name] = pack;
                        }
                    }
                }
                return this;
            },
            /**
             * Load all packages in AJL
             * @return {PackageManager}
             */
            loadAll: function () {
                var helper = AJL.Helper;

                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack)) {
                        if (helper.isInstanceOf(packages[pack], AJL.Package)) {
                            packages[pack].load();
                        }
                    }
                }
                return this;
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean|PackageManager} True if loaded
             */
            loadByName: function (name) {
                var helper = AJL.Helper;

                if (packages.hasOwnProperty(name) && helper.isInstanceOf(packages[name], AJL.Package)) {
                    packages[name].load();
                    return this;
                }
                return false;
            },
            /**
             * Load packages by their names
             * @param names
             */
            loadByNames: function (names) {
                var helper = AJL.Helper,
                    i,
                    namesLength;

                namesLength = names.length;
                for (i = 0; i < namesLength; i++) {
                    if (packages.hasOwnProperty(names[i]) && helper.isInstanceOf(packages[names[i]], AJL.Package)) {
                        packages[names[i]].load();
                    }
                }
                return this;
            }
        }
    }
    return AJL;
})(window, document, window.AJL || {});