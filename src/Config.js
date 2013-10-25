var AJL = (function Config(window, document, AJL) {
    if (!AJL.Config) {
        /**
         * Creating new Configuration object
         * @param {(collection|object)} params Parameters for extend default configuration
         * @returns {AJL.Config}
         * @constructor
         */
        AJL.Config = function (params) {
            this.async = true;
            this.scriptTypeAttr = 'text/javascript';
            this.linkCssTypeAttr = 'text/css';
            this.linkCssRelAttr = 'stylesheet';
            //TODO: make extending of objects
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