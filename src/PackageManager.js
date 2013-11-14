var AJL = (function (window, document, AJL) {
    if (!AJL.PackageManager) {
        var packages = [];

        /**
         * @namespace AJL.PackageManager
         */
        AJL.PackageManager = {
            /**
             * Get package from AJL
             * @param {String} name Name of package
             * @returns {Boolean|AJL.Package} Package if successful and false if not
             * @example
             * AJL.PackageManager.getPackage('My Package Name');
             */
            getPackage: function (name) {
                var helper = AJL.Helper;

                if (packages.hasOwnProperty(name) && helper.isInstanceOf(packages[name], AJL.Package)) {
                    return packages[name];
                }

                return false;
            },
            /**
             * Get packages from AJL
             * @param {Array} names Array of Package's names which need get
             * @returns {Array}
             * @example
             * AJL.PackageManager.getPackages([
             *          'First Package Name',
             *          'Second Package Name'
             *      ]);
             */
            getPackages: function (names) {
                var self = this,
                    packageArray = [],
                    curName,
                    curPackage,
                    namesLength = names.length,
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
             * @returns {boolean|AJL.PackageManager} False if not successful and PackageManager if successful
             * @example
             * AJL.PackageManager.setPackage(
             *      new AJL.Package('New Package', [
             *              'foo.js',
             *              'bar.js',
             *              'style.css',
             *          ], {
             *              async: false,
             *              lazy: true,
             *              depend: ['Some other Package Name']
             *          })
             *      );
             */
            setPackage: function (pack) {
                var helper = AJL.Helper,
                    packName;

                if (helper.isInstanceOf(pack, AJL.Package)) {
                    packName = pack.getName();
                    if (!helper.isEmpty(packName)) {
                        packages[packName] = pack;
                        return this;
                    }
                }

                return false;
            },
            /**
             * Add Packages to PackageManager or rewrite exists
             * @param {Array} packs Array of AJL.Package objects
             * @returns {AJL.PackageManager}
             * @example
             * var FooPackage = new AJL.Package('Foo', ['foo.js', 'foo2.js']);
             * var BarPackage = new AJL.Package('Bar', ['bar.js', 'bar2.js'], {
             *      async: false,
             *      depend: ['Foo']
             * });
             * AJL.PackageManager.setPackages([FooPackage, BarPackage]);
             */
            setPackages: function (packs) {
                var self = this,
                    helper = AJL.Helper,
                    curPack,
                    packsLength = packs.length,
                    i;

                for (i = 0; i < packsLength; i++) {
                    curPack = packs[i];
                    if (helper.isInstanceOf(curPack, AJL.Package)) {
                        self.setPackage(curPack);
                    }
                }
                return this;
            },
            /**
             * Load all packages in AJL
             * @return {AJL.PackageManager}
             * @example
             * AJL.PackageManager.loadAll();
             */
            loadAll: function () {
                var helper = AJL.Helper,
                    curPack;

                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack)) {
                        curPack = packages[pack];
                        if (helper.isInstanceOf(curPack, AJL.Package)) {
                            curPack.load();
                        }
                    }
                }
                return this;
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean|AJL.PackageManager} PackageManager if loaded and false if not
             * @example
             * AJL.PackageManager.loadByName('Own Package Name');
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
             * Load packages by names
             * @param {Array} names Array of Package's names to load
             * @returns {AJL.PackageManager}
             * @example
             * AJL.PackageManager.loadByNames([
             *      'First Package Name',
             *      'Second Package Name'
             * ]);
             */
            loadByNames: function (names) {
                var helper = AJL.Helper,
                    curName,
                    namesLength,
                    i;

                namesLength = names.length;
                for (i = 0; i < namesLength; i++) {
                    curName = names[i];
                    if (packages.hasOwnProperty(curName) && helper.isInstanceOf(packages[curName], AJL.Package)) {
                        packages[curName].load();
                    }
                }
                return this;
            }
        }
    }
    return AJL;
})(window, document, window.AJL || {});