var constants = require('../constants');
var Naming = constants.Naming;
var buildBase = require('./base');

module.exports = ()=> {
    var newBoundary = buildBase();
    newBoundary.dataOfDom = dom => {
        var rect = dom.getBoundingClientRect();
        var bound = {};
        constants.Sides.forEach(side=> {
            var handleWidth = newBoundary.getHandleWidthAt(side);
            bound[side] = [rect[side] - handleWidth, rect[side] + handleWidth];
        });
        return bound;
    };

    newBoundary.checkOfDom = function (dom) {
        var boundaryCon = this;
        var bound = Object.freeze(boundaryCon.dataOfDom(dom));
        return {
            bound: bound,
            hasMovedOutOfResizingBound: e=>module.exports.hasMovedOutOfResizingBound(e, bound),
            getResizingSides: e=>module.exports.getResizingSides(e, bound),
            getResizingRangeOf(sides){
                var resizingRange = {
                    top: Number.NEGATIVE_INFINITY,
                    right: Number.POSITIVE_INFINITY,
                    bottom: Number.POSITIVE_INFINITY,
                    left: Number.NEGATIVE_INFINITY
                };
                sides.forEach(side=> {
                    var oppoSide = Naming.OppositeSide[side];
                    var min = boundaryCon.getMinSizeOf(Naming.SizeOfSide[side]);
                    var handleWidth = boundaryCon.getHandleWidthAt(oppoSide);
                    if (Naming.SidesOfDistance.far.indexOf(side) >= 0) {
                        resizingRange[oppoSide] = bound[oppoSide][0] + handleWidth + min;
                        return;
                    }
                    resizingRange[oppoSide] = bound[oppoSide][1] - handleWidth - min;
                });
                return resizingRange;
            }
        };
    };
    return newBoundary;
};

module.exports.getResizingSides = (e, bound)=> {
    if (module.exports.hasMovedOutOfResizingBound(e, bound)) {
        return [];
    }
    var resizingSides = [];
    constants.Sides.forEach(side=> {
        var coordName = constants.Naming.CoordOfSide[side];
        var mouse = e[`client${coordName.toUpperCase()}`];
        if (mouse >= bound[side][0] && mouse <= bound[side][1]) {
            resizingSides.push(side);
        }
    });
    return resizingSides;
};

module.exports.hasMovedOutOfResizingBound = (e, bound)=> {
    return e.clientX < bound.left[0] || e.clientY < bound.top[0]
        || e.clientX > bound.right[1] || e.clientY > bound.bottom[1] ||
        e.clientX > bound.left[1] && e.clientX < bound.right[0] &&
        e.clientY > bound.top[1] && e.clientY < bound.bottom[0]
};

