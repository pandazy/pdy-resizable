var config = require('../../transpile-config');
var sassTypesToWatch = [
    `${config.src}/**/*.scss`,
    `${config.src}/**/*.sass`
];
var sassTypesToTranspile = sassTypesToWatch.concat([
    `!${config.src}/**/_*.scss`,
    `!${config.src}/**/_*.sass`
]);

module.exports = gulp=> {
    config.deployModes.forEach(mode=> {
        gulp.task(`sass:${mode}`, ()=> {
            var mainPiper = transPileSassInEnv(mode);
            setWatcherInEnv(mode);
            return mainPiper.getActiveStream();
        });
    });

    function transPileSassInEnv(mode) {
        return sourceSassInEnv(mode)
            .pipeSourcemapsInit()
            .pipeSass()
            .pipeSourmapsWrite()
            .pipeDest();
    }

    function sourceSassInEnv(mode) {
        var sourcemaps = require('gulp-sourcemaps');
        var store = {
            wrappedStream: gulp.src(sassTypesToTranspile)
        };
        var isDebugNeeded = !!config.inEnv[mode].debug;
        var that = {};
        that = {
            pipeSourcemapsInit() {
                if (!isDebugNeeded) return that;
                store.wrappedStream = store.wrappedStream.pipe(sourcemaps.init());
                return that;
            },
            pipeSass() {
                var sass = require('gulp-sass');
                store.wrappedStream = store.wrappedStream.pipe(
                    sass(isDebugNeeded ? undefined : {
                        outputStyle: 'compressed'
                    })
                );
                return that;
            },
            pipeSourmapsWrite() {
                if (!isDebugNeeded) return that;
                store.wrappedStream = store.wrappedStream.pipe(sourcemaps.write());
                return that;
            },
            pipeDest() {
                store.wrappedStream = store.wrappedStream.pipe(
                    gulp.dest(`${config.targetPathFor[mode]}/css`)
                );
                return that;
            },
            getActiveStream(){
                return store.wrappedStream;
            }
        };
        return that;
    }

    function setWatcherInEnv(mode) {
        var isWatchifyNeeded = config.inEnv[mode].watchify;
        if (!isWatchifyNeeded) return;
        var log = require('gulp-util').log;
        log('Started watching for Sass changes...');
        return gulp.watch(sassTypesToWatch, ()=> {
            transPileSassInEnv(mode);
        }).on('change', e=> {
            log('Sass file changed at ', e.path);
        });
    }
};


