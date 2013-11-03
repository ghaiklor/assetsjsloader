var AJL = (function Config(window, document, AJL) {
    if (!AJL.Config) {
        /**
         * Creating new Configuration object for {AJL.Package}
         * @param {collection|object} params Parameters for extend default configuration
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @returns {AJL.Config}
         * @constructor
         */
        AJL.Config = function (params) {
            /**
             * @property {object} options
             * @property {boolean} options.async Asynchronous loading of package
             * @property {boolean} options.lazy Lazy loading (load package on window.load)
             * @property {string} options.scriptTypeAttr type-attr for script-tag
             * @property {string} options.linkCssTypeAttr type-attr for link-tag of css
             * @property {string} options.linkCssRelAttr rel-attr for link-tag of css
             */
            var options = {
                async: true,
                lazy: false,
                scriptTypeAttr: 'text/javascript',
                linkCssTypeAttr: 'text/css',
                linkCssRelAttr: 'stylesheet'
            };
            this.options = AJL.Helper.extend(options, params);
            return this;
        };
        AJL.Config.prototype = {
            /**
             * Return value from config storage by key
             * @param {string} key Key in storage
             * @returns {*|null} Value if success and null if not
             */
            getItem: function (key) {
                var options = this.options;
                if (options.hasOwnProperty(key)) {
                    return options[key];
                } else {
                    return null;
                }
            },
            /**
             * Set item in config storage
             * @param {string} key Key in storage
             * @param {*} value Value what need to write
             * @returns {AJL.Config}
             */
            setItem: function (key, value) {
                var options = this.options;
                options[key] = value;
                return this;
            },
            /**
             * Set current config variables from object
             * @param {object} param Object which need set
             * @returns {AJL.Config}
             */
            setConfigFromObject: function (param) {
                var options = this.options;
                for (var item in param) {
                    if (param.hasOwnProperty(item)) {
                        options[item] = param[item];
                    }
                }
                return this;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});