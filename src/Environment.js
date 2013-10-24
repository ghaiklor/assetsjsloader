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