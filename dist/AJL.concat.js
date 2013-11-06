/*! AssetsJSLoader - v0.1.0 - 2013-11-06
* http://ghaiklor.github.io/assetsjsloader/
* Copyright (c) 2013 Eugene Obrezkov; Licensed MIT */
var AJL = (function (window, document, AJL) {
    AJL.init = function () {
        var currentPackage = {};
        var currentArg = {};
        for (var pack in arguments) {
            if (arguments.hasOwnProperty(pack)) {
                currentArg = arguments[pack];
                currentPackage = new AJL.Package(currentArg.name, currentArg.assets, currentArg.config);
                AJL.PackageManager.setPackage(currentPackage);
            }
        }
        return AJL.PackageManager;
    };
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function Helper(window, document, AJL) {
    if (!AJL.Helper) {
        AJL.Helper = {
            /**
             * @property {Array} _linkFiles Array of link-extensions
             * @type {Array}
             */
            _linkFiles: ['css'],
            /**
             * @property {Array} _scriptFiles Array of script-extensions
             * @type {Array}
             */
            _scriptFiles: ['js'],
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
                return this._scriptFiles.indexOf(this.getExtension(url)) != -1;
            },
            /**
             * Check if this file have css-extensions
             * @param {string} url URL of file that need to check
             * @returns {boolean} True if is css file
             */
            isCssFile: function (url) {
                return this._linkFiles.indexOf(this.getExtension(url)) != -1;
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
            },
            /**
             * Attach event to object
             * @param {*} obj Object on which need attach event
             * @param {string} type Type of event
             * @param {function} fn Function of event
             */
            attachEvent: function (obj, type, fn) {
                if (obj.attachEvent) {
                    obj['e' + type + fn] = fn;
                    obj[type + fn] = function () {
                        obj['e' + type + fn](window.event);
                    };
                    obj.attachEvent('on' + type, obj[type + fn]);
                } else {
                    obj.addEventListener(type, fn, false);
                }
            },
            /**
             * Detach event from object
             * @param {*} obj Object where event assignee
             * @param {string} type Type of event
             * @param {function} fn Function of event
             */
            detachEvent: function (obj, type, fn) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, fn, false);
                } else {
                    obj.detachEvent('on' + type, obj[type + fn]);
                    obj[type + fn] = null;
                    obj['e' + type + fn] = null;
                }
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function Loader(window, document, AJL) {
    if (!AJL.Loader) {
        AJL.Loader = {
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
             * @this {AJL.PackageConfig}
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
             * @this {AJL.PackageConfig}
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
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function Package(window, document, AJL) {
    if (!AJL.Package) {
        /**
         * Creating new Package
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @param {string} name Name of Package
         * @param {collection|object} assets Collection of assets URL for loading
         * @param {object} [params] Parameters for extend default config
         * @returns {AJL.Package}
         * @constructor
         */
        AJL.Package = function (name, assets, params) {
            /**
             * @property name Name of Package
             * @type {string}
             */
            this.name = name;
            /**
             * @property assets Collections of asset's URLs
             * @type {collection|Object}
             */
            this.assets = assets;
            /**
             * @property config Configuration object of this Package
             * @type {AJL.PackageConfig}
             */
            this.config = new AJL.PackageConfig(params);
            /**
             * @property loaded Is this package already loaded?
             * @type {boolean}
             */
            this.loaded = false;
            return this;
        };
        AJL.Package.prototype = {
            /**
             * Init generating and append tags into head.
             * Call methods from {AJL.Loader}
             */
            initLoader: function () {
                var self = this,
                    assets = self.assets,
                    config = self.config,
                    currentUrl = '';
                for (var url in assets) {
                    if (assets.hasOwnProperty(url)) {
                        currentUrl = assets[url];
                        if (AJL.Helper.isScriptFile(currentUrl)) {
                            //We need use call 'cause Loader must execute in context of current package's config
                            AJL.Loader.appendScriptTag.call(config, currentUrl);
                            continue;
                        }
                        if (AJL.Helper.isCssFile(currentUrl)) {
                            //We need use call 'cause Loader must execute in context of current package's config
                            AJL.Loader.appendLinkTag.call(config, currentUrl);
                        }
                    }
                }
                //TODO: replace it into tag callback
                self.onPackageLoad();
            },
            /**
             * Load Package and Assets Files from this Package
             * @returns {boolean|AJL.Package} True if Package successful loaded
             */
            load: function () {
                var self = this,
                    config = self.config,
                    assets = self.assets;
                //If assets array empty then halt loading of package
                if (AJL.Helper.isEmpty(assets) || self.isLoaded()) {
                    return false;
                }
                //If need to wait window.load than call lazyLoad and return
                if (config.getItem('lazy') == true) {
                    self.lazyLoad();
                    return this;
                }
                //In other cases just call initLoader directly for start loading
                self.initLoader();
                return this;
            },
            /**
             * Lazy loading of package.
             * This method attachEvent window.onload by {AJL.Helper.attachEvent}
             */
            lazyLoad: function () {
                var self = this;
                AJL.Helper.attachEvent(window, 'load', function () {
                    self.initLoader();
                });
            },
            /**
             * Check if package already loaded
             * @returns {boolean}
             */
            isLoaded: function () {
                var self = this;
                return self.loaded;
            },
            /**
             * Trigger when package fully loaded into DOM
             */
            onPackageLoad: function () {
                this.loaded = true;
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function PackageConfig(window, document, AJL) {
    if (!AJL.PackageConfig) {
        /**
         * Creating new Configuration object for {AJL.Package}
         * @param {collection|object} params Parameters for extend default configuration
         * @author Eugene Obrezkov
         * @copyright 2013 MIT License
         * @returns {AJL.PackageConfig}
         * @constructor
         */
        AJL.PackageConfig = function (params) {
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
        AJL.PackageConfig.prototype = {
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
             * @returns {AJL.PackageConfig}
             */
            setItem: function (key, value) {
                var options = this.options;
                options[key] = value;
                return this;
            },
            /**
             * Set current config variables from object
             * @param {object} param Object which need set
             * @returns {AJL.PackageConfig}
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
var AJL = (function PackageManager(window, document, AJL) {
    if (!AJL.PackageManager) {
        AJL.PackageManager = {
            /**
             * @property packages Object of packages in AJL
             * @type {object}
             */
            _packages: {},
            /**
             * Get package from AJL
             * @param {string} name Name of package
             * @returns {boolean|AJL.Package} Package if successful and false if not
             */
            getPackage: function (name) {
                var packages = this._packages;
                if (packages.hasOwnProperty(name)) {
                    return packages[name];
                }
                return false;
            },
            /**
             * Add package to PackageManager or rewrite exists
             * @param {AJL.Package} pack Package what need to add
             * @returns {boolean} True if successful
             */
            setPackage: function (pack) {
                var packages = this._packages;
                if (!AJL.Helper.isEmpty(pack.name)) {
                    packages[pack.name] = pack;
                    return true;
                }
                return false;
            },
            /**
             * Load all packages in AJL
             */
            loadAll: function () {
                var packages = this._packages;
                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack)) {
                        packages[pack].load();
                    }
                }
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean} True if loaded
             */
            loadByName: function (name) {
                var packages = this._packages;
                if (packages.hasOwnProperty(name)) {
                    packages[name].load();
                    return true;
                }
                return false;
            },
            /**
             * Delete all packages from PackageManager
             */
            deleteAll: function () {
                this._packages = {};
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});