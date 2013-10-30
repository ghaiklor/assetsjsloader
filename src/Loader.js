var AJL = (function Loader(window, document, AJL) {
    if (!AJL.Loader) {
        /**
         * Creating Loader object
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
             * @returns {boolean} True if successful
             */
            appendToHead: function (element) {
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(element);
                return true;
            },
            /**
             * Generate script tag and insert into head
             * @param {string} src URL to script file
             * @returns {boolean} True if successful
             */
            appendScriptTag: function (src) {
                //IMPORTANT:
                //In this function this-context is {AJL.Package.Config}
                var tag = document.createElement('script');
                tag.type = this.getItem('scriptTypeAttr');
                tag.async = this.getItem('async');
                tag.src = src;
                AJL.Loader.appendToHead(tag);
                return true;
            },
            /**
             * Generate link tag and insert into head
             * @param {string} src URL to link file
             * @returns {boolean} True if successful
             */
            appendLinkTag: function (src) {
                //IMPORTANT:
                //In this function this-context is {AJL.Package.Config}
                var tag = document.createElement('link');
                tag.rel = this.getItem('linkCssRelAttr');
                tag.type = this.getItem('linkCssTypeAttr');
                tag.href = src;
                AJL.Loader.appendToHead(tag);
                return true;
            }
        };
        AJL.Loader = new AJL.Loader();
    }
    return AJL;
})(window, document, window.AJL || {});