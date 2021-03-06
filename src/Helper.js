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