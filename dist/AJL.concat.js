/*! AssetsJSLoader - v0.1.0 - 2013-11-09
* http://ghaiklor.github.io/assetsjsloader/
* Copyright (c) 2013 Eugene Obrezkov; Licensed MIT */
var AJL = (function (window, document, AJL) {
    //TODO: make autodetect of needed method
    //This need for different params in AJL by one function for use
    /**
     * @return {boolean|PackageManager}
     */
    AJL = function () {
        var packageManager = AJL.PackageManager,
            curPackage = {},
            curName = '',
            curAssets = [],
            curConfig = {},
            argLength = arguments.length,
            item;

        //If this two arguments
        if (argLength == 2) {
            //And first one is string and second object or function
            if (typeof arguments[0] == "string" && (typeof arguments[1] == "object" || typeof arguments[1] == "function")) {
                //Then I think that it's namespace setting
                setNamespace(arguments[0], arguments[1]);
                return true;
            }
        }

        //IMPORTANT: This cycle need to be execute in last
        //In other cases I go through all arguments
        for (item in arguments) {
            if (arguments.hasOwnProperty(item)) {
                //And if some of them not object than halt
                if (typeof arguments[item] != "object") {
                    return false;
                }
            }
        }

        //If all gone right than need initialize packages
        for (item in arguments) {
            if (arguments.hasOwnProperty(item)) {
                curName = arguments[item].name;
                curAssets = arguments[item].assets;
                curConfig = arguments[item].config;
                curPackage = new AJL.Package(curName, curAssets, curConfig);
                packageManager.setPackage(curPackage);
            }
        }

        return packageManager;
    };

    function setNamespace(namespace, module) {
        var parts = namespace.split('.'),
            parent = window,
            partsLength,
            curPart,
            i;

        //Need iterate all parts of namespace without last one
        partsLength = parts.length - 1;
        for (i = 0; i < partsLength; i++) {
            curPart = parts[i];
            if (typeof parent[curPart] === 'undefined') {
                parent[curPart] = {};
            }
            parent = parent[curPart];
        }
        //And last one of parts need to be filled by module param
        parent[parts[partsLength]] = module;
        //And not forgot return generated namespace to global scope
        return parent;
    }

    return AJL;
})(window, document, window.AJL || {});
AJL('AJL.Helper', (function () {
    var Helper,
        linkFiles = ["css"],
        scriptFiles = ["js"],
        coreToString = Object.prototype.toString,
        coreHasOwn = Object.prototype.hasOwnProperty,
        class2Type = {};

    Helper = {
        /**
         * Iterate through obj
         * @param obj Object where need to iterate
         * @param callback Function which was working while iterate
         * @returns {*}
         */
        each: function (obj, callback) {
            var i = 0,
                objLength = obj.length;

            for (; i < objLength;) {
                if (callback.call(obj[i], i, obj[i++]) === false) {
                    break;
                }
            }
            return obj;
        },
        /**
         * Extend object
         * @returns {object|collection} Resulting object
         */
        extend: function () {
            var options,
                name,
                src,
                copy,
                copyIsArray,
                clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }

            if (typeof target !== "object" && !this.isFunction(target)) {
                target = {};
            }

            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        if (options.hasOwnProperty(name)) {
                            src = target[name];
                            copy = options[name];

                            if (target === copy) {
                                continue;
                            }

                            if (deep && copy && ( this.isObject(copy) || (copyIsArray = this.isArray(copy)) )) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && this.isArray(src) ? src : [];
                                } else {
                                    clone = src && this.isObject(src) ? src : {};
                                }
                                target[ name ] = this.extend(deep, clone, copy);
                            } else if (copy !== undefined) {
                                target[ name ] = copy;
                            }
                        }
                    }
                }
            }

            return target;
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
            return scriptFiles.indexOf(this.getExtension(url)) != -1;
        },
        /**
         * Check if this file have css-extensions
         * @param {string} url URL of file that need to check
         * @returns {boolean} True if is css file
         */
        isCssFile: function (url) {
            return linkFiles.indexOf(this.getExtension(url)) != -1;
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
         * Get type of obj in string
         * @param obj Object from which need get type
         * @returns {string}
         */
        classType: function (obj) {
            return obj == null ? String(obj) : class2Type[coreToString.call(obj)] || "object";
        },
        /**
         * Check if it is object
         * @param obj Object which need check
         * @returns {boolean}
         */
        isObject: function (obj) {
            var key;

            if (!obj || this.classType(obj) !== 'object' || obj.nodeType || this.isWindow(obj)) {
                return false;
            }

            try {
                if (obj.constructor && !coreHasOwn.call(obj, "constructor") && !coreHasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (Exception) {
                return false;
            }
            for (key in obj) {
            }
            return key === undefined || coreHasOwn.call(obj, key);
        },
        /**
         * Check if is Object instanceof Of object
         * @param instance
         * @param obj
         * @returns {boolean}
         */
        isInstanceOf: function (instance, obj) {
            if (this.isUndefined(instance) || this.isUndefined(obj)) {
                return false;
            }
            return (instance instanceof obj);
        },
        /**
         * Check if obj is function
         * @param obj What need check
         * @returns {boolean}
         */
        isFunction: function (obj) {
            return this.classType(obj) === "function";
        },
        /**
         * Check ib obj is array
         * @param obj What need check
         * @returns {boolean}
         */
        isArray: function (obj) {
            return this.classType(obj) === 'array';
        },
        /**
         * Check if obj is global scoped window object
         * @param obj What need check
         * @returns {boolean}
         */
        isWindow: function (obj) {
            return obj != null && obj == obj.window;
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

    //This need for filling class2Type variable and prepare for detect object's type
    Helper.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
        class2Type["[object " + name + "]"] = name.toLowerCase();
    });

    return Helper;
})());
AJL("AJL.Loader", (function () {
    var Loader;

    Loader = {
        /**
         * Generate script tag and insert into head
         * @param {string} src URL to script file
         * @this {PackageConfig}
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
         * @this {PackageConfig}
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

    return Loader;
})());
AJL("AJL.Package", (function () {
    var Package;
    /**
     * Creating new Package
     * @author Eugene Obrezkov
     * @copyright 2013 MIT License
     * @param {string} name Name of Package
     * @param {collection|object} assets Collection of assets URL for loading
     * @param {object} [params] Parameters for extend default config
     * @returns {Package}
     * @constructor
     */
    Package = function (name, assets, params) {
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
         * @type {PackageConfig}
         */
        this.config = new AJL.PackageConfig(params);
        /**
         * @property loaded Is this package already loaded?
         * @type {boolean}
         */
        this.loaded = false;
        return this;
    };

    Package.prototype = {
        /**
         * Load Package and Assets Files from this Package
         * @returns {boolean|Package} True if Package successful loaded
         */
        load: function () {
            var helper = AJL.Helper,
                self = this,
                config = self.config,
                assets = self.assets;
            //If assets array empty then halt loading of package
            //TODO: make right checking of loaded package
            if (helper.isEmpty(assets)) {
                return false;
            }
            //If need to wait window.load than call lazyLoad and return
            if (config.getItem('lazy') == true) {
                lazyLoad.call(this);
                return this;
            }
            //In other cases just call initLoader directly for start loading
            initLoader.call(this);
            return this;
        },
        /**
         * Check if package already loaded
         * @returns {boolean}
         */
        isLoaded: function () {
            var self = this;
            return self.loaded;
        }
    };

    /**
     * Lazy loading of package.
     * This method attachEvent window.onload by {AJL.Helper.attachEvent}
     * @this {Package}
     */
    function lazyLoad() {
        var helper = AJL.Helper,
            pack = this;
        helper.attachEvent(window, 'load', function () {
            initLoader.call(pack);
        });
    }

    /**
     * Init generating and append tags into head.
     * Call methods from {AJL.Loader}
     * @this {Package}
     */
    function initLoader() {
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
        onPackageLoad();
    }

    /**
     * Trigger when package fully loaded into DOM
     */
    function onPackageLoad() {
        this.loaded = true;
    }

    return Package;
})());
AJL("AJL.PackageConfig", (function () {
    var PackageConfig;
    /**
     * Creating new Configuration object for {AJL.Package}
     * @param {collection|object} params Parameters for extend default configuration
     * @author Eugene Obrezkov
     * @copyright 2013 MIT License
     * @returns {PackageConfig}
     * @constructor
     */
    PackageConfig = function (params) {
        /**
         * @property {object} options
         * @property {boolean} options.async Asynchronous loading of package
         * @property {boolean} options.lazy Lazy loading (load package on window.load)
         * @property {string} options.scriptTypeAttr type-attr for script-tag
         * @property {string} options.linkCssTypeAttr type-attr for link-tag of css
         * @property {string} options.linkCssRelAttr rel-attr for link-tag of css
         */
        var helper = AJL.Helper,
            options = {
                async: true,
                lazy: false,
                scriptTypeAttr: 'text/javascript',
                linkCssTypeAttr: 'text/css',
                linkCssRelAttr: 'stylesheet'
            };
        this.options = helper.extend(options, params);
        return this;
    };

    PackageConfig.prototype = {
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
         * @returns {PackageConfig}
         */
        setItem: function (key, value) {
            var options = this.options;
            options[key] = value;
            return this;
        },
        /**
         * Set current config variables from object
         * @param {object} param Object which need set
         * @returns {PackageConfig}
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

    return PackageConfig;
})());
AJL("AJL.PackageManager", (function () {
    var PackageManager,
        packages = {};

    PackageManager = {
        /**
         * Get package from AJL
         * @param {string} name Name of package
         * @returns {boolean|Package} Package if successful and false if not
         */
        getPackage: function (name) {
            var helper = AJL.Helper;

            if (packages.hasOwnProperty(name)) {
                if (helper.isInstanceOf(packages[name], AJL.Package)) {
                    return packages[name];
                }
                return false;
            }
            return false;
        },
        /**
         *
         * @param names
         * @returns {Array}
         */
        getPackages: function (names) {
            var helper = AJL.Helper,
                result = [],
                namesLength,
                i;

            namesLength = names.length;
            for (i = 0; i < namesLength; i++) {
                if (packages.hasOwnProperty(names[i])) {
                    if (helper.isInstanceOf(packages[names[i]], AJL.Package)) {
                        result.push(packages[names[i]]);
                    }
                }
            }
            return result;
        },
        /**
         * Add package to PackageManager or rewrite exists
         * @param {Package} pack Package what need to add
         * @returns {boolean|PackageManager} True if successful
         */
        setPackage: function (pack) {
            var helper = AJL.Helper;
            if (!helper.isEmpty(pack.name) && helper.isInstanceOf(pack, AJL.Package)) {
                packages[pack.name] = pack;
                return this;
            }
            return false;
        },
        /**
         * Set packages to PackageManager
         * @param packs
         * @returns {PackageManager}
         */
        setPackages: function (packs) {
            var helper = AJL.Helper,
                pack;

            for (pack in packs) {
                if (packs.hasOwnProperty(pack)) {
                    if (helper.isInstanceOf(packs[pack], AJL.Package)) {
                        packages[pack[packs].name] = pack;
                    }
                }
            }
            return this;
        },
        /**
         * Load all packages in AJL
         * @return {PackageManager}
         */
        loadAll: function () {
            var helper = AJL.Helper;

            for (var pack in packages) {
                if (packages.hasOwnProperty(pack)) {
                    if (helper.isInstanceOf(packages[pack], AJL.Package)) {
                        packages[pack].load();
                    }
                }
            }
            return this;
        },
        /**
         * Load one package by name
         * @param {string} name Name of package to load
         * @return {boolean|PackageManager} True if loaded
         */
        loadByName: function (name) {
            var helper = AJL.Helper;

            if (packages.hasOwnProperty(name) && helper.isInstanceOf(packages[name], AJL.Package)) {
                packages[name].load();
                return this;
            }
            return false;
        },
        /**
         * Load packages by their names
         * @param names
         */
        loadByNames: function (names) {
            var helper = AJL.Helper,
                i,
                namesLength;

            namesLength = names.length;
            for (i = 0; i < namesLength; i++) {
                if (packages.hasOwnProperty(names[i]) && helper.isInstanceOf(packages[names[i]], AJL.Package)) {
                    packages[names[i]].load();
                }
            }
            return this;
        }
    };

    return PackageManager;
})());