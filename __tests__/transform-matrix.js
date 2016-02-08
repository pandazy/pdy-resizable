var testLib = require('../test_lib');
var transformMatrix = require('../src/core/transform-matrix');
describe('Transform matrix', ()=> {
    var specMatrixArray = it('should get matrix array', done=> {
        testLib.test(specMatrixArray, ()=> {
            var mat = transformMatrix.calMatrixBy('', {x: 2, y: 1}, ['left']);
            expect(mat instanceof Array).toBe(true);
            expect(mat.length).toBe(6);
            expect(mat[4]).toBe(2);
            expect(mat[5]).toBe(1);

            var leftMat = transformMatrix.calMatrixBy('matrix(1, 2, 0, 6, 3, 2)', {
                x: 2, y: 1
            }, ['left']);
            expect(leftMat.length).toBe(6);
            expect(leftMat[0]).toBe(1);
            expect(leftMat[1]).toBe(2);
            expect(leftMat[2]).toBe(0);
            expect(leftMat[3]).toBe(6);
            expect(leftMat[4]).toBe(5);
            expect(leftMat[5]).toBe(2);

            var topMat = transformMatrix.calMatrixBy('matrix(1, 0, 0, 1, 3, 2)', {
                x: 2, y: 2
            }, ['top']);
            expect(topMat[5]).toBe(4);

            var topLeftMat = transformMatrix.calMatrixBy('matrix(1, 0, 0, 1, 3, 2)', {
                x: 5, y: 5
            }, ['top', 'left']);
            expect(topLeftMat[4]).toBe(8);
            expect(topLeftMat[5]).toBe(7);
        }, done, 14);
    });
});
