var AJL = (function Loader(window, document, AJL) {
    if (!AJL.Loader) {
        /**
         * Creating Loader object
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @returns {AJL.Loader}
         * @constructor
         */
        AJL.Loader = function () {
            return this;
        };
        AJL.Loader.prototype = {
            /**
             * Append Element to head
             * @param {Element} element Element which need to append
             * @returns {AJL.Loader}
             */
            appendToHead: function (element) {
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(element);
                return this;
            },
            /**
             * Generate script tag and insert into head
             * @param {string} src URL to script file
             * @this {AJL.Config}
             * @returns {boolean} True if successful
             */
            appendScriptTag: function (src) {
                var tag = document.createElement('script');
                var config = this;
                tag.type = config.getItem('scriptTypeAttr');
                tag.async = config.getItem('async');
                tag.src = src;
                AJL.Loader.appendToHead(tag);
                return true;
            },
            /**
             * Generate link tag and insert into head
             * @param {string} src URL to link file
             * @this {AJL.Config}
             * @returns {boolean} True if successful
             */
            appendLinkTag: function (src) {
                var tag = document.createElement('link');
                var config = this;
                tag.rel = config.getItem('linkCssRelAttr');
                tag.type = config.getItem('linkCssTypeAttr');
                tag.href = src;
                AJL.Loader.appendToHead(tag);
                return true;
            }
        };
        AJL.Loader = new AJL.Loader();
    }
    return AJL;
})(window, document, window.AJL || {});