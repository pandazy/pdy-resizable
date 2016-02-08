var testLib = require('../test_lib');
var constants = require('../src/core/constants');
var immutableMatcher = require('../test_lib/immutableMatcher');
describe('Constants', ()=> {
    beforeEach(function () {
        jasmine.addMatchers(immutableMatcher);
    });

    var specRequiredTypes = it('should return required types of constants', function (done) {
        testLib.test(specRequiredTypes, ()=> {
            expect(constants.Axes instanceof Array).toBe(true);
            expect(constants.Distances instanceof Array).toBe(true);
            expect(constants.Naming instanceof Object).toBe(true);
            expect(constants.Sides instanceof Array).toBe(true);
        }, done, 4);
    });

    var specImmutability = it('should return immutable constants', function (done) {
        testLib.test(specImmutability, ()=> {
            Object.keys(constants).forEach(prop=> {
                expect(prop).toBeImmutable();
            });
            expect(constants).toBeImmutable();
        }, done, 5);
    });
});
