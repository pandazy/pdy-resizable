var config = require('../transpile-config');

module.exports = gulp=> {
    config.deployModes.forEach(mode=> {
        gulp.task(`jsx:${mode}`, ()=> {
            return browserifyInEnv(mode).pipeWatchify().pipeCommons().getStream();
        });
    });

    function browserifyInEnv(mode) {
        var isWatchifyNeeded = !!config.inEnv[mode].watchify;
        var isDebugNeeded = !!config.inEnv[mode].debug;
        var store = {
            brow: require('browserify')(
                Object.assign(
                    getBroConfigInEnv(), getWathifyConfigInEnv()
                )
            )
        };
        store.activeBrow = store.brow;
        var that = {};
        that = {
            pipeWatchify() {
                if (!isWatchifyNeeded) return that;
                var log = require('gulp-util').log;
                log('Started watching for JSX changes...');
                store.activeBrow = store.activeBrow.on('update', files=> {
                    log('JSX file changed at ', files);
                    return that.pipeCommons();
                });
                return that;
            },
            pipeBundle() {
                var source = require('vinyl-source-stream');
                store.activeBrow = store.brow.bundle().on('error', err=> {
                    throw err;
                }).pipe(source('app.js'));
                return that;
            },
            pipeUglify() {
                if (isDebugNeeded) return that;
                var buffer = require('vinyl-buffer');
                var uglify = require('gulp-uglify');
                store.activeBrow = store.activeBrow.pipe(buffer()).pipe(uglify());
                return that;
            },
            pipeDest(){
                store.activeBrow = store.activeBrow.pipe(gulp.dest(`${config.targetPathFor[mode]}/js`));
                return that;
            },
            pipeCommons() {
                store.activeBrow = that.pipeBundle().pipeUglify().pipeDest();
                return that;
            },
            getStream(){
                return store.activeBrow;
            }
        };
        return that;


        function getBroConfigInEnv() {
            var common = {
                entries: [`${config.src}/index.js`]
            };
            return Object.assign(common, isDebugNeeded ? {
                debug: true
            } : {});
        }

        function getWathifyConfigInEnv() {
            var watchify = require('watchify');
            return isWatchifyNeeded ? {
                cache: {},
                packageCache: {},
                plugin: [watchify]
            } : {};
        }
    }
};



