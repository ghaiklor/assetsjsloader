var AJL = (function (window, document, AJL) {
    if (!AJL.Loader) {
        var loadedAssets = [];

        AJL.Loader = {
            /**
             * Load Package
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

                //In other cases just call initLoader directly for start loading
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
            for (i = 0; i < assetsLength; i++) {
                currentUrl = assets[i];

                if (helper.isExistsInArray(currentUrl, loadedAssets)) {
                    continue;
                }

                loadedAssets.push(currentUrl);
                if (helper.isScriptFile(currentUrl)) {
                    appendScriptTag(currentUrl, config.getItem('async'), config.getItem('scriptTypeAttr'));
                    continue;
                }
                if (helper.isCssFile(currentUrl)) {
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