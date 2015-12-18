import gulp from 'gulp';
import path    from 'path';

import config from './conf';

gulp.task('static', ['build-css'], ()=> {
	return gulp
		.src([path.join(config.markup, '/**/*.{css,png,jpg,jpeg,gif,ico,woff,ttf,eot,svg}'), path.join(config.appDir, '/**/*.{css,png,jpg,jpeg,gif,ico,woff,ttf,eot,svg,html}')])
		.pipe(gulp.dest(path.join(config.destDir)));
});
