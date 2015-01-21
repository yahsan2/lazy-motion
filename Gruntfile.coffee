'use strict'

module.exports = (grunt) ->
  pkg = grunt.file.readJSON 'package.json'

  grunt.initConfig
    watch:
      coffee:
        files:
          'coffee/**/*.coffee'
        tasks:[
          'coffee'
          'notify:coffee'
        ]

      livereload:
        files:[
          'src/js/**/*.js'
          '**/*.html'
        ]
        options:
          livereload: true
        tasks: [
          'notify:livereload'
        ]

    coffee:
      compile:
        files:
          'src/js/script.js': 'coffee/**/*.coffee'
        options:
          bare: true
          join: false
          sourceMap: false
        # flatten: false

    uglify:
      script:
        files:
          'src/js/script.min.js': [
            'src/js/vendor.js'
            'src/js/script.js'
          ]

    notify:
      coffee:
        options:
          title: 'Coffee Task Complete'
          message: 'coffee finished running'
      livereload:
        options:
          title: 'livereload Task Complete'
          message: 'livereload finished running'
      min:
        options:
          title: 'min Task Complete'
          message: 'min task finished running'


  for taskName of pkg.devDependencies
    grunt.loadNpmTasks taskName if taskName.substring(0,6) == 'grunt-'



  grunt.registerTask 'default',[
    'watch'
  ]