module.exports = function (grunt) {
    require('load-grunt-config')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        app: {
            path: require('./bower.json').appPath || 'app',
            dist: 'dist',
            tmp: '.tmp',
            script: 'js',
            style: 'css',
            images: 'images',
            fonts: 'fonts'
        },
        clean: {
            dist: {
                files: [{
                    src: [
                        '<%=app.dist%>'
                    ]
                }]
            },
            tmp: {
                files: [{
                    dot: true,
                    src: [
                        '<%=app.tmp%>'
                    ]
                }]
            }
        },
        bowerInstall: {
            app: {
                expand: true,
                src: ['views/**/*.ejs'],
                ignorePath: '../<%=app.path%>'
            }
        },
        useminPrepare: {
            html: [
                'views/**/*.ejs'
            ],
            options: {
                root: '<%=app.path%>',
                dest: '<%=app.dist%>/<%=app.path%>'
            }
        },
        usemin: {
            html: [
                '<%=app.dist%>/**/*.ejs'
            ],
            options: {
                assetsDirs: ['<%= app.dist %>/<%= app.path %>']
            }
        },
        ngmin: {
            app: {
                files: [{
                    expand: true,
                    cwd: '<%=app.tmp%>/concat/',
                    src: '**/app.js',
                    dest: '<%=app.tmp%>/concat/'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= app.path %>/sass',
                cssDir: '<%= app.path %>/<%=app.style%>',
                generatedImagesDir: '<%= app.path %>/<%=app.images%>/generated',
                imagesDir: '<%= app.path %>/<%=app.images%>',
                javascriptsDir: '<%= app.path %>/<%=app.script%>',
                fontsDir: '<%= app.path %>/<%=app.fonts%>',
                importPath: '<%= app.path %>/bower_components',
                httpImagesPath: '/<%=app.images%>',
                httpGeneratedImagesPath: '/<%=app.images%>/generated',
                httpFontsPath: '/<%=app.fonts%>',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            server: {}
        },
        copy: {
            view: {
                files: [
                    {
                        expand: true,
                        dest: '<%= app.dist %>',
                        src: [
                            'views/**/*.ejs'
                        ],
                        filter: 'isFile'
                    }
                ]
            },
            style: {
                files: [
                    {
                        expand: true,
                        cwd: '<%=app.path%>/<%=app.style%>',
                        dest: '<%= app.tmp %>/<%=app.style%>',
                        src: [
                            '**/*.css'
                        ],
                        filter: 'isFile'
                    }
                ]
            }
        },
        cssmin: {
            style: {
                expand: true,
                cwd: '<%=app.tmp%>',
                src: ['**/*.css','!concat/**/*.css'],
                dest: '<%= app.dist %>/<%=app.path%>',
                ext: '.css'
            },
            concat: {
                expand: true,
                cwd: '<%=app.tmp%>/concat',
                src: ['**/*.css'],
                dest: '<%= app.dist %>/<%=app.path%>',
                ext: '.css'
            }
        },
        autoprefixer: {
            dev: {
                expand: true,
                cwd: '<%= app.path %>/<%=app.style%>',
                src: '**/*.css',
                dest: '<%=app.path%>/<%= app.style %>'
            },
            options: {
                browsers: ['last 3 version','ie >= 8']
            }
        },
        imagemin: {
            options: {
                optimizationLevel: 7,
                progressive: true,
                interlaced: true,
                pngquant: true
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%=app.tmp%>/img/generated',
                    src: ['**/*.{png,jpg,gif,ico}'],
                    dest: '<%=app.dist%>/<%=app.path%>/<%=app.images%>'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%=app.path%>/img',
                    src: ['**/*.{png,jpg,gif,ico}'],
                    dest: '<%=app.dist%>/<%=app.path%>/<%=app.images%>'
                }]
            }
        },
        concurrent: {
            copy: [
                "copy:view",
                "compass"
            ],
            dist: [
                "usemin",
                "imagemin"
            ],
            min: [
                "ngmin",
                "cssmin"
            ]
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= app.dist %>/<%= app.path %>/<%=app.script%>/**/*.js',
                        '<%= app.dist %>/<%= app.path %>/<%=app.style%>/**/*.css',
                        '<%= app.dist %>/<%= app.path %>/<%=app.images%>/**/*.{png,jpg,gif,ico}',
                        '<%= app.dist %>/<%= app.path %>/<%=app.fonts%>/**/*',
                        '!.*'
                    ]
                }
            }
        },
        watch: {
            bower: {
                files: ["bower.json"],
                tasks: ["bowerInstall"]
            },
            style: {
                files: ['<%= app.path %>/sass/**/*.{scss,sass}'],
                tasks: ['compass','autoprefixer']
            }
        }
    });
    grunt.registerTask("build", [
        "clean",
        "concurrent:copy",
        "autoprefixer",
        "copy:style",
        "useminPrepare",
        "concat",
        "concurrent:min",
        "uglify",
        "rev",
        "concurrent:dist",
        "clean:tmp"
    ]);
    grunt.registerTask("default", [
        "watch"
    ]);
};