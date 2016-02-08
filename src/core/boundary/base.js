var constants = require('../constants');
var Naming = constants.Naming;
var shallowCopy = require('../shallow-copy');

module.exports = ()=> {
    var handleWidth = {top: 5, left: 5, right: 5, bottom: 5};
    var minSize = calMinSizeBasedOnHandle(handleWidth);
    return {
        setHandleWidthAt(side, val) {
            this.__onlySetHandleWidthAt(side, val);
            minSize = calMinSizeBasedOnHandle(handleWidth);
            return this;
        },

        setAllHandleWidth(sizeOption){
            var isChanged = false;
            Object.keys(handleWidth).forEach(side=> {
                if (!sizeOption[side] || sizeOption[side] === handleWidth[side]) {
                    return;
                }
                isChanged = true;
                this.__onlySetHandleWidthAt(side, sizeOption[side]);
            });
            if (!isChanged) return;
            minSize = calMinSizeBasedOnHandle(handleWidth);
        },

        setHandleTopWidth(val){
            return this.setHandleWidthAt('top', val);
        },

        setHandleLeftWidth(val){
            return this.setHandleWidthAt('left', val);
        },

        setHandleRightWidth(val){
            return this.setHandleWidthAt('right', val);
        },

        setHandleBottomWidth(val){
            return this.setHandleWidthAt('bottom', val);
        },

        __onlySetHandleWidthAt(corner, val){
            handleWidth[corner] = parseFloat(val);
            if (handleWidth[corner] < 0) handleWidth[corner] = 0;
            return this;
        },

        __setMinSizeAt(sizeType, val){
            minSize[sizeType] = parseFloat(val);
            return this;
        },

        getHandleTopWidth(){
            return this.getHandleWidthAt('top');
        },
        getHandleLeftWidth(){
            return this.getHandleWidthAt('left');
        },
        getHandleRightWidth(){
            return this.getHandleWidthAt('right');
        },
        getHandleBottomWidth(){
            return this.getHandleWidthAt('bottom');
        },

        getHandleWidthAt(corner){
            if (!corner) return;
            return handleWidth[corner];
        },
        getMinSizeOf(sizeType){
            if (!sizeType) return;
            return minSize[sizeType];
        },
        getMinWidth(){
            return this.getMinSizeOf('width');
        },
        getMinHeight(){
            return this.getMinSizeOf('height');
        },
        readMinSize: ()=>Object.freeze(shallowCopy(minSize)),
        readHandleWidth: ()=>Object.freeze(shallowCopy(handleWidth))
    };
};

function calMinSizeBasedOnHandle(handleSize) {
    var minSize = {};
    var namingSideOf = Naming.SidesOfCoord;
    var namingSizeOf = Naming.SizeOfCoord;
    constants.Axes.forEach(coord=> {
        var size = 0;
        var sides = namingSideOf[coord];
        sides.forEach(side=>size += handleSize[side]);
        minSize[namingSizeOf[coord]] = size;
    });
    return minSize;
}