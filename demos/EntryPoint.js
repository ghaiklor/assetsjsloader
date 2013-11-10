AJL({
    name: 'Test One',
    assets: ['vendor/angular.js', 'vendor/snap.svg.js'],
    config: {
        lazy: true
    }
}, {
    name: 'Test Two',
    assets: ['vendor/underscore.js', 'vendor/prism.js']
}).loadAll();