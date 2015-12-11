import gulp from 'gulp';
import path from 'path';

import Tinylr from 'tiny-lr';
import express from 'express';
import connectLivereload from 'connect-livereload';
import opn from 'opn';
import runSequence from 'run-sequence';

import config from './conf.js';

var expressSrc = path.resolve(config.destDir);

gulp.task('express', (cb) => {
	const app = express();
	app.use(connectLivereload({port: config.lrPort}));
	app.use(express.static(expressSrc));
	app.listen(config.port);
	cb();
});

let tinylr;
gulp.task('livereload', (cb) => {
	tinylr = Tinylr();
	tinylr.listen(config.lrPort);
	cb();
});

gulp.task('watch', (cb) => {
	gulp.watch([expressSrc + '/**'], notifyLiveReload);
	cb();
});

gulp.task('open', (cb) => {
	const url ='http://localhost:' + config.port + '/';
	console.log(url.yellow);
	opn(url);
	cb();
});

gulp.task('dev', function (cb) {
	config.watch = true;
	runSequence('build-js', ['express', 'livereload'], ['watch', 'open'], cb);
});

function notifyLiveReload(event) {
	console.log(('Watched files: ' + event.path).yellow);
	console.log(('Start LIVERELOAD').green);
	var fileName = path.relative(__dirname, event.path);
	tinylr.changed({
		body: {
			files: [fileName]
		}
	});
}

