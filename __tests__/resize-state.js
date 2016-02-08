var testLib = require('../test_lib');
var buildMoveState = require('../src/core/resize-state');
var buildMoveStateWithEvent = require('../src/core/resize-state-with-event');
var immutableMatcher = require('../test_lib/immutableMatcher');
describe('Move State', ()=> {
    beforeEach(()=> {
        jasmine.addMatchers(immutableMatcher);
    });

    var specMarkStart = it('should mark start point', done=> {
        testLib.test(specMarkStart, ()=> {
            var moveState = buildMoveState();
            moveState.markStartPoint(0, 20);
            expect(moveState.getStartPointAt('x')).toBe(0);
            expect(moveState.getStartPointAt('y')).toBe(20);
            var point = moveState.readStartPoint();
            expect(point).toBeImmutable();
        }, done, 3);
    });

    var specSaveMovement = it('should save movement', done=> {
        testLib.test(specSaveMovement, ()=> {
            var moveState = buildMoveState();
            moveState.saveStart(0, 20);
            var movement = moveState.latestMovement(2, 5);
            expect(movement.x).toBe(2);
            expect(movement.y).toBe(-15);
        }, done, 2);
    });

    var specMarkEventStart = it('should mark start point by mouse event', done=> {
        var movementSupportPrefixes = ['', 'webkit', 'moz'];
        testLib.test(specMarkEventStart, ()=> {
            movementSupportPrefixes.forEach(prefix=> {
                buildMoveStateWithEvent.__cleanMovementSupportCache();
                var evt = {
                    clientX: 20,
                    clientY: 30
                };
                evt[`${prefix}movementX`] = 2;
                evt[`${prefix}movementY`] = 3;
                var moveState = buildMoveStateWithEvent();
                moveState.saveStart(evt);
                expect(moveState.getStartPointAt('x')).toBeUndefined();
                expect(moveState.getStartPointAt('y')).toBeUndefined();
                var movement = moveState.latestMovement(evt);
                expect(movement.x).toBe(evt[`${prefix}movementX`]);
                expect(movement.y).toBe(evt[`${prefix}movementY`]);
            });


            buildMoveStateWithEvent.__cleanMovementSupportCache();
            var ieEvt = {
                clientX: 20,
                clientY: 30
            };
            var ieMoveState = buildMoveStateWithEvent();
            ieMoveState.saveStart(ieEvt);
            expect(ieMoveState.getStartPointAt('x')).toBe(20);
            expect(ieMoveState.getStartPointAt('y')).toBe(30);
            var movement = ieMoveState.latestMovement({
                clientX: 10,
                clientY: 10
            });
            expect(movement.x).toBe(-10);
            expect(movement.y).toBe(-20);
        }, done, (movementSupportPrefixes.length + 1) * 4);
    });
});
