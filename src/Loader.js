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