/*! AssetsJSLoader - v0.1.0 - 2013-10-24
* http://ghaiklor.github.io/assetsjsloader/
* Copyright (c) 2013 Eugene Obrezkov; Licensed MIT */
var AJL = function (window, document, AJL) {
    if (!AJL.Environment) {
        /**
         * Object of Environment
         * @returns {AJL.Environment}
         * @constructor
         */
        AJL.Environment = function () {
            return this;
        };
        AJL.Environment.prototype = {
            constructor: AJL.Environment
        };
    }
    return AJL;
}(window, document, window.AJL || {});
var AJL = function (window, document, AJL) {
    if (!AJL.Loader) {
        /**
         * Loader of Assets
         * @returns {AJL.Loader}
         * @constructor
         */
        AJL.Loader = function () {
            return this;
        };
        AJL.Loader.prototype = {
            constructor: AJL.Loader
        }
    }
    return AJL;
}(window, document, window.AJL || {});