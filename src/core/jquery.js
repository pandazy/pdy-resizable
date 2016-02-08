var buildResizeMove = require('./resize-move');
var constants = require('./constants');
module.exports = ($)=> {
    var moveCon = buildResizeMove();
    if (!$) return moveCon;
    $(()=> {
        $('body').on('mousemove', '.resizable', function (e) {
            var thisDom = this;
            var jqThisDom = $(this);
            var sides = moveCon.getResizableSidesOf(thisDom, e) || [];
            clearAllSideCssOf(jqThisDom, side=> {
                return sides.indexOf(side) >= 0;
            });
            sides.forEach(side=> {
                jqThisDom.addClass(`resize-${side}`);
            });
        }).on('mouseleave', '.resizable', function (e) {
            clearAllSideCssOf($(this));
            e.stopPropagation();
        }).on('mousedown', '.resizable', function (e) {
            moveCon.startWith(this, e);
            e.stopPropagation();
        });
        $(document).on('mousemove', function (e) {
            moveCon.move(e);
        }).on('mouseup', ()=> {
            moveCon.end();
        });
    });
    return moveCon;
};

function clearAllSideCssOf(jqEl, exceptFor) {
    constants.Sides.forEach(side=> {
        if (!!exceptFor && !!exceptFor(side)) return;
        jqEl.removeClass(`resize-${side}`);
    });
}
