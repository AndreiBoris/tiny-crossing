module.exports = function( grunt ) {
  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ),
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [ {
            width: 85,
            quality: 100
          }, {
            width: 65,
            quality: 100
          }, {
            width: 50,
            quality: 100
          } ]
        },
        files: [ {
          expand: true,
          src: [ '*.{gif,jpg,png}' ],
          cwd: 'images_src/',
          dest: 'images/'
        } ]
      }
    },
    jshint: {
      all: [ 'gruntfile.js', 'js/*.js' ],
    },
    watch: {
      scripts: {
        files: [ 'js/*.js', 'gruntfile.js' ],
        tasks: [ 'jshint' ]
      }
    }

  } );

  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-responsive-images' );

  grunt.registerTask( 'default', [ 'jshint', 'watch' ] );
  grunt.registerTask( 'newpics', [ 'responsive_images' ] );
};
