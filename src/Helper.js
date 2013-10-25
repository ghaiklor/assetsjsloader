var AJL = (function Helper(window, document, AJL) {
    if (!AJL.Helper) {
        /**
         * Creating Helper object
         * @returns {AJL.Helper}
         * @constructor
         */
        AJL.Helper = function () {
            this.cssFiles = ['css'];
            this.jsFiles = ['js'];
            return this;
        };
        AJL.Helper.prototype = {
            /**
             * Extend object
             * @param {object} obj Object which need to extend
             */
            extend: function (obj) {
                //TODO: implement this
            },
            /**
             * Get extension of filename
             * @param {string} fileName Filename from we need get extension
             * @returns {string} Extension of file
             */
            getExtension: function (fileName) {
                return fileName.split('.').pop();
            },
            /**
             * Check if this file have js-extensions
             * @param {string} url URL of file that need to check
             * @returns {boolean} True if is script file
             */
            isScriptFile: function (url) {
                return this.jsFiles.indexOf(this.getExtension(url)) != -1;
            },
            /**
             * Check if this file have css-extensions
             * @param {string} url URL of file that need to check
             * @returns {boolean} True if is css file
             */
            isCssFile: function (url) {
                return this.cssFiles.indexOf(this.getExtension(url)) != -1;
            },
            /**
             * Check variable for empty
             * @param {*} param Variable that need to check
             * @returns {boolean} True if empty
             */
            isEmpty: function (param) {
                return param == undefined || param == null || param == '' || param.length == 0;
            },
            /**
             * Check variable for undefined or null
             * @param {*} param Variable that need to check
             * @returns {boolean} True if undefined or null
             */
            isUndefined: function (param) {
                return param == undefined || param == null;
            }
        };
        AJL.Helper = new AJL.Helper();
    }
    return AJL;
})(window, document, window.AJL || {});