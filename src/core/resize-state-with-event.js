var buildMoveState = require('./resize-state');
var hasNativeMovement;
var nativeMovementPrefix = '';

module.exports = ()=> {
    var baseState = buildMoveState();
    return {
        saveStart(e){
            checkForNativeMovement(e);
            if (hasNativeMovement) return this;
            baseState.saveStart(e.clientX, e.clientY);
            return this;
        },
        latestMovement(e){
            checkForNativeMovement(e);
            if (hasNativeMovement) return getMovementFromNative(e);
            return baseState.latestMovement(e.clientX, e.clientY);
        },
        readStartPoint: baseState.readStartPoint,
        getStartPointAt: baseState.getStartPointAt
    };
};


module.exports.__cleanMovementSupportCache = ()=> {
    hasNativeMovement = undefined;
    nativeMovementPrefix = '';
};


// use Pointer Lock's movementX/Y if it supports
// see https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
// for more information
function getMovementFromNative(e) {
    var prefix = nativeMovementPrefix;
    return {
        x: e[`${prefix}movementX`] || 0,
        y: e[`${prefix}movementY`] || 0
    };
}

function checkForNativeMovement(e) {
    if (hasNativeMovement === undefined) {
        var prefixes = ['', 'webkit', 'moz'];
        for (var i = 0, pLength = prefixes.length; i < pLength; i++) {
            var prefix = prefixes[i];
            if (typeof e[`${prefix}movementX`] === 'number') {
                hasNativeMovement = true;
                nativeMovementPrefix = prefix;
                return;
            }
        }
    }
}
