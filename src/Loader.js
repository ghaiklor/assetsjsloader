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
                //TODO: make loading params from package config
                var tag = document.createElement('script');
                tag.type = 'text/javascript';
                tag.async = true;
                tag.src = src;
                this.appendToHead(tag);
                return true;
            },
            /**
             * Generate link tag and insert into head
             * @param {string} src URL to link file
             * @returns {boolean} True if successful
             */
            appendLinkTag: function (src) {
                var tag = document.createElement('link');
                tag.rel = 'stylesheet';
                tag.type = 'text/css';
                tag.href = src;
                this.appendToHead(tag);
                return true;
            }
        };
        AJL.Loader = new AJL.Loader();
    }
    return AJL;
})(window, document, window.AJL || {});