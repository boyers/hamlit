module.exports = function(grunt) {
  grunt.initConfig({
    sprite: {
      dist: {
        src: 'sprites/*.png',
        destImg: 'tmp/sprites.png',
        destCSS: 'styles/sprites.scss',
        imgPath: '/assets/sprites.png',
        engine: 'pngsmith',
        algorithm: 'binary-tree',
        padding: 2,
        cssFormat: 'json',
        cssTemplate: 'config/sprites.scss.mustache'
      }
    },
    shell: {
      pngcrush: {
        command: 'mkdir public/assets && pngcrush -brute tmp/sprites.png public/assets/sprites.png'
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
      dist: {
        files: {
          'public/assets/application.css': ['styles/vendor/*.css', 'styles/*.css', 'tmp/application.css']
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
          'public/assets/application.js': ['scripts/vendor/production/*.js', 'scripts/vendor/all/*.js', 'scripts/*.js', 'tmp/templates.js']
        }
      }
    },
    clean: {
      before: ['public/assets'],
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['clean:before', 'sprite', 'shell:pngcrush', 'shell:compilehtml', 'scsslint', 'csslint', 'sass', 'cssmin', 'react', 'jshint', 'uglify', 'clean:after']);
};
