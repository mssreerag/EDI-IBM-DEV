'use strict';

module.exports = function(grunt) {
 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less:{
      development: {
        options: {
          paths:['app/css']
        },
        files: {
          'app/css/style.css' : 'app/css/style.less',
          'app/css/print-style.css' : 'app/css/print-style.less'
        }    
      }  
    },
    watch:{
      options: {
        livereload:35727
      },
      css: {
        files:['app/css/*.less','config/*.less'],
        tasks:['less']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    }
  });

  grunt.loadNpmTasks ( 'grunt-contrib-less' );
  grunt.loadNpmTasks ( 'grunt-contrib-watch' );

  grunt.registerTask ( 'default','watch' );
 
};