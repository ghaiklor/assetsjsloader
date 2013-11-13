AJL({
    name: 'Backbone',
    assets: ['vendor/underscore.js', 'vendor/backbone.js'],
    config: {
        lazy: false,
        async: false
    }
}, {
    name: 'jQuery 2.0.3',
    assets: ['vendor/jquery-2.0.3.js'],
    config: {
        async: true,
        depend: ['Backbone']
    }
}, {
    name: 'jQuery Plugins',
    assets: ['vendor/jquery-ui.js'],
    config: {
        async: false,
        lazy: false,
        depend: ['jQuery 2.0.3', 'Backbone']
    }
}).loadAll();