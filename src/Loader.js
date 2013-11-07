var AJL = (function Loader(window, document, AJL) {
    if (typeof AJL.Loader !== 'object') {
        AJL.Loader = {
            /**
             * Generate script tag and insert into head
             * @param {string} src URL to script file
             * @this {AJL.PackageConfig}
             * @returns {boolean} True if successful
             */
            appendScriptTag: function (src) {
                var tag = document.createElement('script');
                var config = this;
                tag.type = config.getItem('scriptTypeAttr');
                tag.async = config.getItem('async');
                tag.src = src;
                appendToHead(tag);
                return true;
            },
            /**
             * Generate link tag and insert into head
             * @param {string} src URL to link file
             * @this {AJL.PackageConfig}
             * @returns {boolean} True if successful
             */
            appendLinkTag: function (src) {
                var tag = document.createElement('link');
                var config = this;
                tag.rel = config.getItem('linkCssRelAttr');
                tag.type = config.getItem('linkCssTypeAttr');
                tag.href = src;
                appendToHead(tag);
                return true;
            }
        };
        /**
         * Append Element to head
         * @param {Element} element Element which need to append
         * @returns {boolean}
         */
        function appendToHead(element) {
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(element);
            return true;
        }
    }
    return AJL;
})(window, document, window.AJL || {});