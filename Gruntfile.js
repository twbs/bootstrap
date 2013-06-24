module.exports = function(grunt) {
    var jsFiles = [
        'js/transition.js',
        'js/alert.js',
        'js/button.js',
        'js/carousel.js',
        'js/collapse.js',
        'js/dropdown.js',
        'js/modal.js',
        'js/tooltip.js',
        'js/popover.js',
        'js/scrollspy.js',
        'js/tab.js',
        'js/affix.js'
    ];

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' + '* <%= pkg.name %>.js v<%= pkg.version %> by @fat and @mdo\n' + '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' + '*/\n',
        // Task configuration.
        clean: {
            dist: ['bootstrap']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            bootstrap: {
                src: jsFiles,
                dest: 'bootstrap/js/<%= pkg.name %>.js'
            }
        },
        copy: {
            bootstrap: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['fonts/*'],
                    dest: 'bootstrap/fonts/'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: ['js/*.js']
            },
            test: {
                src: ['js/tests/unit/*.js']
            }
        },
        shell: {
            test: {
                command: 'phantomjs js/tests/phantom.js "http://localhost:3000/js/tests"'
            }
        },
        recess: {
            options: {
                compile: true
            },
            bootstrap: {
                files: {
                    'bootstrap/css/bootstrap.css': ['less/bootstrap.less']
                }
            },
            min: {
                options: {
                    compress: true
                },
                files: {
                    'bootstrap/css/bootstrap.min.css': ['less/bootstrap.less']
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            bootstrap: {
                files: {
                    'bootstrap/js/<%= pkg.name %>.min.js': ['<%= concat.bootstrap.dest %>']
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        },
        watch: {
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        }
    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-recess');


    // Test task.
    grunt.registerTask('test', ['jshint', 'connect', 'shell']);

    // JS distribution task.
    grunt.registerTask('bootstrap-js', ['concat', 'uglify']);

    // CSS distribution task.
    grunt.registerTask('bootstrap-css', ['recess']);

    // Fonts distribution task.
    grunt.registerTask('bootstrap-fonts', ['copy']);

    // Full distribution task.
    grunt.registerTask('bootstrap', ['clean', 'bootstrap-fonts', 'bootstrap-css', 'bootstrap-js']);

    // Default task.
    grunt.registerTask('default', ['test', 'bootstrap']);
};