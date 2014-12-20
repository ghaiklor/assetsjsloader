AssetsJSLoader (AJL)
====================

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ghaiklor/assetsjsloader?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**AJL** has been designed to simplify the management of loading javascript and css files. Its main feature is the ability to create your own packages of resources and load them only when necessary.

As a result of the AJL work you get separated logic of resource including (JS or CSS files) from the view and the only thing that connects you to your view it's script-tag which include AJL script.

Features
====================

+ Support for the JS-files and CSS-files.
+ Creating packages with the resources that you want to load.
+ Ability to define which mode to load packages.
+ Asynchronous loading of packages or not.
+ Loading packages only after loading all resources on page (Lazy Loading).
+ Built-in package manager will simplify the work with loading and creating packages.
+ The ability to create their own namespaces with maximum ease and flexibility.
+ Additional functions to verify the existence of namespace and set callback function when creating some namespace.
+ You can use the shorthand for the most common functions. Such as creating package, set namespaces, loading the package or packages, etc.
+ All code is thoroughly documented with examples.

Getting Started
====================

1. Download the latest version from the **master** branch [here](https://github.com/ghaiklor/assetsjsloader/archive/master.zip) and connect it before the end of the body tag. The compiled file ready-2-use can be found in a *dist* directory with name **AJL.min.js**.

2. Connect the file in the script tag and specify the **data-ep** attribute like this: `<script src="js/vendor/AJL.min.js" data-ep="EntryPoint.js"></script>`. **EntryPoint.js** file is loaded immediately after loading the AJL and this is where you can configure all the required packages and the necessary resources to load.

3. Inside the file **EntryPoint.js**, set what packages you want to create and what to do when the page loads:

```
AJL({
    name: "jQuery",
    assets: ['js/vendor/jquery.min.js'],
    config: {
        async: false
    }
}, {
    name: "jQuery Plugins",
    assets: ['js/vendor/jquery.plugin.js', 'js/vendor/jquery.plugin2.js'],
    config: {
        depend: ['jQuery']
    }
}, {
    name: "My Scripts",
    assets: ['js/foo.js', 'js/bar.js'],
    config: {
        lazy: true
    }
}).loadAll();
```

This configuration is only an example of AJL using. The above code will create three packages with names *jQuery*, *jQuery Plugins*, *My Scripts* and immediately load them with dependency resolution.

Consider these three packages at a time.

Package named *jQuery* boot in the first place without the asynchronous loading.

Package with the *jQuery Plugins* name load all the plugins with this package, but only when the package with name *jQuery* is loaded because *jQuery Plugins* depends on *jQuery*.

And last loaded package with the name *My Scripts* as it is configured to Lazy Loading. This means that *My Scripts* is loaded when all resources are loaded on the page, even with pictures.

Shorthand usage
====================

Currently AJL supports four shorthands:

1. `AJL();` - returns a PackageManager.

2. `AJL(packageName);` - return a Package from PackageManager.

3. `AJL(namespaceString, moduleObjectOrFunction);` - specify the namespace for an own module.

4. `AJL(paramsForCreatingPackages, ..., etc, ...);` - create packages.

More information can be found [here](http://ghaiklor.github.io/assetsjsloader/doc/AJL.html).

Built-in PackageManager
====================

For get access to the integrated package manager enough to call a method with no parameters AJL(). Calling this function will return you the module AJL.PackageManager, that has all the necessary functions for working with packages:

+ `getPackage(nameString);` - returns an AJL.Package object.

+ `getPackages(namesArray);` - return an array of AJL.Package objects.

+ `setPackage(AJLPackage);` - adds a new package in PackageManager or rewrite exists.

+ `setPackages(AJLPackagesArray);` - adds a new packages in PackageManager or rewrite exists packages.

+ `loadAll();` - load all packages in PackageManager.

+ `loadByName(nameString);` - load package by name.

+ `loadByNames(namesArray);` - load packages by their names.

For more information about these features can be found [here](http://ghaiklor.github.io/assetsjsloader/doc/AJL.PackageManager.html)

Namespaces
====================

There is also implemented namespaces are easy to use.

Enough when developing your module call the function AJL() and pass it two parameters: the first is the string representation of the name of your namespace divided by dot **"."**, and the other option - it's the module (function or object).

Here is an example module foo.js which we want to locate in window.**MyModule.SubModule**

```
AJL("MyModule.SubModule", (function() {
    var privateVariable = "two";
    var foo = {
        methodOne: function() {
            console.debug("Method One");
        },
        methodTwo: function() {
            return privateVariable;
        }
    }
    return foo;
})());
```

The result of this code will be an object that is located in a global scope of window in MyModule.SubModule.

And according to the use of your module can be reduced to such a is:

```
MyModule.SubModule.methodOne();
MyModule.SubModule.methodTwo();
```

Also, use the namespace ensures that there will be no leakage of variables, objects or functions in the global context **window**.

Documentation
====================

All documentation is on this [link](http://ghaiklor.github.io/assetsjsloader/doc/AJL.html). Each class or namespace described in detail in this document and each method is an example of use.

License
====================

The MIT License (MIT)

Copyright (c) 2013 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.