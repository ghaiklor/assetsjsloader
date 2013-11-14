/*! AssetsJSLoader - v0.1.0 - 2013-11-14
* http://ghaiklor.github.io/assetsjsloader/
* Copyright (c) 2013 Eugene Obrezkov; Licensed MIT */
var AJL = (function (window, document, AJL) {
    /**
     * Make calls of others functions in shorthand syntax
     * @returns {AJL.PackageManager|Boolean}
     * @constructor
     * @namespace AJL
     * @author Eugene Obrezkov
     * @copyright 2013 MIT License
     * @example
     * //Create Packages with one call
     * AJL({
     *      name: "My Package",
     *      assets: ['vendor/foo.js', 'vendor/bar.js']
     * }, {
     *      name: "Backbone",
     *      assets: ['vendor/underscore.js', 'vendor/backbone.js']
     * });
     * //And this will create Packages which will be available through Package Manager
     *
     * //Get PackageManager for loading of some Packages
     * var PackageManager = AJL();
     * PackageManager.loadByName("My Package");
     * //Or using chainloading
     * AJL().loadByName("My Package");
     *
     * //Get Package from AJL
     * var myPackage = AJL("My Package");
     * //And then using it
     * myPackage.load();
     * //Or using chainloading again
     * AJL("My Package").load();
     *
     * //Set own namespaces
     * AJL("MyScope.MyModule.MySubmodule", {
     *      foo: 'foo',
     *      bar: function() {
     *          console.log("Bar");
     *      }
     * });
     * AJL("MyScope.MyModule.MyFunction", function() {
     *      console.log("Some function or constructor");
     * });
     * //And then using it like this
     * MyScope.MyModule.MySubmodule.bar();
     * MyScope.MyModule.MyFunction();
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
            i;

        //Switch of arguments length for detect what need to do
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
                break;
            case 2:
                argFirst = arguments[0];
                argSecond = arguments[1];
                //If first arg is string and second object or function
                if (helper.isString(argFirst) && (helper.isObject(argSecond) || helper.isFunction(argSecond))) {
                    //Then I think that it's namespace setting
                    namespace.setNamespace(argFirst, argSecond);
                    return packageManager;
                }
                break;
            default:
                break;
        }
        //If all predefined templates in arguments didn't decided then create packages from them
        for (i = 0; i < argLength; i++) {
            if (!helper.isUndefined(arguments[i])) {
                packageName = arguments[i].name;
                packageAssets = arguments[i].assets;
                packageConfig = arguments[i].config;
                packageInstance = new AJL.Package(packageName, packageAssets, packageConfig);
                packageManager.setPackage(packageInstance);
            }
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

        /**
         * @namespace AJL.Helper
         */
        AJL.Helper = {
            /**
             * Iterate through object
             * @param {Array|Object|Collection} obj Object where need to iterate
             * @param {Function} callback Function which will working while iterate
             * @returns {Array|Object|Collection}
             * @example
             * AJL.Helper.each({
             *      foo: 'foo',
             *      bar: 'bar'
             * }, function(key, value) {
             *      console.log(key, value);
             * });
             */
            each: function (obj, callback) {
                var i = 0,
                    objLength = obj.length;

                for (; i < objLength;) {
                    //For each element in obj call callback function
                    //with call and change this context with current item
                    if (callback.call(obj[i], i, obj[i++]) === false) {
                        break;
                    }
                }
                return obj;
            },
            /**
             * Extend object
             * @param {Array|Collection|Object} target Target
             * @param {Array|Collection|Object} object From which object extend target
             * @returns {Object|Collection} Resulting object
             * @example
             * AJL.Helper.extend({
             *      foo: 'foo'
             * }, {
             *      bar: function() {
             *          console.log("I'm a bar function");
             *      }
             * });
             */
            extend: function (target, object) {
                var item;
                for (item in object) {
                    if (object.hasOwnProperty(item)) {
                        target[item] = object[item];
                    }
                }
                return target;
            },
            /**
             * Get extension of filename
             * @param {String} fileName Filename from which we need get extension
             * @returns {String} Extension of file
             * @example
             * AJL.Helper.getExtension('SomeFileName.js');
             */
            getExtension: function (fileName) {
                return fileName.split('.').pop();
            },
            /**
             * Check if this file has js-extensions
             * @param {String} url URL of file that need to check
             * @returns {Boolean} True if is script file
             * @example
             * AJL.Helper.isScriptFile('MyScript.js');
             */
            isScriptFile: function (url) {
                return scriptFiles.indexOf(this.getExtension(url)) != -1;
            },
            /**
             * Check if this file has css-extensions
             * @param {String} url URL of file that need to check
             * @returns {Boolean} True if is css file
             * @example
             * AJL.Helper.isCssFile('SomeStyles.css');
             */
            isCssFile: function (url) {
                return linkFiles.indexOf(this.getExtension(url)) != -1;
            },
            /**
             * Is variable empty or not
             * @param {*} param Variable which need check
             * @returns {Boolean} True if empty
             * @example
             * AJL.Helper.isEmpty([]);
             */
            isEmpty: function (param) {
                return this.isUndefined(param) || param == '' || param.length == 0;
            },
            /**
             * Is variable undefined
             * @param {*} param Variable which need check
             * @returns {Boolean} True if undefined or null
             * @example
             * AJL.Helper.isUndefined(undefined);
             */
            isUndefined: function (param) {
                return param == undefined || param == null;
            },
            /**
             * Get type of obj in string
             * @param {*} obj Variable from which need get type
             * @returns {String} Type of variable
             * @example
             * AJL.Helper.classType(['Hi', 'I am array']);
             */
            classType: function (obj) {
                return obj == null ? String(obj) : class2Type[coreToString.call(obj)] || "object";
            },
            /**
             * Check if it is object
             * @param obj Object which need check
             * @returns {boolean} True if this object
             * @example
             * AJL.Helper.isObject(['No', 'Not object']);
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
             * Check if variable instanceof of object
             * @param {*} instance Instance that need to check
             * @param {*} obj Object or Function
             * @returns {boolean} True if Instance instanceof Obj
             * @example
             * AJL.Helper.isInstanceOf(myPackage, AJL.Package);
             */
            isInstanceOf: function (instance, obj) {
                if (this.isUndefined(instance) || this.isUndefined(obj)) {
                    return false;
                }
                return (instance instanceof obj);
            },
            /**
             * Check if it is function
             * @param {*} obj What need check
             * @returns {boolean} True if this function
             * @example
             * AJL.Helper.isFunction(function() {
             *      console.log("Yes, it's function");
             * });
             */
            isFunction: function (obj) {
                return this.classType(obj) === "function";
            },
            /**
             * Check if variable it is array
             * @param obj What need check
             * @returns {boolean} True if it's array
             * @example
             * AJL.Helper.isArray("No, it's not");
             */
            isArray: function (obj) {
                return this.classType(obj) === 'array';
            },
            /**
             * Check if variable it is global scope - window object
             * @param obj What need check
             * @returns {boolean} True if this window
             * @example
             * AJL.Helper.isWindow({
             *      no: 'not window object'
             * });
             */
            isWindow: function (obj) {
                return obj != null && obj == obj.window;
            },
            /**
             * Check if variable it is string type
             * @param {*} param What need check
             * @returns {boolean} True if this string
             * @example
             * AJL.Helper.isString("Yes, it's string");
             */
            isString: function (param) {
                return this.classType(param) === "string";
            },
            /**
             * Check if value exists in array
             * @param val Value which we search
             * @param arr Array where we search
             * @returns {boolean} True if exists and false if not
             * @example
             * AJL.Helper.isExistsInArray('My Value', [
             *      'First Value',
             *      'My Value',
             *      'Second Value'
             * ]);
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
             * @example
             * AJL.Helper.attachEvent(window, 'load', function() {
             *      console.log("Page is loaded");
             * });
             */
            attachEvent: function (obj, type, fn) {
                if (obj.attachEvent) {
                    //Fallback for IE and old browsers
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
             * @param {*} obj Object where event assigned
             * @param {string} type Type of event
             * @param {function} fn Function of event
             * @example
             * AJL.Helper.detachEvent(window, 'load', function() {
             *      console.log('Removed');
             * });
             */
            detachEvent: function (obj, type, fn) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, fn, false);
                } else {
                    //Fallback for IE and older browsers
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

        /**
         * @namespace AJL.Loader
         */
        AJL.Loader = {
            /**
             * Function for proceed loading of Package
             * @this AJL.Package
             * @returns {boolean}
             * @example
             * var myPackage = new AJL.Package('My Package', [
             *      'foo.js',
             *      'bar.js'
             * ], {
             *      async: false,
             *      lazy: true
             * });
             * AJL.Loader.loadPackage.call(myPackage);
             */
            loadPackage: function () {
                var helper = AJL.Helper,
                    packageManager = AJL.PackageManager,
                    pack = this,
                    packageAssets = pack.getAssets(),
                    packageConfig = pack.getConfig(),
                    depend = packageConfig.getItem('depend');

                //If assets array empty then halt loading of package
                if (helper.isEmpty(packageAssets)) {
                    return false;
                }

                //If this package depend with other package than load dependencies first
                if (!helper.isEmpty(depend)) {
                    packageManager.loadByNames(depend);
                }

                //If need to wait window.load than call lazyLoad and return
                if (packageConfig.getItem('lazy') == true) {
                    lazyLoad.call(pack);
                    return true;
                }

                //In other cases just call startLoading directly for start loading
                startLoading.call(pack);
                return true;
            },
            /**
             * Search data-ep in scripts tag and load EntryPoint.js file
             * @returns {boolean} True if EntryPoint file exists and loaded
             * @example
             * AJL.Loader.loadEntryPoint();
             */
            loadEntryPoint: function () {
                var scripts = document.getElementsByTagName('script'),
                    entryPointUrl,
                    i;
                for (i = 0; i < scripts.length; i++) {
                    entryPointUrl = scripts[i].getAttribute('data-ep');
                    if (entryPointUrl) {
                        appendScriptTag(entryPointUrl, true);
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

        function appendScriptTag(src, async, type) {
            var helper = AJL.Helper,
                tag = document.createElement('script');
            tag.type = helper.isUndefined(type) ? 'text/javascript' : type;
            tag.async = helper.isUndefined(async) ? true : async;
            tag.src = src;
            appendToHead(tag);
            return true;
        }

        function appendLinkTag(src, rel, type) {
            var helper = AJL.Helper,
                tag = document.createElement('link');
            tag.rel = helper.isUndefined(rel) ? 'stylesheet' : rel;
            tag.type = helper.isUndefined(type) ? 'text/css' : type;
            tag.href = src;
            appendToHead(tag);
            return true;
        }

        function startLoading() {
            var helper = AJL.Helper,
                pack = this,
                assets = pack.getAssets(),
                config = pack.getConfig(),
                currentUrl = '',
                assetsLength = assets.length,
                i;
            //Iterate through all assets array
            for (i = 0; i < assetsLength; i++) {
                currentUrl = assets[i];

                //If current asset url is loaded already then continue to next one
                if (helper.isExistsInArray(currentUrl, loadedAssets)) {
                    continue;
                }

                //If current asset not loaded then push to loadedAssets array for remember it
                loadedAssets.push(currentUrl);
                if (helper.isScriptFile(currentUrl)) {
                    //Append script tag
                    appendScriptTag(currentUrl, config.getItem('async'), config.getItem('scriptTypeAttr'));
                    continue;
                }
                if (helper.isCssFile(currentUrl)) {
                    //Append link tag
                    appendLinkTag(currentUrl, config.getItem('linkCssRelAttr'), config.getItem('linkCssTypeAttr'));
                }
            }
        }

        function lazyLoad() {
            var helper = AJL.Helper,
                pack = this;
            helper.attachEvent(window, 'load', function () {
                startLoading.call(pack);
            });
        }
    }
    return AJL;
})(window, document, window.AJL || {});
var AJL = (function (window, document, AJL) {
    if (!AJL.Namespace) {
        /**
         * @namespace AJL.Namespace
         */
        AJL.Namespace = {
            /**
             * Set namespace for module
             * @param {String} namespace Namespace of module divided by "."
             * @param {*} module Your module which you want load to namespace
             * @returns {*} Returns modified window to global scope with your module
             * @example
             * AJL.Namespace.setNamespace('MyScope.MyModule.SubModule.MyClass', function MyClass(foo, bar) {
             *      this.foo = foo;
             *      this.bar = bar;
             *      return this;
             * });
             */
            setNamespace: function (namespace, module) {
                var parts = namespace.split('.'),
                    parent = window,
                    partsLength,
                    curPart,
                    i;

                //Need iterate all parts of namespace without last one
                partsLength = parts.length - 1;
                for (i = 0; i < partsLength; i++) {
                    //Remember current part
                    curPart = parts[i];
                    if (typeof parent[curPart] === 'undefined') {
                        //If this part undefined then create empty
                        parent[curPart] = {};
                    }
                    //Remember created part in parent
                    parent = parent[curPart];
                }
                //And last one of parts need to be filled by module param
                parent[parts[partsLength]] = module;
                //And not forgot return generated namespace to global scope
                return parent;
            },
            /**
             * Check if this namespace already exists
             * @param {String} namespace Namespace divided by "." what need to check
             * @returns {boolean} True if exists and false if not
             * @example
             * AJL.Namespace.isNamespaceExists('MyScope.MyModule.SubModule.MyClass');
             */
            isNamespaceExists: function (namespace) {
                var parts = namespace.split('.'),
                    parent = window,
                    partsLength = parts.length,
                    curPart,
                    i;

                for (i = 0; i < partsLength; i++) {
                    curPart = parts[i];
                    if (typeof parent[curPart] === "undefined") {
                        //If all cycle we see something undefined then namespace not exists
                        return false;
                    }
                    parent = parent[curPart];
                }
                return true;
            },
            /**
             * Wait for loading namespace into global scope
             * @param {String} namespace Which namespace we need to wait
             * @param {Function} callback Function which call when namespace is loaded
             * @example
             * AJL.Namespace.waitNamespaceForAvailable('MyScope.MyModule.SubModule.MyClass', function() {
             *      console.log("Yes, I just loaded now");
             * });
             */
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
        /**
         * Create Package
         * @param {String} name Name of package
         * @param {Array} assets Array of assets that need load
         * @param {Object} params Configuration object for this package
         * @param {Boolean} params.async Asynchronous loading of package or not
         * @param {Boolean} params.lazy Lazy loading of package (waiting for window loads)
         * @param {Array} params.depend Array of Package's names which need to load before load this
         * @param {String} params.scriptTypeAttr This value write in script tag in type attribute
         * @param {String} params.linkCssTypeAttr This value write in link tag in type attribute
         * @param {String} params.linkCssRelAttr This value write in link tag in rel attribute
         * @returns {AJL.Package}
         * @constructor
         * @class {AJL.Package}
         * @example
         * new AJL.Package('My Own Package', [
         *          'foo.js',
         *          'bar.js',
         *          'style.css'
         *      ], {
         *          async: false,
         *          lazy: true
         *      });
         */
        AJL.Package = function (name, assets, params) {
            /**
             * Name of package
             * @type {String}
             */
            this.name = name;
            /**
             * Assets of this package
             * @type {Array}
             */
            this.assets = assets;
            /**
             * Configuration object of this package
             * @type {AJL.PackageConfig}
             */
            this.config = new AJL.PackageConfig(params);
            return this;
        };

        AJL.Package.prototype = {
            /**
             * Get name of package
             * @returns {String} Name of Package
             * @example
             * myPackage.getName();
             */
            getName: function () {
                return this.name;
            },
            /**
             * Set new name for package
             * @param {String} name New name of package
             * @example
             * myPackage.setName('New name');
             */
            setName: function (name) {
                this.name = name;
            },
            /**
             * Get assets from package
             * @returns {Array} Array of asset's URL
             * @example
             * myPackage.getAssets();
             */
            getAssets: function () {
                return this.assets;
            },
            /**
             * Set new assets for package
             * @param {Array} assets New array of asset's URL for package
             * @example
             * myPackage.setAssets([
             *          'new.js',
             *          'new2.js'
             *      ]);
             */
            setAssets: function (assets) {
                this.assets = assets;
            },
            /**
             * Get config object from package
             * @returns {AJL.PackageConfig}
             * @example
             * myPackage.getConfig();
             */
            getConfig: function () {
                return this.config;
            },
            /**
             * Set new config object for package
             * @param {AJL.PackageConfig} config New object of configuration
             * @example
             * myPackage.setConfig(
             *      new AJL.PackageConfig({
             *          lazy: true,
             *          depend: ['mySecondPackageName']
             *      }));
             */
            setConfig: function (config) {
                this.config = config;
            },
            /**
             * Start loading of package
             * @example
             * myPackage.load();
             */
            load: function () {
                AJL.Loader.loadPackage.call(this);
            }
        };
    }
    return AJL;
})(window, document, window.AJL || {});
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
var AJL = (function (window, document, AJL) {
    if (!AJL.PackageManager) {
        var packages = [];

        /**
         * @namespace AJL.PackageManager
         */
        AJL.PackageManager = {
            /**
             * Get package from AJL
             * @param {String} name Name of package
             * @returns {Boolean|AJL.Package} Package if successful and false if not
             * @example
             * AJL.PackageManager.getPackage('My Package Name');
             */
            getPackage: function (name) {
                var helper = AJL.Helper;

                if (packages.hasOwnProperty(name) && helper.isInstanceOf(packages[name], AJL.Package)) {
                    return packages[name];
                }

                return false;
            },
            /**
             * Get packages from AJL
             * @param {Array} names Array of Package's names which need get
             * @returns {Array}
             * @example
             * AJL.PackageManager.getPackages([
             *          'First Package Name',
             *          'Second Package Name'
             *      ]);
             */
            getPackages: function (names) {
                var self = this,
                    packageArray = [],
                    curName,
                    curPackage,
                    namesLength = names.length,
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
             * @returns {boolean|AJL.PackageManager} False if not successful and PackageManager if successful
             * @example
             * AJL.PackageManager.setPackage(
             *      new AJL.Package('New Package', [
             *              'foo.js',
             *              'bar.js',
             *              'style.css',
             *          ], {
             *              async: false,
             *              lazy: true,
             *              depend: ['Some other Package Name']
             *          })
             *      );
             */
            setPackage: function (pack) {
                var helper = AJL.Helper,
                    packName;

                if (helper.isInstanceOf(pack, AJL.Package)) {
                    packName = pack.getName();
                    if (!helper.isEmpty(packName)) {
                        packages[packName] = pack;
                        return this;
                    }
                }

                return false;
            },
            /**
             * Add Packages to PackageManager or rewrite exists
             * @param {Array} packs Array of AJL.Package objects
             * @returns {AJL.PackageManager}
             * @example
             * var FooPackage = new AJL.Package('Foo', ['foo.js', 'foo2.js']);
             * var BarPackage = new AJL.Package('Bar', ['bar.js', 'bar2.js'], {
             *      async: false,
             *      depend: ['Foo']
             * });
             * AJL.PackageManager.setPackages([FooPackage, BarPackage]);
             */
            setPackages: function (packs) {
                var self = this,
                    helper = AJL.Helper,
                    curPack,
                    packsLength = packs.length,
                    i;

                for (i = 0; i < packsLength; i++) {
                    curPack = packs[i];
                    if (helper.isInstanceOf(curPack, AJL.Package)) {
                        self.setPackage(curPack);
                    }
                }
                return this;
            },
            /**
             * Load all packages in AJL
             * @return {AJL.PackageManager}
             * @example
             * AJL.PackageManager.loadAll();
             */
            loadAll: function () {
                var helper = AJL.Helper,
                    curPack;

                for (var pack in packages) {
                    if (packages.hasOwnProperty(pack)) {
                        curPack = packages[pack];
                        if (helper.isInstanceOf(curPack, AJL.Package)) {
                            curPack.load();
                        }
                    }
                }
                return this;
            },
            /**
             * Load one package by name
             * @param {string} name Name of package to load
             * @return {boolean|AJL.PackageManager} PackageManager if loaded and false if not
             * @example
             * AJL.PackageManager.loadByName('Own Package Name');
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
             * Load packages by names
             * @param {Array} names Array of Package's names to load
             * @returns {AJL.PackageManager}
             * @example
             * AJL.PackageManager.loadByNames([
             *      'First Package Name',
             *      'Second Package Name'
             * ]);
             */
            loadByNames: function (names) {
                var helper = AJL.Helper,
                    curName,
                    namesLength,
                    i;

                namesLength = names.length;
                for (i = 0; i < namesLength; i++) {
                    curName = names[i];
                    if (packages.hasOwnProperty(curName) && helper.isInstanceOf(packages[curName], AJL.Package)) {
                        packages[curName].load();
                    }
                }
                return this;
            }
        }
    }
    return AJL;
})(window, document, window.AJL || {});