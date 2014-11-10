module.exports = function(grunt) {
  grunt.initConfig({
    sprite: {
      dist: {
        src: 'sprites/*.png',
        destImg: 'public/assets/sprites.png',
        destCSS: 'styles/sprites.scss',
        imgPath: '/assets/sprites.png',
        engine: 'pngsmith',
        algorithm: 'binary-tree',
        padding: 2,
        cssFormat: 'json',
        cssTemplate: 'config/sprites.scss.mustache'
      }
    },
    scsslint: {
      options: {
        config: 'config/scsslint.yml'
      },
      dist: {
        src: ['styles/*.scss', 'styles/development/*.scss', 'styles/production/*.scss', '!styles/grid.scss', '!styles/sprites.scss']
      }
    },
    csslint: {
      dist: {
        src: ['styles/*.css', 'styles/development/*.css', 'styles/production/*.css', '!styles/normalize.css']
      }
    },
    sass: {
      dist: {
        files: {
          'tmp/application.css': 'styles/application.scss' // use the SCSS @import mechanism for multiple SCSS files
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'public/assets/application.css': ['tmp/application.css', 'styles/*.css', 'styles/production/*.css']
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
        src: ['*.js', 'tasks/*.js', 'scripts/*.js', 'scripts/development/*.js', 'scripts/production/*.js', 'tmp/templates.js', '!scripts/development/react.js', '!scripts/production/react.js', '!scripts/jquery-2.1.1.js']
      }
    },
    uglify: {
      dist: {
        files: {
          'public/assets/application.js': ['scripts/production/react.js', 'scripts/jquery-2.1.1.js', 'scripts/*.js', 'scripts/production/*.js', 'tmp/templates.js']
        }
      }
    },
    clean: {
      before: ['public/assets'],
      after: ['tmp', '.sass-cache']
    }
  });

  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['clean:before', 'sprite', 'scsslint', 'csslint', 'sass', 'cssmin', 'react', 'jshint', 'uglify', 'clean:after']);
};
