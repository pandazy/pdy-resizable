'use strict';
var gulpSequence = require('gulp-sequence'); //This can be refactored after gulp 4.0 is officially stable
var config = require('../transpile-config');
var basics = config.basics;


module.exports = gulp=> {
    var buildMapper = mode=>
        task => `${task}:${mode}`;
    gulp.task('build',
        gulpSequence(
            'clean:dist', basics.map(buildMapper('dist'))
        )
    );

    var allTasks = [
        'clean'
    ].concat(basics).concat(['browser-sync']);
    var devTasks = allTasks.map(buildMapper('dev'));

    gulp.task('serve',
        gulpSequence.apply(this, devTasks)
    );

    gulp.task('serve:dist',
        gulpSequence('build', 'browser-sync:dist'));
};
