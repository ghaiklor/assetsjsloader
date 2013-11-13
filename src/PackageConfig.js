var AJL = (function (window, document, AJL) {
    if (!AJL.PackageConfig) {
        /**
         * Create configuration object for Package
         * @param {Object} params Object with configuration
         * @param {Boolean} params.async Asynchronous loading of package or not
         * @param {Boolean} params.lazy Lazy loading of package (waiting for window loads)
         * @param {Array} params.depend Array of Package's names which need to load before load this
         * @param {String} params.scriptTypeAttr This value write in script tag in type attribute
         * @param {String} params.linkCssTypeAttr This value write in link tag in type attribute
         * @param {String} params.linkCssRelAttr This value write in link tag in rel attribute
         * @returns {AJL.PackageConfig}
         * @constructor
         * @class {AJL.PackageConfig}
         * @example
         * new AJL.PackageConfig({
         *      async: false,
         *      lazy: true,
         *      depend: ['Package One Name', 'Package Two Name']
         * });
         */
        AJL.PackageConfig = function (params) {
            var helper = AJL.Helper,
                options = {
                    async: true,
                    lazy: false,
                    depend: [],
                    scriptTypeAttr: 'text/javascript',
                    linkCssTypeAttr: 'text/css',
                    linkCssRelAttr: 'stylesheet'
                };
            /**
             * Configuration object with params
             * @type {Object}
             */
            this.options = helper.extend(options, params);
            return this;
        };
        AJL.PackageConfig.prototype = {
            /**
             * Get item from configuration storage of Package
             * @param {String} key Name of value in storage
             * @returns {*}
             * @example
             * myConfig.getItem('dependMap');
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
             * Set item in configuration storage of Package
             * @param {String} key Name of value in storage
             * @param {*} value Value of this param
             * @returns {AJL.PackageConfig}
             * @example
             * myConfig.setItem('MyOwnParam', 'Foo');
             */
            setItem: function (key, value) {
                var options = this.options;
                options[key] = value;
                return this;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});