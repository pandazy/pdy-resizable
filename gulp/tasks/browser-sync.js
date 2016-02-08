'use strict';
var config = require('../transpile-config');
var browserSync = require('browser-sync').create();

module.exports = (gulp)=> {
    config.deployModes.forEach(mode=> {
        var isBrowserSyncNeeded = !!config.inEnv[mode].browserSync;
        gulp.task(`browser-sync:${mode}`, ()=> {
            if (!isBrowserSyncNeeded) return;
            var activePath = config.targetPathFor[mode];
            browserSync.init({
                server: activePath
            });
            gulp.watch([`${activePath}/**/*.*`], browserSync.reload)
        })
    });
};
