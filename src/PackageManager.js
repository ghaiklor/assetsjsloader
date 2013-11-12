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

                if (packages.hasOwnProperty(name) && helper.isInstanceOf(packages[name], AJL.Package)) {
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
                var self = this,
                    packageArray = [],
                    namesLength = names.length,
                    curName,
                    curPackage,
                    i;

                for (i = 0; i < namesLength; i++) {
                    curName = names[i];
                    curPackage = self.getPackage(curName);
                    if (curPackage) {
                        packageArray.push(curPackage);
                    }
                }

                return packageArray;
            },
            /**
             * Add package to PackageManager or rewrite exists
             * @param {AJL.Package} pack Package what need to add
             * @returns {boolean|AJL.PackageManager} True if successful
             */
            setPackage: function (pack) {
                var helper = AJL.Helper,
                    packName;

                packName = pack.getName();
                if (!helper.isEmpty(packName) && helper.isInstanceOf(pack, AJL.Package)) {
                    packages[packName] = pack;

                    return this;
                }

                return false;
            },
            /**
             * Set packages to PackageManager
             * @param packs
             * @returns {AJL.PackageManager}
             */
            setPackages: function (packs) {
                var self = this,
                    helper = AJL.Helper,
                    curPack,
                    item;

                for (item in packs) {
                    if (packs.hasOwnProperty(item) && helper.isInstanceOf(packs[item], AJL.Package)) {
                        curPack = packs[item];
                        self.setPackage(curPack);
                    }
                }
                return this;
            },
            /**
             * Load all packages in AJL
             * @return {AJL.PackageManager}
             */
            loadAll: function () {
                var helper = AJL.Helper;

                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack) && helper.isInstanceOf(packages[pack], AJL.Package)) {
                        packages[pack].load();
                    }
                }
                return this;
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean|AJL.PackageManager} True if loaded
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