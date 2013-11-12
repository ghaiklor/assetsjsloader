/*! AssetsJSLoader - v0.1.0 - 2013-11-12
* http://ghaiklor.github.io/assetsjsloader/
* Copyright (c) 2013 Eugene Obrezkov; Licensed MIT */
var AJL = (function (window, document, AJL) {
    //TODO: make autodetect of needed method
    //This need for different params in AJL by one function for use
    /**
     *
     * @returns {*}
     * @constructor
     * @return {boolean}
     */
    AJL = function () {
        var packageManager = AJL.PackageManager,
            namespace = AJL.Namespace,
            helper = AJL.Helper,
            packageInstance = {},
            packageName = '',
            packageAssets = [],
            packageConfig = {},
            argLength = arguments.length,
            argFirst,
            argSecond,
            item;

        //TODO: what if package creation params less than 2 items?
        switch (argLength) {
            case 0:
                //If arguments not exists then just return PackageManager instance
                return packageManager;
            case 1:
                argFirst = arguments[0];
                //If this arg is string then return package with this name
                if (helper.isString(argFirst)) {
                    return packageManager.getPackage(argFirst);
                }
                return false;
            case 2:
                argFirst = arguments[0];
                argSecond = arguments[1];
                //If first arg is string and second object or function
                if (helper.isString(argFirst) && (helper.isObject(argSecond) || helper.isFunction(argSecond))) {
                    //Then I think that it's namespace setting
                    namespace.setNamespace(argFirst, argSecond);
                }
                break;
            default:
                //If all predefined templates in arguments didn't decided then create packages from them
                for (item in arguments) {
                    if (arguments.hasOwnProperty(item)) {
                        packageName = arguments[item].name;
                        packageAssets = arguments[item].assets;
                        packageConfig = arguments[item].config;
                        packageInstance = new AJL.Package(packageName, packageAssets, packageConfig);
                        packageManager.setPackage(packageInstance);
                    }
                }
                break;
        }

        return packageManager;
    };

    //This hack needed for init EntryPoint.js when all AJL.min.js will loaded
    setTimeout(function () {
        AJL.Loader.loadEntryPoint();
    }, 0);

    return AJL;
})(window, document, window.AJL || {});

