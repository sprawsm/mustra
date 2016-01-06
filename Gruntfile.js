
module.exports = function(grunt) {

  grunt.initConfig({

    //=======================================================================
    // grunt-contrib-jade
    //
    // Compiles all .jade files from site-pages folder to HTML (partials
    // folder holds repeating page elements, which are included within .jade
    // pages. Jade files from this folder will not be compiled to HTML.)
    //
    //=======================================================================

    jade: {
      compile: {
        files: [{
          expand: true,
          flatten: true,
          cwd: '_source/', // Starting location of .jade files.
          src: ['*.jade', '!**config.jade**', '!**pagewrapper.jade**'],
          dest: '.', // Destination of compiled .html files (root).
          ext: '.html'
        }],
        options: {
          pretty: true, // Keep the .html files minified/unminified.
          basedir: "_source/partials" // Location of .jade partials.
        }
      }
    },

    //=======================================================================
    // grunt-contrib-less
    //
    // Compile .less files into css files.
    // Two tasks are defined:
    // Development task creates unminified .css file with the sourcemap.
    // Deploy task creates minified .css file.
    //=======================================================================

    less: {
      development: { // Compile unminified css.
        options: {
          // sourcemap: true, // Generate source map - This map is not available
          // at the moment.
          // banner: '/* Author: Superawesome */\n' // Banner will be added at
          // the top of the compiled file.
        },
        files: { // Dictionary of files (destination : start location).
          'assets/css/style.css': '_source/assets/less/style.less',
          'assets/css/styleguide.css': '_source/assets/less/styleguide.less'
        }
      },

      deploy: { // Compile minified css.
        options: {
          compress: true, // Css output style.
          // banner: '/* Author: Superawesome */\n' // Banner will be added at
          // the top of the compiled file.
        },
        files: { // Dictionary of files (destination : start location).
          'assets/css/style.min.css': '_source/assets/less/style.less',
          'assets/css/styleguide.css': '_source/assets/less/styleguide.less'
        }
      }
    },

    //=======================================================================
    // grunt-postcss
    //
    // Runs autoprefixing on compiled css files. Depends on autoprefixer-core
    // which provide css prefixes based on defined browser support.
    //=======================================================================

    postcss: {
      options: {
       // map: {
       //   inline: false, // save all sourcemaps as separate files
       //   annotation: 'assets/css/' // to the specified directory
       // },
        processors: [
          // autoprefixer core represents dependency package.
          require('autoprefixer-core')({browsers: '> 1%'}),
        ]
      },
      dist: {
        src: 'assets/css/*.css' // destination of css files.
      }
    },

    //=======================================================================
    // grunt-contrib-jshint
    //
    // Looks for possible errors in the javascript files.
    // jshint-stylish provide prettier console output.
    //=======================================================================

    jshint: {
      all: '_source/assets/js/components/**/*.js',
      options: {
        reporter: require('jshint-stylish'),
        eqeqeq: true, // Prohibit the use of == and != in favor of === and !==
          curly: true // Requires curly braces around blocks
        }
    },

    //=======================================================================
    // grunt-contrib-uglify
    //
    // Concatintates, minifies, and uglifies javascript files, Compiles
    // plugin(s) which are used througout theproject along with the custom
    // javascript.
    //=======================================================================

    uglify: {
      jsbase: {
        options: {
          preserveComments: 'none' // Remove unnecessary comments.
        },
        files: [{
          src: [
            // Jquery fallback (in case that cdn version is not loaded).
            '_source/assets/js/vendor/jquery/jquery-1.11.2.min.js'
          ],
          dest: 'assets/js/jquery-1.11.2.min.js'
        },
        {
          src: [
            // Modernizr (custom made).
            '_source/assets/js/vendor/modernizr/modernizr.min.js'
          ],
          dest: 'assets/js/modernizr.min.js'
        }]
      },

      js: {
        options: {
          preserveComments: 'some', // Keep the comments.
          // banner: '/* Author: Superawesome */\n' // Banner will be added at
          // the top of the compiled file.
        },
        files: [{
          src: [
            // List of plugins which are used on this project, along with
            // custom made javascript.
            // '_source/assets/js/vendor/svg-local-storage/svg-local-storage.js',
            '_source/assets/js/components/app.js'
          ],
          dest: 'assets/js/app.min.js'
        }]
      }
    },

    //=======================================================================
    // grunt-contrib-imagemin
    //
    // Optimizes images for the web (.png, .jpeg, .svg, .gif).
    //=======================================================================

    imagemin: {
      png: {
        options: {
          optimizationLevel: 3 // Compression level.
        },
        files: [{
          expand: true, // Dynamic expansion.
          cwd: '_source/assets/images/',
          src: ['**/*.png'],
          dest: 'assets/images',
          ext: '.png'
        }]
      },
      jpg: {
        options: {
        progressive: true // Lossless or progressive conversion.
        },
        files: [{
          expand: true,
          cwd: '_source/assets/images/',
          src: ['**/*.jpg'],
          dest: 'assets/images',
          ext: '.jpg'
        }]
      },
      svg: {
        plugins: [
            { removeViewBox: false },
            { removeUselessStrokeAndFill: true },
            { removeEmptyAttrs: true }
        ],
        files: [{
          expand: true,
          cwd: '_source/assets/images/',
          src: ['**/*.svg'],
          dest: 'assets/images',
          ext: '.svg'
        }]
      }
    },

    //=======================================================================
    // grunt-svgstore
    //
    // Creates an SVG sprite from _source/images/icons folder.
    //
    // Description:
    // Generated svg sprite can be found inside assets/images/icons/ folder.
    // SVG code needs to be added inside `.svg-holder class` which should be
    // placed right bellow the opening <body> tag:
    // ```
    // <div class="svg-holder"> SVG SPRITE CODE GOES HERE </div>
    // ```
    //
    // A file named svg-holder.jade should hold the svg code. This file
    // can be found inside _source/partials folder. Page which contains svg
    // icons will need to have svg-holder.jade included (via
    // `include svg-holder.jade` line).
    //
    // At the moment only modified .jade files are compiled to .html files
    // (this is enabled with grunt-newer task).
    // In order to "refresh" the content inside `.svg-holder` element across
    // other pages newer: will need to be removed from the jade task.

    // svgstore: {
    //   icons: {
    //     files: {
    //       'assets/images/icons/icons.svg': ['_source/assets/images/icons/*.svg']
    //     },
    //     options: {
    //       prefix: 'icon-', // add prefix to all icons with an unambiguous label

    //       // cleans fill, stroke, stroke-width attributes so that we can style
    //       // them from the css.
    //       cleanup: true,

    //       // write a custom function to strip the first part of the file that
    //       // Adobe Illustrator generates when exporting the artboards to SVG.
    //       convertNameToId: function(name) {
    //         return name.replace(/^\w+\_/, '');
    //       }
    //     }
    //   }
    // },

    //=======================================================================
    // grunt-contrib-watch
    //
    // Task run tasks whenever watched files change.
    // Livereload option enables browser refreshing when this task is run
    // (livereload extension needs to be enabled on your browser).
    // grunt-watch action triggers with 'grunt watch-files' which listen
    // file changes and triggers
    // certain action (in this case we are listening to the html, css,
    // javascript, image and svg files).
    //=======================================================================

    watch: {
      options: {
        livereload: true // Show changes on browser without page refreshing.
      },

      html: { // Refresh browser when there are changes in html, css or js.
        files: ['_source/**/*.jade', '_source/assets/less/**/*.less', '_source/assets/js/**/*.js'],

        // These tasks compiles html pages
        tasks: ['compile-html-jade'],

        options: {
          spawn: false,
          livereload: true
        }
      },

      css: {
        files: ['_source/assets/less/**/*.less'], // compile less files
        tasks: ['compile-css'], // run postcss tasks
        options: {
          // With combined actions we have to make correct task completion
          // order (compile css and then postcss for autoprefixing).
          spawn: false
        }
      },

      scripts: {
        // When file from _source/js folder is changed, run compile-js action
        // (uglify and jshint tasks combined).
        files: ['_source/assets/js/**/*.js'],
        tasks: ['compile-js'],
        options: {
          spawn: false
        }
      },

      imagemin: {
        // When we add, or change image from _source/images folder, imagemin
        // task is run.
        files: ['_source/assets/images/**/*.jpg', '_source/assets/images/**/*.png'],
        tasks: ['optimize-images']
      },

      // svgstore: {                               // When svg file is added, or modified from the _source/images/icons folder
      //   files: ['_source/images/icons/*.svg'],   // run svgstore task which will create new svg sprite in root/images/icons folder.
      //   tasks: ['svgstore']
      // }
    },

    //=======================================================================
    // grunt-contrib-connect
    //
    // Serves the files.
    //=======================================================================

    connect: {
      server: {
        options: {
          port: 9000,
          base: '',
          // Due to slow task completion keepalive option is enabled.
          // Grunt connect has to be run from the separate console.
          keepalive: true,
          open: {
            target: 'http://localhost:9000'
          }
        }
      }
    }

  });

  // Measures the time each task takes.
  // Does not work with grunt watch task, only separate task(s).
  require('time-grunt')(grunt);


  // Load installed plugins.
  // All installed plugins which are used in this project.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-contrib-jade');
  // Grunt-newer plugin increases task running speed.
  // Settings require only adding 'newer:' as the first argument when running
  // other tasks (see registered tasks bellow - only images for now).
  grunt.loadNpmTasks('grunt-newer');

  //Run Tasks in specific order
  // All task(s) - Runs with 'grunt' command.
  // grunt.registerTask('default', ['jade', 'uglify', 'jshint', 'less', 'postcss', 'imagemin', 'svgstore']);
  grunt.registerTask('default', ['jade', 'uglify', 'jshint', 'less', 'postcss', 'imagemin']);
  // Build html files from jade files.
  grunt.registerTask('compile-html-jade', ['jade']);
  // Compile less files (first compile less into css, and then run postcss
  // task).
  grunt.registerTask('compile-css', ['less', 'postcss']);
  // Compile main js files (first run uglify task, and then run jshint task).
  grunt.registerTask('compile-js', ['uglify:js', 'jshint']);
  // Compile base js files (fallback for older browsers). This task is already
  // built and scripts are
  // placed inside assets/js folder; grunt-watch doesn't watch for changes
  // which are defined within this task.
  grunt.registerTask('compile-js-base', ['uglify:jsbase', 'jshint']);
  // Optimize images.
  grunt.registerTask('optimize-images', ['newer:imagemin']);
  // Generate svg sprites.
  // grunt.registerTask('icons', ['svgstore']);
  // Start server.
  grunt.registerTask('server', ['connect']);


  // Main tasks :
  // 1. 'grunt server' - start server
  // 2. 'grunt watch-files' - watch file changes (tasks are defined in grunt/watch.js)
  grunt.registerTask('watch-files', ['watch']);

};
