var buildWrapper = require('./wrapper');
var buildBoudnary = require('./boundary');
var transFormMatrx = require('./transform-matrix');
var buildMoveState = require('./resize-state-with-event');
var constants = require('./constants');
var Naming = constants.Naming;

module.exports = ()=> {
    var controls = {
        boundary: buildBoudnary(),
        reset(){
            this.wrapper = buildWrapper();
            this.moveState = buildMoveState();
            this.sides = [];
            return this;
        }
    };
    controls.reset();
    return {
        getResizableSidesOf(dom, e){
            var check = controls.boundary.checkOfDom(dom);
            return check.getResizingSides(e);
        },
        getBoundaryControl: ()=>controls.boundary,
        startWith(dom, e){
            controls.wrapper.release();
            controls.reset();
            var check = controls.boundary.checkOfDom(dom);
            var sides = check.getResizingSides(e);
            if (sides.length <= 0) return this;
            controls.sides = sides;
            controls.resizingRange = check.getResizingRangeOf(sides);
            controls.wrapper.grab(dom);
            controls.moveState.saveStart(e);
            return this;
        },

        end(){
            controls.wrapper.release();
        },

        move(e, onMoving){
            movingAt(controls, e, (actor, movement, computedStyle, sides)=> {
                if (sides.join(',') === 'top,left') {
                    moveNearAt(actor, movement, computedStyle, sides);
                    return;
                }
                sides.forEach(side=> {
                    if (side === 'top' || side === 'left') {
                        return moveNearAt(actor, movement, computedStyle, [side]);
                    }
                    moveFarAt(actor, movement, computedStyle, Naming.CoordOfSide[side]);
                });
                typeof onMoving === 'function' && (onMoving(movement, sides));
            });
        }
    }
};

function deselectContent() {
    var selection = document.selection || (!!window.getSelection ? window.getSelection() : undefined);
    if (!selection) return;
    var emptyMethod = selection.empty || selection.removeAllRanges || (()=> {
        });
    emptyMethod.call(selection);
}

function movingAt(controls, e, callback) {
    var wrapper = controls.wrapper;
    var resizingRange = controls.resizingRange;
    deselectContent();
    if (!wrapper.isResizing()) {
        return;
    }
    if (e.clientX < resizingRange.left || e.clientX > resizingRange.right ||
        e.clientY < resizingRange.top || e.clientY > resizingRange.bottom) {
        return;
    }

    var actor = wrapper.getActor();
    var moveState = controls.moveState;
    var movement = moveState.latestMovement(e);
    var computedStyle = window.getComputedStyle(actor, null);
    var sides = controls.sides;
    callback(actor, movement, computedStyle, sides);
}

function moveFarAt(actor, movement, computedStyle, axis) {
    var offset = movement[axis];
    moveByOffset(actor, offset, computedStyle, axis);
}

function moveNearAt(actor, movement, computedStyle, sides) {
    (sides || []).forEach(side=> {
        var axis = Naming.CoordOfSide[side];
        moveByOffset(actor, -movement[axis], computedStyle, axis);
    });
    var existedTransform = computedStyle.getPropertyValue('transform');
    actor.style.transform = transFormMatrx.calTransformValueBy(existedTransform, movement, sides);
}

function moveByOffset(actor, offset, computedStyle, axis) {
    var sizeName = Naming.SizeOfCoord[axis];
    if (offset == 0) return;
    var oldSize = parseInt(computedStyle.getPropertyValue(sizeName));
    actor.style[sizeName] = (oldSize + offset) + 'px';
}