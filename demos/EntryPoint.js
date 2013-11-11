AJL({
    name: 'Backbone',
    assets: ['vendor/backbone.js', 'vendor/underscore.js', 'vendor/jquery-2.0.3.js']
}, {
    name: 'jQuery 2.0.3',
    assets: ['vendor/jquery-2.0.3.js']
}, {
    name: 'jQuery Plugins',
    assets: ['vendor/jquery-ui.js'],
    config: {
        async: false,
        lazy: false,
        depend: ['jQuery 2.0.3', 'Backbone']
    }
}).loadAll();