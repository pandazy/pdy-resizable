module.exports = {
    calMatrixBy(transform, movement, sides) {
        var matrix = parseTransformMatrixFrom(transform);
        var mLength = matrix.length;
        if (mLength !== 6 && mLength !== 16) return [1, 0, 0, 1, movement.x, movement.y];
        var startingAt = mLength === 6 ? -2 : -4;
        var endingAt = mLength === 6 ? mLength : mLength - 2;
        var translates = matrix.slice(startingAt, endingAt);
        translates[0] = translates[0] + (sides.indexOf('left') >= 0 ? movement.x : 0);
        translates[1] = translates[1] + (sides.indexOf('top') >= 0 ? movement.y : 0);
        matrix.splice(startingAt, 2, ...translates);
        return matrix;
    },
    calTransformValueBy(transform, movement, sides){
        var matrix = this.calMatrixBy(transform, movement, sides);
        if (matrix.length <= 2) return `translate(${matrix[0]}px, ${matrix[1]}px)`;
        return `${(matrix.length === 6 ? 'matrix' : 'matrix3d')}(${matrix.join(', ')})`;
    }
};

function getTransformMatrixBy(transform, pattern) {
    return ((transform.match(pattern) || [])[1] || '').split(', ').map(str=>parseFloat(str));
}

function parseTransformMatrixFrom(transformValue) {
    var transform = transformValue || '';
    if (transform.length <= 0 || !/matrix/i.test(transform)) return [];
    var matrix3dPatternStr = '(?:matrix3d\\()([^\\(\\)]*)(?:\\))';
    if (/3d/i.test(transformValue || '')) {
        return getTransformMatrixBy(transform, new RegExp(matrix3dPatternStr, 'i'));
    }
    var matrixPatternStr = matrix3dPatternStr.replace(/3d/g, '');
    return getTransformMatrixBy(transform, new RegExp(matrixPatternStr, 'i'));
}
