var Promise = require('bluebird');

module.exports = {
    test(spec, callback, done, expectedAmount){
        var forName = (spec || {}).description || '';
        console.log(`\n\n* Test of [${forName}] started ...`);
        return Promise.resolve().then(()=> {
            return callback();
        }).then(()=> {
            var passedCount = (((spec || {}).result || {}).passedExpectations || []).length;
            expect(passedCount).toBe(expectedAmount);
            logOk(`${passedCount} expectation${passedCount > 1 ? 's' : ''} passed..`);
            console.log(`* Test for [${forName}] finished ...`);
        }).finally(done);
    },
    logOk: logOk,
    logError: logError
};

function logOk(...message) {
    var args = ['\u2713'].concat(message);
    console.log(...args);
}

function logError(...message) {
    var args = ['\u00D7'].concat(message);
    console.error.apply(console, args);
}
