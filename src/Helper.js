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