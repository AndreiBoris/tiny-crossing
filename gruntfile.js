module.exports = function( grunt ) {
  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ),
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

  grunt.registerTask( 'default', [ 'jshint', 'watch' ] );
};
