var imageminOptipng = require('imagemin-optipng');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        responsive_images: {
            dev: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 150,
                        quality: 100
                    }]
                },
                files: [{
                    expand: true,
                    src: ['Arrows.{gif,jpg,png}'],
                    cwd: 'images_src/',
                    dest: 'images_made/'
                }]
            }
        },
        jsbeautifier: {
            files: ['js/*.js', 'gruntfile.js'],
            options: {}
        },
        imagemin: { // Task
            dynamic: {
                options: { // Target options
                    optimizationLevel: 6,
                    svgoPlugins: [{
                        removeViewBox: false
                    }],
                    use: [imageminOptipng()]
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'images_made/', // Src matches are relative to this path
                    src: ['mute.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'images_min/' // Destination path prefix
                }]
            }
        },
        jshint: {
            all: ['gruntfile.js', 'js/*.js'],
        },
        watch: {
            scripts: {
                files: ['js/*.js', 'gruntfile.js'],
                tasks: ['jshint']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'watch']);
    grunt.registerTask('mini', ['imagemin']);
    grunt.registerTask('newpics', ['responsive_images']);
};
