var AJL = (function Helper(window, document, AJL) {
    if (!AJL.Helper) {
        /**
         * Creating Helper object
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @returns {AJL.Helper}
         * @constructor
         */
        AJL.Helper = function () {
            /**
             * @property {Array} cssFiles Array of css-extensions
             * @type {Array}
             */
            this.cssFiles = ['css'];
            /**
             * @property {Array} jsFiles Array of js-extensions
             * @type {Array}
             */
            this.jsFiles = ['js'];
            return this;
        };
        AJL.Helper.prototype = {
            /**
             * Extend object
             * @param {object|collection} dest Destination object
             * @param {object|collection} src Source object
             * @returns {object|collection} Resulting object
             */
            extend: function (dest, src) {
                for (var item in src) {
                    if (src.hasOwnProperty(item)) {
                        dest[item] = src[item];
                    }
                }
                return dest;
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
            },
            /**
             * Attach event to object
             * @param {*} obj Object on which need attach event
             * @param {string} type Type of event
             * @param {function} fn Function of event
             */
            attachEvent: function (obj, type, fn) {
                if (obj.attachEvent) {
                    obj['e' + type + fn] = fn;
                    obj[type + fn] = function () {
                        obj['e' + type + fn](window.event);
                    };
                    obj.attachEvent('on' + type, obj[type + fn]);
                } else {
                    obj.addEventListener(type, fn, false);
                }
            },
            /**
             * Detach event from object
             * @param {*} obj Object where event assignee
             * @param {string} type Type of event
             * @param {function} fn Function of event
             */
            detachEvent: function (obj, type, fn) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, fn, false);
                } else {
                    obj.detachEvent('on' + type, obj[type + fn]);
                    obj[type + fn] = null;
                    obj['e' + type + fn] = null;
                }
            }
        };
        AJL.Helper = new AJL.Helper();
    }
    return AJL;
})(window, document, window.AJL || {});