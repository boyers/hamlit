module.exports = function(grunt) {
  grunt.initConfig({
    sprite: {
      dist: {
        src: 'sprites/*.png',
        dest: 'tmp/sprites.png',
        destCss: 'styles/sprites.scss',
        engine: 'pngsmith',
        algorithm: 'binary-tree',
        padding: 2,
        cssFormat: 'json',
        cssTemplate: 'config/sprites.scss.mustache'
      }
    },
    shell: {
      pngcrush: {
        command: 'pngcrush -brute tmp/sprites.png public/sprites.png'
      },
      compilehtml: {
        command: 'node tasks/compile_html.js'
      }
    },
    scsslint: {
      options: {
        config: 'config/scsslint.yml'
      },
      dist: {
        src: ['styles/*.scss']
      }
    },
    csslint: {
      dist: {
        src: ['styles/*.css']
      }
    },
    sass: {
      dist: {
        files: {
          'tmp/application.css': 'styles/application.scss' // Use the SCSS @import mechanism for multiple SCSS files.
        }
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'tmp/application.css': ['styles/vendor/*.css', 'styles/*.css', 'tmp/application.css']
        }
      }
    },
    react: {
      dist: {
        files: {
          'tmp/templates.js': ['views/*.jsx']
        }
      }
    },
    jshint: {
      dist: {
        src: ['*.js', 'tasks/*.js', 'scripts/*.js', 'tmp/templates.js']
      }
    },
    uglify: {
      dist: {
        files: {
          'tmp/application.js': ['scripts/vendor/production/*.js', 'scripts/vendor/all/*.js', 'scripts/*.js', 'tmp/templates.js']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'build/application.html': ['tmp/application.html']
        }
      }
    },
    clean: {
      before: ['build/application.html', 'styles/sprites.scss', 'public/sprites.png'],
      after: ['tmp', '.sass-cache']
    }
  });

  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['clean:before', 'sprite', 'shell:pngcrush', 'scsslint', 'csslint', 'sass', 'cssmin', 'react', 'jshint', 'uglify', 'shell:compilehtml', 'htmlmin', 'clean:after']);
};
