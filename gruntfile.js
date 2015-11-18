var imageminOptipng = require('imagemin-optipng');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'css/build/style.min.css': ['stylesheets/screen.css'],
                },
            },
        },
        responsive_images: {
            dev: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 125,
                        quality: 100
                    }]
                },
                files: [{
                    expand: true,
                    src: ['Enter.{gif,jpg,png}'],
                    cwd: 'images/',
                    dest: 'images_made/'
                }]
            }
        },
        jsbeautifier: {
            files: ['js/*.js', 'gruntfile.js'],
            options: {}
        },
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    'js/build/script.min.js': ['js/resources.js', 'js/app.js', 'js/engine.js'],
                }
            }
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
                    src: ['*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'images_min/' // Destination path prefix
                }]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'stylesheets',
                    environment: 'development'
                }
            }
        },
        jshint: {
            all: ['gruntfile.js', 'js/*.js', 'js/build/scoreboard.js'],
        },
        watch: {
            css: {
                files: ['sass/*.scss'],
                tasks: ['compass', 'cssmin']
            },
            scripts: {
                files: ['js/*.js', 'gruntfile.js', 'js/build/scoreboard.js'],
                tasks: ['jshint', 'uglify']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'uglify', 'compass', 'cssmin',
        'watch'
    ]);
    grunt.registerTask('mini', ['imagemin']);
    grunt.registerTask('newpics', ['responsive_images']);
};
