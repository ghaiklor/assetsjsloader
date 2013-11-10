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