import path from 'path'
import stylus from 'gulp-stylus'
import gulp from 'gulp'

import config from './conf';

gulp.task('css', ()=>{
	return gulp.src(config.markup + '/stylus/style.styl')
		.pipe(stylus())
		.pipe(gulp.dest(path.join(config.destDir, 'css')));
});

gulp.task('build-css', ['css']);