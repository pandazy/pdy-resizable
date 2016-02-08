'use strict';
var del = require('del');
var config = require('../transpile-config');
module.exports = gulp=> {
    config.deployModes.forEach(
        mode => gulp.task(`clean:${mode}`,
            (cb)=>del([`${config.target}/${mode}`], cb)
        )
    );
    gulp.task('clean', config.deployModes.map(mode=>`clean:${mode}`));
};
