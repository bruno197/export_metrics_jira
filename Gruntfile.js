module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
        // Task configuration goes here.
        sass: {
          dev: {
            options: {
                style: 'expanded',
                loadPath: 'node_modules'
            },
            files: {
              'static/css/style.css': 'export_metrics_jira/src/stylesheets/app.scss'
            }
          }
        },
        concat: {
          options: {
            separator: ';'
          },
          js: {
            src: ['export_metrics_jira/src/app/**/*.js'],
            dest: 'static/js/app.js'
          }
        },
        clean: {
            static: ['static/**/*', '!static/*.xml']
        },
        browserify: {
            'static/js/app.js': ['export_metrics_jira/src/app/app.js']
        },
        watch: {
            options: {livereload: true},
            js: {
                files: 'export_metrics_jira/src/app/**/*.js',
                tasks: ['browserify']
            },
            sass: {
                files: 'export_metrics_jira/src/stylesheets/**/*.scss',
                tasks: ['sass:dev']
            }
        },
        xmlpoke: {
            updateAnAttribute: {
              options: {
                xpath: '//Content',
                value: '<![CDATA[ js aqui dentro ]]>',
                valueType: 'element'
              },
              files: {
                'static/prod.xml': 'static/export-metrics.xml',
              },
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'static/js/app.min.js': ['static/js/app.js']
                }
            }
        },
        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'static/css/style.min.css': ['static/css/style.css']
            }
          }
        }
    });

  // Load plugins here.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Register tasks here.
  grunt.registerTask('default', ['sass:dev', 'browserify', 'watch']);

};