import path from 'path';

import gulp from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import vinylSourceStream from 'vinyl-source-stream';

import config from './conf';

gulp.task('browserify', ()=> {
	let bundler = browserify({
		extensions: ['.js', '.jsx'],
		debug: config.watch,
		entries: [path.join(config.appDir, 'js', 'main.js')]
	});

	if (config.watch) {
		bundler = watchify(bundler, watchify.args);
		bundler.on('update', (ids)=> {
			console.log(('Watchify. Updated files ' + ids).yellow);
			return bundle();
		});
	}

	bundler.transform(babelify, {
		presets: ["es2015", "react"],
	});

	return bundle();

	function bundle() {
		return bundler.bundle()
			.on('error', error)
			.pipe(vinylSourceStream('bundle.js'))
			.pipe(gulp.dest(path.join(config.destDir, 'js')))
	}
});

function error(a) {
	console.log('Bundle ES6 error'.red, a.toString().red);
}

gulp.task('build-js', ['browserify']);
