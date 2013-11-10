var AJL = (function (window, document, AJL) {
    if (!AJL.Loader) {
        AJL.Loader = {
            /**
             * Generate script tag and insert into head
             * @param {string} src URL to script file
             * @this {PackageConfig}
             * @returns {boolean} True if successful
             */
            appendScriptTag: function (src) {
                var tag = document.createElement('script'),
                    config = this;
                tag.type = AJL.Helper.isUndefined(config.getItem) ? 'text/javascript' : config.getItem('scriptTypeAttr');
                tag.async = AJL.Helper.isUndefined(config.getItem) ? true : config.getItem('async');
                tag.src = src;
                appendToHead(tag);
                return true;
            },
            /**
             * Generate link tag and insert into head
             * @param {string} src URL to link file
             * @this {PackageConfig}
             * @returns {boolean} True if successful
             */
            appendLinkTag: function (src) {
                var tag = document.createElement('link'),
                    config = this;
                tag.rel = AJL.Helper.isUndefined(config.getItem) ? 'stylesheet' : config.getItem('linkCssRelAttr');
                tag.type = AJL.Helper.isUndefined(config.getItem) ? 'text/css' : config.getItem('linkCssTypeAttr');
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