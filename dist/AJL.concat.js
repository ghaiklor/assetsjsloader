/*! AssetsJSLoader - v0.1.0 - 2013-10-30
* http://ghaiklor.github.io/assetsjsloader/
* Copyright (c) 2013 Eugene Obrezkov; Licensed MIT */
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
var AJL = (function Helper(window, document, AJL) {
    if (!AJL.Helper) {
        /**
         * Creating Helper object
         * @returns {AJL.Helper}
         * @constructor
         */
        AJL.Helper = function () {
            this.cssFiles = ['css'];
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
            }
        };
        AJL.Helper = new AJL.Helper();
    }
    return AJL;
})(window, document, window.AJL || {});
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
                //TODO: make loading params from package config
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
var AJL = (function Package(window, document, AJL) {
    if (!AJL.Package) {
        /**
         * Creating new Package
         * @param {string} name Name of Package
         * @param {(collection|object)} [assets] Collection of assets URL for loading
         * @param {object} [params] Parameters for extend default config
         * @returns {AJL.Package}
         * @constructor
         */
        AJL.Package = function (name, assets, params) {
            this.name = name;
            this.assets = assets;
            this.config = new AJL.Config(params);
            return this;
        };
        AJL.Package.prototype = {
            /**
             * Load Package and Assets Files from this Package
             * @returns {boolean} True if Package successful loaded
             */
            load: function () {
                //TODO: think how refactor this
                var self = this,
                    config = self.config,
                    assets = self.assets,
                    currentUrl = '';
                if (AJL.Helper.isEmpty(assets)) {
                    return false;
                }
                for (var url in assets) {
                    if (assets.hasOwnProperty(url)) {
                        currentUrl = assets[url];
                        if (AJL.Helper.isScriptFile(currentUrl)) {
                            AJL.Loader.appendScriptTag(currentUrl);
                            continue;
                        }
                        if (AJL.Helper.isCssFile(currentUrl)) {
                            AJL.Loader.appendLinkTag(currentUrl);
                        }
                    }
                }
                return true;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});