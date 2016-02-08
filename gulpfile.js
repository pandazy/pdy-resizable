var gulp = require('gulp');
var config = require('./gulp/transpile-config');
var basics = config.basics;
var misc = ['clean', 'browser-sync', 'groups'];
basics.concat(misc).forEach(task=> {
    require(`./gulp/tasks/${task}`)(gulp);
});

