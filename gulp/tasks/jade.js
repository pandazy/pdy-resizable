'use strict';
var config = require('../transpile-config');

var filesToWatch = [
    `${config.src}/**/*.jade`
];
var filesToTranspile = filesToWatch.concat([
    `!${config.src}/**/_*.jade`
]);

module.exports = (gulp)=> {
    config.deployModes.forEach(mode=> {
        var piper = pipeInEnv(mode);
        gulp.task(`jade:${mode}`, ()=> piper.setWatcher().buildStream());
    });

    function pipeInEnv(mode) {
        var isDebugNeeded = !!config.inEnv[mode].debug;
        var isWatchifyNeeded = !!config.inEnv[mode].watchify;
        var jade = require('gulp-jade');

        var that = {};
        that = {
            buildStream(){
                return gulp.src(filesToTranspile).pipe(jade(isDebugNeeded ? {pretty: true} : undefined))
                    .pipe(gulp.dest(config.targetPathFor[mode]))
            },
            setWatcher(){
                var log = require('gulp-util').log;
                if (!isWatchifyNeeded) return that;
                log('Started watching for Jade changes..');
                gulp.watch(filesToWatch, ()=>that.buildStream()).on('change', e=> {
                    log('Jade file changed at ', e.path);
                });
                return that;
            }
        };
        return that;
    }
};