module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            '* <%= pkg.name %>.js v<%= pkg.version %> by @fat and @mdo\n' +
            '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
            '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
            '*/\n',
        // Task configuration.
        clean: {
            gh1: ['docs/assets/<%= pkg.name %>.zip'],
            gh2: ['bootstrap', '../bootstrap-gh-pages/assets/<%= pkg.name %>.zip'],
            dist: ['bootstrap']
        },
        compress: {
            gh: {
                options: {
                    archive: '<%= pkg.name %>.zip'
                },
                expand: true,
                src: ['<%= pkg.name %>/**/*'],
                dest: 'docs/assets/'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            bootstrap: {
                src: ['js/bootstrap-transition.js', 'js/bootstrap-alert.js', 'js/bootstrap-button.js', 'js/bootstrap-carousel.js', 'js/bootstrap-collapse.js', 'js/bootstrap-dropdown.js', 'js/bootstrap-modal.js', 'js/bootstrap-tooltip.js', 'js/bootstrap-popover.js', 'js/bootstrap-scrollspy.js', 'js/bootstrap-tab.js', 'js/bootstrap-typeahead.js', 'js/bootstrap-affix.js'],
                dest: 'bootstrap/js/<%= pkg.name %>.js'
            },
            dist: {
                src: ['js/bootstrap-transition.js', 'js/bootstrap-alert.js', 'js/bootstrap-button.js', 'js/bootstrap-carousel.js', 'js/bootstrap-collapse.js', 'js/bootstrap-dropdown.js', 'js/bootstrap-modal.js', 'js/bootstrap-tooltip.js', 'js/bootstrap-popover.js', 'js/bootstrap-scrollspy.js', 'js/bootstrap-tab.js', 'js/bootstrap-typeahead.js', 'js/bootstrap-affix.js'],
                dest: 'docs/assets/js/<%= pkg.name %>.js'
            }
        },
        copy: {
            bootstrap: {
                files: [
                    {expand: true, flatten: true, src: ['img/*'], dest: 'bootstrap/img/'}
                ]
            },
            gh: {
                files: [
                    {expand: true, src: ['docs/**/*'], dest: '../bootstrap-gh-pages/'}
                ]
            },
            dist: {
                files: [
                    {expand: true, flatten: true, src: ['img/*'], dest: 'docs/assets/img/'},
                    {expand: true, flatten: true, src: ['js/*.js'], dest: 'docs/assets/js/'},
                    {expand: true, flatten: true, src: ['js/tests/vendor/jquery.js'], dest: 'docs/assets/js/'}
                ]
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
            dist: {
                command: 'node docs/build'
            },
            gh: {
                command: 'node docs/build production'
            }
        },
        recess: {
            options: {
                compile: true
            },
            bootstrap: {
                files: {
                    'bootstrap/css/bootstrap.css': ['less/bootstrap.less'],
                    'bootstrap/css/bootstrap-responsive.css': ['less/responsive.less']
                }
            },
            dist: {
                files: {
                    'docs/assets/css/bootstrap.css': ['less/bootstrap.less'],
                    'docs/assets/css/bootstrap-responsive.css': ['less/responsive.less']
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'docs/assets/js/<%= pkg.name %>.min.js'
            }
        },
        qunit: {
            files: ['js/tests/*.html']
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-recess');


    // Default task.
    grunt.registerTask('default', ['jshint', 'recess:dist', 'shell:dist', 'copy:dist', 'concat:dist', 'uglify']);

    // Test task.
    grunt.registerTask('test', ['jshint', 'qunit']);

    // Clean task.
    grunt.registerTask('cleanit', ['clean:dist']);

    // Bootstrap task.
    grunt.registerTask('bootstrap', ['concat:bootstrap', 'recess:bootstrap', 'copy:bootstrap']);

    // Travis CI task.
    grunt.registerTask('travis', ['jshint', 'qunit']);

    // Task for gh-pages 4 fat & mdo ONLY (O_O  )
    grunt.registerTask('gh-pages', ['bootstrap', 'clean:gh1', 'compress:gh', 'clean:gh2', 'shell:gh', 'copy:gh']);
};
