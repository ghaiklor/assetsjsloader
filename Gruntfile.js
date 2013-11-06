/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        meta: {
            version: '0.1.0'
        },
        banner: '/*! AssetsJSLoader - v<%= meta.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://ghaiklor.github.io/assetsjsloader/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'Eugene Obrezkov; Licensed MIT */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/AJL.js', 'src/Helper.js', 'src/Loader.js', 'src/Package.js', 'src/PackageConfig.js', 'src/PackageManager.js'],
                dest: 'dist/AJL.concat.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/AJL.min.js'
            }
        },
        watch: {
            files: '<%= concat.dist.src %>',
            tasks: ['default']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);

};
