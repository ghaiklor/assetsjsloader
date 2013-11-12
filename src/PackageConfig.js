var AJL = (function (window, document, AJL) {
    if (!AJL.PackageConfig) {
        AJL.PackageConfig = function (params) {
            var helper = AJL.Helper,
                dependArray,
                options = {
                    async: true,
                    lazy: false,
                    depend: [],
                    dependMap: [],
                    scriptTypeAttr: 'text/javascript',
                    linkCssTypeAttr: 'text/css',
                    linkCssRelAttr: 'stylesheet'
                };

            this.options = helper.extend(options, params);
            //If dependencies not empty then build depend-map
            dependArray = this.getItem('depend');
            if (!helper.isEmpty(dependArray)) {
                this.setItem('dependMap', buildDependMap(dependArray));
            }

            return this;
        };
        AJL.PackageConfig.prototype = {
            getItem: function (key) {
                var options = this.options;
                if (options.hasOwnProperty(key)) {
                    return options[key];
                } else {
                    return null;
                }
            },
            setItem: function (key, value) {
                var options = this.options;
                options[key] = value;
                return this;
            }
        };

        function buildDependMap(packagesNameArray) {
            var resultDependMap = [],
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
            return resultDependMap;
        }
    }
    return AJL;
})(window, document, window.AJL || {});