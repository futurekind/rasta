module.exports = function(grunt) {

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        settings: grunt.file.readJSON('settings.json'),
        banner: [
            '/*!',
            '<%= pkg.name %>',
            '@version <%= pkg.version %>',
            '@date <%= grunt.template.today("yyyy-mm-dd, HH:MM") %>',
            '*/'
        ].join("\n"),

        sass: {
            options: {
                sourceMap: true
            },
            main: {
                files: {
                    '<%= settings.css.main.dist %>': '<%= settings.css.main.src %>',
                }
            }
        },

        autoprefixer: {
            all: {
                expand: true,
                flatten: true,
                src: 'dist/css/*.css',
                dest: 'dist/css'
            }
        },

        cssmin: {
            css: {
                options: {
                    banner: '<%= banner %>'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }]
            }
        },

        concat: {
            options: {
                banner: "<%= banner %>\n"
            },
            main: {
                src: ['<%= settings.css.rasta.src %>'],
                dest: '<%= settings.css.rasta.dist %>'
            },
        },

        copy: {
            webroot: {
                expand: true,
                cwd: 'src/webroot',
                src: '**',
                dest: 'dist'
            },

            rasta: {
                expand: true,
                cwd: 'src/scss/rasta/partials',
                src: '**',
                dest: 'scss/rasta/partials'
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '*',
                    base: 'dist'
                }
            }
        },

        clean: {
            dist: ['dist', 'scss'],
            build: [
                'dist/tmp',
                'dist/css/*.map', 
                'dist/css/*.css', 
                '!dist/css/*.min.css', 
                'dist/js/*.js', 
                '!dist/js/*.min.js'
            ]
        },

        assemble: {
            options: {
                flatten: true,
                layout: '<%= settings.html.layout.src %>',
                partials: '<%= settings.html.includes.src %>',
                helpers: '<%= settings.html.helper.src %>',
                data: '<%= settings.html.data.src %>'
            },

            dev: {
                src: '<%= settings.html.main.src %>',
                dest: 'dist/',
                options: {
                    usemin: false
                }
            },

            build: {
                src: '<%= settings.html.main.src %>',
                dest: 'dist/',
                options: {
                    usemin: true
                }
            }
        },

        watch: {

            scss: {
                files: '<%= settings.css.scss.src %>',
                tasks: ['sass', 'autoprefixer'],
                options: {
                    livereload: true
                }
            },

            webroot: {
                files: 'src/webroot/**',
                tasks: 'copy:webroot',
                options: {
                    livereload: true
                }
            },

            html: {
                files: '<%= settings.html.all.src %>',
                tasks: 'assemble:dev',
                options: {
                    livereload: true
                }
            },
        }

    });

    grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'cssmin', 'concat', 'copy', 'assemble:build', 'clean:build']);
    grunt.registerTask('compile', ['sass', 'autoprefixer', 'copy:webroot', 'assemble:dev']);
    grunt.registerTask('server', ['connect', 'watch']);
    grunt.registerTask('default', ['compile' ,'server']);
};
