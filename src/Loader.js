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