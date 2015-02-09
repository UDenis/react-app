var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    reactify = require('reactify'),
    es6ify = require('es6ify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    colors = require('colors'),
    source = require('vinyl-source-stream'),

    $ = require('gulp-load-plugins')({
        rename: {
            'gulp-6to5': 'to5',
            'gulp-rev-all': 'revall'
        }
    });


/** Config variables **/
var path = require('path'),
    tmpDir = './.tmp',
    destDir = './dist',
    appDir = './src',
    sourceMapsDir = '.',
    expressSrc = path.join(__dirname, destDir),
    port = 9000,
    lrPort = 4002,

// Allows gulp <target> --dev to be run for a non-minified output
    isDev = $.util.env.dev === true,
    isProduction = !isDev,
    tinylr;
/**********************/


function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------".bold.red.underline,
        ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
        error.message,
        error.stack,
        "----------ERROR MESSAGE END----------".bold.red.underline,
        ''
    ].join('\n'));
    this.end();
}


/** express server & lr & watch **/
gulp.task('express', function (cb) {
    var express = require('express');
    var app = express();
    console.log('start express in ' + expressSrc);
    app.use(require('connect-livereload')({port: lrPort}));
    app.use(express.static(expressSrc));
    app.listen(port);
});

gulp.task('livereload', function () {
    tinylr = require('tiny-lr')();
    tinylr.listen(lrPort);
});

gulp.task('watch', function () {
    gulp.watch([expressSrc + '/**'], notifyLiveReload);
});

function notifyLiveReload(event) {
    console.log('notifyLiveReload');

    var fileName = require('path').relative(__dirname, event.path);
    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('serve', function () {
    isDev = true;
    isProduction = false;
    gulp.start('build', 'express', 'livereload', 'watch', function () {
        require('opn')('http://localhost:' + port + '/');
    });
});
/**********************/


/** buid **/
gulp.task('build-script', function () {
    return gulp.src(path.join(appDir, 'scripts/**/*.js'))
        .pipe($.if(isDev, $.sourcemaps.init()))
        .pipe($.to5())
        .pipe($.react())
        .pipe($.if(isDev, $.sourcemaps.write(sourceMapsDir)))
        .pipe(gulp.dest(path.join(tmpDir, 'scripts')))
        .pipe($.size({title: 'Builded scripts'}));
});

gulp.task('browserify', function () {
    var entryFile = 'main.js';
    var bundler = browserify({
        entries: entryFile,
        basedir: path.join(appDir, 'scripts'),
        debug: isDev,
        insertGlobals: false
    });

    bundler.transform(reactify);
    bundler.transform(es6ify);

    var stream = bundler.bundle();
    stream.on('error', log);

    return stream.pipe(source('bundle.js'))
        .pipe($.rename('bundle.js'))
        .pipe(gulp.dest(path.join(tmpDir, 'scripts')))
        .pipe($.size({title: 'Browserifyed scripts'}))
        .on('error', log);
});

gulp.task('scripts', function (cb) {
    return runSequence('browserify', cb);
})

gulp.task('html', function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets = $.useref.assets({searchPath: ['{', tmpDir, ',', appDir, '}'].join('')});

    return gulp.src(appDir + '/*.html')
        .pipe(assets)

        .pipe(jsFilter)
        .pipe($.if(isProduction, $.uglify()))
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
        .pipe($.if(isProduction, $.csso()))
        .pipe(cssFilter.restore())

        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(destDir))
        .pipe($.size())
        .on('error', log);
});

gulp.task('rev', function () {
    return gulp.src(destDir + '/**/*.{js,css,png,jpg,jpeg,gif,ico,html,woff,ttf,eot,svg}')
        .pipe($.revall({
            transformFilename: function (file, hash) {
                var ext = path.extname(file.path);
                if (ext === '.html') {
                    return path.basename(file.path, ext) + ext;
                }
                return hash.substr(0, 8) + '.' + path.basename(file.path, ext) + ext;
            },
            prefix: ''
        }))
        .pipe(gulp.dest(destDir));
});

gulp.task('clean', require('del').bind(null, [tmpDir, destDir]));

function afterBuild(cb) {
    return function () {
        $.util.log('----------------'.green);
        $.util.log('Build finished:');
        $.util.log('IsDev:', isDev);
        $.util.log('isProduction:', isProduction);
        $.util.log('----------------'.green);
        cb.apply(this, arguments);
    }
};

gulp.task('build', function (cb) {
    runSequence('clean', ['scripts'], 'html', 'rev', afterBuild(cb));
});
/**********************/