var AJL = (function (window, document, AJL) {
    if (!AJL.Helper) {
        var linkFiles = ["css"],
            scriptFiles = ["js"],
            coreToString = Object.prototype.toString,
            coreHasOwn = Object.prototype.hasOwnProperty,
            class2Type = {};

        AJL.Helper = {
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
            isString: function (param) {
                return this.classType(param) === "string";
            },
            /**
             * Check if val exists in array
             * @param val Value which we search
             * @param arr Array where we search
             * @returns {boolean} True if exists and false if not
             */
            isExistsInArray: function (val, arr) {
                var i;

                for (i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        if (arr[i] == val) {
                            return true;
                        }
                    }
                }
                return false;
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
                    //FIXME: addEventListener not works now
                    //But if call fn() manually it's working
                    //fn();
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
        AJL.Helper.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
            class2Type["[object " + name + "]"] = name.toLowerCase();
        });
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function (window, document, AJL) {
    if (!AJL.Loader) {
        var loadedAssets = [];

        AJL.Loader = {
            loadPackage: function () {
                var helper = AJL.Helper,
                    pack = this,
                    packageName = pack.getName(),
                    packageAssets = pack.getAssets(),
                    packageConfig = pack.getConfig();

                //If assets array empty then halt loading of package
                if (helper.isEmpty(packageAssets)) {
                    return false;
                }
                //If need to wait window.load than call lazyLoad and return
                if (packageConfig.getItem('lazy') == true) {
                    lazyLoad.call(this);
                    return this;
                }
                //If this package depend with other package than load dependencies first
                if (!helper.isEmpty(packageConfig.getItem('dependMap'))) {
                    loadDependencies(packageConfig);
                }
                //In other cases just call initLoader directly for start loading
                initLoader.call(this);
                return this;

                //If this asset already loaded then return true
                if (helper.isExistsInArray(src, loadedAssets)) {
                    return true;
                }

                //If we need add script tag
                if (helper.isScriptFile(src)) {
                    appendScriptTag();
                }

                //If we need add link tag
                if (helper.isCssFile(src)) {
                    appendLinkTag();
                }

                return true;
            },
            loadEntryPoint: function () {
                var scripts = document.getElementsByTagName('script'),
                    entryPointUrl,
                    i;
                for (i = 0; i < scripts.length; i++) {
                    entryPointUrl = scripts[i].getAttribute('data-ep');
                    if (entryPointUrl) {
                        appendScriptTag(entryPointUrl);
                        return true;
                    }
                }
                return false;
            }
        };
        function appendToHead(element) {
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(element);
            return true;
        }

        function appendScriptTag(src) {
            var tag = document.createElement('script');
            tag.type = 'text/javascript';
            tag.async = true;
            tag.src = src;
            appendToHead(tag);
            loadedAssets.push(src);
            return true;
        }

        function appendLinkTag(src) {
            if (AJL.Helper.isExistsInArray(src, loadedAssets)) {
                return;
            }
            var tag = document.createElement('link'),
                config = this;
            tag.rel = AJL.Helper.isUndefined(config.getItem) ? 'stylesheet' : config.getItem('linkCssRelAttr');
            tag.type = AJL.Helper.isUndefined(config.getItem) ? 'text/css' : config.getItem('linkCssTypeAttr');
            tag.href = src;
            appendToHead(tag);
            loadedAssets.push(src);
            return true;
        }

        function lazyLoad() {
            var helper = AJL.Helper,
                pack = this;
            helper.attachEvent(window, 'load', function () {
                initLoader.call(pack);
            });
        }

        function initLoader() {
            var pack = this,
                assets = pack.assets,
                config = pack.config,
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
        }

        /**
         * Load dependencies of current package
         * @this {AJL.PackageConfig}
         */
        function loadDependencies() {
            var loader = AJL.Loader,
                config = this,
                dependArray = config.getItem('dependMap'),
                curDependAsset,
                i;

            for (i in dependArray) {
                if (dependArray.hasOwnProperty(i)) {
                    curDependAsset = dependArray[i];
                    loader.appendDependAsset(curDependAsset);
                }
            }
        }
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function (window, document, AJL) {
    if (!AJL.Namespace) {
        AJL.Namespace = {
            setNamespace: function (namespace, module) {
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
            },
            isNamespaceExists: function (namespace) {
                var parts = namespace.split('.'),
                    parent = window,
                    partsLength = parts.length,
                    curPart,
                    i;

                for (i = 0; i < partsLength; i++) {
                    curPart = parts[i];
                    if (typeof parent[curPart] === "undefined") {
                        return false;
                    }
                    parent = parent[curPart];
                }
                return true;
            },
            waitNamespaceForAvailable: function (namespace, callback) {
                var interval = 100;
                window.setTimeout(function () {
                    if (this.isNamespaceExists(namespace)) {
                        callback();
                    } else {
                        window.setTimeout(arguments.callee, interval);
                    }
                }, interval);
            }
        }
    }

    return AJL;
})(window, document, window.AJL || {});
var AJL = (function (window, document, AJL) {
    if (!AJL.Package) {
        AJL.Package = function (name, assets, params) {
            this.name = name;
            this.assets = assets;
            this.config = new AJL.PackageConfig(params);
            return this;
        };

        AJL.Package.prototype = {
            getName: function () {
                return this.name;
            },
            setName: function (name) {
                this.name = name;
            },
            getAssets: function () {
                return this.assets;
            },
            setAssets: function (assets) {
                this.assets = assets;
            },
            getConfig: function () {
                return this.config;
            },
            setConfig: function (config) {
                this.config = config;
            },
            load: function () {
                AJL.Loader.loadPackage.call(this);
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function (window, document, AJL) {
    if (!AJL.PackageConfig) {
        AJL.PackageConfig = function (params) {
            var helper = AJL.Helper,
                dependArray,
                options = {
                    async: true,
                    lazy: false,
                    depend: [],
                    dependMap: [],
                    scriptTypeAttr: 'text/javascript',
                    linkCssTypeAttr: 'text/css',
                    linkCssRelAttr: 'stylesheet'
                };

            this.options = helper.extend(options, params);
            //If dependencies not empty then build depend-map
            dependArray = this.getItem('depend');
            if (!helper.isEmpty(dependArray)) {
                this.setItem('dependMap', buildDependMap(dependArray));
            }

            return this;
        };
        AJL.PackageConfig.prototype = {
            getItem: function (key) {
                var options = this.options;
                if (options.hasOwnProperty(key)) {
                    return options[key];
                } else {
                    return null;
                }
            },
            setItem: function (key, value) {
                var options = this.options;
                options[key] = value;
                return this;
            }
        };

        function buildDependMap(packagesNameArray) {
            var resultDependMap = [],
                curPack,
                curAsset,
                indexPackage,
                indexAssets;

            //Loop through all packageNames
            for (indexPackage in packagesNameArray) {
                if (packagesNameArray.hasOwnProperty(indexPackage)) {
                    //Get Package Object for current packageName
                    curPack = AJL.PackageManager.getPackage(packagesNameArray[indexPackage]);
                    for (indexAssets = 0; indexAssets < curPack.assets.length; indexAssets++) {
                        //Loop through all assets in currently selected package
                        curAsset = curPack.assets[indexAssets];
                        //If this asset already exists in dependency map then don't add it into map
                        if (AJL.Helper.isExistsInArray(curAsset, resultDependMap)) {
                            continue;
                        }
                        //In other case add this asset into resulting map array
                        resultDependMap.push(curPack.assets[indexAssets]);
                    }
                }
            }
            //And finally set generated dependency map to config of current package
            return resultDependMap;
        }
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function (window, document, AJL) {
    if (!AJL.PackageManager) {
        var packages = [];

        AJL.PackageManager = {
            /**
             * Get package from AJL
             * @param {string} name Name of package
             * @returns {boolean|Package} Package if successful and false if not
             */
            getPackage: function (name) {
                var helper = AJL.Helper;

                if (packages.hasOwnProperty(name) && helper.isInstanceOf(packages[name], AJL.Package)) {
                    return packages[name];
                }

                return false;
            },
            /**
             *
             * @param names
             * @returns {Array}
             */
            getPackages: function (names) {
                var self = this,
                    packageArray = [],
                    namesLength = names.length,
                    curName,
                    curPackage,
                    i;

                for (i = 0; i < namesLength; i++) {
                    curName = names[i];
                    curPackage = self.getPackage(curName);
                    if (curPackage) {
                        packageArray.push(curPackage);
                    }
                }

                return packageArray;
            },
            /**
             * Add package to PackageManager or rewrite exists
             * @param {AJL.Package} pack Package what need to add
             * @returns {boolean|AJL.PackageManager} True if successful
             */
            setPackage: function (pack) {
                var helper = AJL.Helper,
                    packName;

                packName = pack.getName();
                if (!helper.isEmpty(packName) && helper.isInstanceOf(pack, AJL.Package)) {
                    packages[packName] = pack;

                    return this;
                }

                return false;
            },
            /**
             * Set packages to PackageManager
             * @param packs
             * @returns {AJL.PackageManager}
             */
            setPackages: function (packs) {
                var self = this,
                    helper = AJL.Helper,
                    curPack,
                    item;

                for (item in packs) {
                    if (packs.hasOwnProperty(item) && helper.isInstanceOf(packs[item], AJL.Package)) {
                        curPack = packs[item];
                        self.setPackage(curPack);
                    }
                }
                return this;
            },
            /**
             * Load all packages in AJL
             * @return {AJL.PackageManager}
             */
            loadAll: function () {
                var helper = AJL.Helper;

                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack) && helper.isInstanceOf(packages[pack], AJL.Package)) {
                        packages[pack].load();
                    }
                }
                return this;
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean|AJL.PackageManager} True if loaded
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
        }
    }
    return AJL;
})(window, document, window.AJL || {});