import gulp from 'gulp';
import del from 'del';
import path    from 'path';
import runSequence from 'run-sequence';
import colors from 'colors';

import requireDir from 'require-dir'
import config from './gulp/conf';

requireDir('./gulp');

gulp.task('clean', del.bind(null, [config.destDir]));

gulp.task('build', ['clean'], function (cb) {
	runSequence(['static', 'build-js'], cb);
});

gulp.task('serve', ['clean'], function (cb) {
	runSequence(['static','dev'], cb);
});

gulp.task('default', ['build']);


/**********************/



