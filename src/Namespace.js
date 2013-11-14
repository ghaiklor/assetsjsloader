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