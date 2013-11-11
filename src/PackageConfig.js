var AJL = (function (window, document, AJL) {
    if (!AJL.PackageConfig) {
        /**
         * Creating new Configuration object for {AJL.Package}
         * @param {collection|object} params Parameters for extend default configuration
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @returns {AJL.PackageConfig}
         * @constructor
         */
        AJL.PackageConfig = function (params) {
            /**
             * @property {object} options
             * @property {boolean} options.async Asynchronous loading of package
             * @property {boolean} options.lazy Lazy loading (load package on window.load)
             * @property {string} options.scriptTypeAttr type-attr for script-tag
             * @property {string} options.linkCssTypeAttr type-attr for link-tag of css
             * @property {string} options.linkCssRelAttr rel-attr for link-tag of css
             */
            var helper = AJL.Helper,
                options = {
                    async: true,
                    lazy: false,
                    depend: [],
                    dependMap: [],
                    scriptTypeAttr: 'text/javascript',
                    linkCssTypeAttr: 'text/css',
                    linkCssRelAttr: 'stylesheet'
                },
                dependArray;
            this.options = helper.extend(options, params);

            //If dependencies not empty then build depend-map
            dependArray = this.getItem('depend');
            if (!AJL.Helper.isEmpty(dependArray)) {
                buildDependMap.call(this, dependArray);
            }

            return this;
        };
        AJL.PackageConfig.prototype = {
            /**
             * Return value from config storage by key
             * @param {string} key Key in storage
             * @returns {*|null} Value if success and null if not
             */
            getItem: function (key) {
                var options = this.options;
                if (options.hasOwnProperty(key)) {
                    return options[key];
                } else {
                    return null;
                }
            },
            /**
             * Set item in config storage
             * @param {string} key Key in storage
             * @param {*} value Value what need to write
             * @returns {PackageConfig}
             */
            setItem: function (key, value) {
                var options = this.options;
                options[key] = value;
                return this;
            },
            /**
             * Set current config variables from object
             * @param {object} param Object which need set
             * @returns {PackageConfig}
             */
            setConfigFromObject: function (param) {
                var options = this.options;
                for (var item in param) {
                    if (param.hasOwnProperty(item)) {
                        options[item] = param[item];
                    }
                }
                return this;
            }
        };

        /**
         * Build dependencies map for this package
         * @this {AJL.PackageConfig}
         * @param packagesNameArray Array of packages name
         */
        function buildDependMap(packagesNameArray) {
            var config = this,
                resultDependMap = [],
                curPack,
                curAsset,
                indexPackage,
                indexAssets;

            //Loop through all packageNames
            for (indexPackage in packagesNameArray) {
                if (packagesNameArray.hasOwnProperty(indexPackage)) {
                    //Get Package Object for current packageName
                    curPack = AJL.PackageManager.getPackage(packagesNameArray[indexPackage]);
                    for (indexAssets = 0; indexAssets < curPack.assets.length; indexAssets++) {
                        //Loop through all assets in currently selected package
                        curAsset = curPack.assets[indexAssets];
                        //If this asset already exists in dependency map then don't add it into map
                        if (AJL.Helper.isExistsInArray(curAsset, resultDependMap)) {
                            continue;
                        }
                        //In other case add this asset into resulting map array
                        resultDependMap.push(curPack.assets[indexAssets]);
                    }
                }
            }
            //And finally set generated dependency map to config of current package
            config.setItem('dependMap', resultDependMap);
        }
    }
    return AJL;
})(window, document, window.AJL || {});