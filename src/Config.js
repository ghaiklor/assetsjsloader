var AJL = (function Config(window, document, AJL) {
    if (!AJL.Config) {
        /**
         * Creating new Configuration object
         * @param {(collection|object)} params Parameters for extend default configuration
         * @returns {AJL.Config}
         * @constructor
         */
        AJL.Config = function (params) {
            /**
             * Load asynchronous or not
             * @type {boolean}
             */
            this.async = true;
            /**
             * Lazy loading or not
             * @type {boolean}
             */
            this.lazy = false;
            /**
             * Type attribute in script tag
             * @type {string}
             */
            this.scriptTypeAttr = 'text/javascript';
            /**
             * Type attribute in link tag for css-file
             * @type {string}
             */
            this.linkCssTypeAttr = 'text/css';
            /**
             * Rel attribute in link tag for css-file
             * @type {string}
             */
            this.linkCssRelAttr = 'stylesheet';
            AJL.Helper.extend(this, params);
            return this;
        };
        AJL.Config.prototype = {
            /**
             * Return value from config storage by key
             * @param {string} key Key in storage
             * @returns {*|null} Value if success and null if not
             */
            getItem: function (key) {
                if (this.hasOwnProperty(key)) {
                    return this[key];
                } else {
                    return null;
                }
            },
            /**
             * Set item in config storage
             * @param {string} key Key in storage
             * @param {*} value Value what need to write
             * @returns {*|boolean} - old value if exists and true if successful
             */
            setItem: function (key, value) {
                var oldVariable = null;
                if (this.hasOwnProperty(key)) {
                    oldVariable = this[key];
                    this[key] = value;
                    return oldVariable;
                }
                this[key] = value;
                return true;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});