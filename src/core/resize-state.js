module.exports = ()=> {
    var lastMoveAt = {};
    var startedAt = {};

    return {
        markStartPoint(x, y){
            markStartPoint.apply(this, arguments);
            return this;
        },

        saveThisMove(x, y){
            saveThisMove.apply(this, arguments);
            return this;
        },

        saveStart(x, y) {
            this.markStartPoint(x, y);
            this.saveThisMove(x, y);
            return this;
        },

        latestMovement(x, y){
            var movement = getMovementBeforeSave(x, y);
            saveThisMove(x, y);
            return movement;
        },

        readStartPoint(){
            return Object.freeze({x: startedAt.x, y: startedAt.y});
        },

        getStartPointAt(axis){
            return startedAt[axis];
        }
    };

    function saveThisMove(x, y) {
        lastMoveAt.x = x;
        lastMoveAt.y = y;
    }

    function getMovementBeforeSave(x, y) {
        var movement = {};
        movement.x = x - lastMoveAt.x;
        movement.y = y - lastMoveAt.y;
        return movement;
    }

    function markStartPoint(x, y) {
        startedAt.x = x;
        startedAt.y = y;
    }
};