var testLib = require('../test_lib');
var buildBoundary = require('../src/core/boundary');
var immutableMatcher = require('../test_lib/immutableMatcher');
var constants = require('../src/core/constants');
describe('Boundary', ()=> {
    beforeEach(()=> {
        jasmine.addMatchers(immutableMatcher);
    });

    var specDefault = it('should maintain default values as numbers for boundary', done=> {
        testLib.test(specDefault, function () {
            var boundary = buildBoundary();
            var minWidth = boundary.getMinWidth();
            var minHeight = boundary.getMinHeight();
            var handTop = boundary.getHandleTopWidth();
            var handLeft = boundary.getHandleLeftWidth();
            var handRight = boundary.getHandleRightWidth();
            var handBottom = boundary.getHandleBottomWidth();
            [minWidth, minHeight, handTop, handLeft, handRight, handBottom].forEach(num=> {
                expect((typeof num === 'number') && num > 0).toBe(true);
            });
        }, done, 6);
    });

    var specReadAndSet = it('should be able to set and read values of boundary', done=> {
        testLib.test(specReadAndSet, ()=> {
            var boundary = buildBoundary();
            boundary.setHandleTopWidth(6)
                .setHandleLeftWidth(6)
                .setHandleRightWidth(6)
                .setHandleBottomWidth(6);
            [
                boundary.getHandleTopWidth,
                boundary.getHandleLeftWidth,
                boundary.getHandleRightWidth,
                boundary.getHandleBottomWidth
            ].forEach(getter=> {
                var getResult = getter.call(boundary);
                expect(getResult).toBe(6);
            });
            expect(boundary.getMinHeight()).toBe(12);
            expect(boundary.getMinWidth()).toBe(12);
            boundary.setAllHandleWidth({
                top: 3,
                left: 5,
                right: 9,
                bottom: 8
            });
            expect(boundary.getMinHeight()).toBe(11);
            expect(boundary.getMinWidth()).toBe(14);
            [
                boundary.readHandleWidth,
                boundary.readMinSize
            ].forEach(reader=> {
                var readout = reader.call(boundary);
                var anotherReadout = reader.call(boundary);
                expect(readout).toBeImmutable();
                expect(readout !== anotherReadout).toBe(true);
            });

            var minSizeReadout = boundary.readMinSize();
            expect(boundary.getMinHeight()).toBe(minSizeReadout.height);
            expect(boundary.getMinWidth()).toBe(minSizeReadout.width);

            var handleWidthReadout = boundary.readHandleWidth();
            expect(boundary.getHandleTopWidth()).toBe(handleWidthReadout.top);
            expect(boundary.getHandleLeftWidth()).toBe(handleWidthReadout.left);
            expect(boundary.getHandleRightWidth()).toBe(handleWidthReadout.right);
            expect(boundary.getHandleBottomWidth()).toBe(handleWidthReadout.bottom);
        }, done, 18);
    });

    var specGetBoundOfDom = it('should get boundary of dom', done=> {
        var dom = document.createElement('div');
        var rect = {
            bottom: 30,
            top: 5,
            left: 20,
            right: 100
        };
        dom.offsetWidth = 300;
        dom.offsetHeight = 10;
        spyOn(dom, 'getBoundingClientRect').and.callFake(()=> {
            return rect;
        });
        testLib.test(specGetBoundOfDom, ()=> {
            var boundaryCon = buildBoundary();
            var bound = boundaryCon.dataOfDom(dom);
            expect(bound.left[0]).toBe(rect.left - boundaryCon.getHandleLeftWidth());
            expect(bound.top[0]).toBe(rect.top - boundaryCon.getHandleTopWidth());
            expect(bound.left[1]).toBe(rect.left + boundaryCon.getHandleLeftWidth());
            expect(bound.top[1]).toBe(rect.top + boundaryCon.getHandleTopWidth());
            expect(bound.right[0]).toBe(rect.right - boundaryCon.getHandleRightWidth());
            expect(bound.bottom[0]).toBe(rect.bottom - boundaryCon.getHandleBottomWidth());
            expect(bound.right[1]).toBe(rect.right + boundaryCon.getHandleRightWidth());
            expect(bound.bottom[1]).toBe(rect.bottom + boundaryCon.getHandleBottomWidth());
        }, done, 8);
    });

    var specOutOfBound = it('should detect if element moved out of bound', done=> {
        testLib.test(specOutOfBound, ()=> {
            var boundaryCon = buildBoundary();
            boundaryCon.setAllHandleWidth({
                top: 3,
                left: 3,
                right: 3,
                bottom: 3
            });

            var dom = document.createElement('div');
            var rect = {
                top: 31,
                left: 21,
                right: 100,
                bottom: 200
            };

            spyOn(dom, 'getBoundingClientRect').and.callFake(()=> {
                return rect;
            });

            var boundCheck = boundaryCon.checkOfDom(dom);
            var groups = {
                insides: [
                    [22, 40, ['left'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: 94,
                        bottom: Number.POSITIVE_INFINITY,
                        left: Number.NEGATIVE_INFINITY
                    }], [19, 40, ['left'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: 94,
                        bottom: Number.POSITIVE_INFINITY,
                        left: Number.NEGATIVE_INFINITY
                    }],
                    [40, 33, ['top'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: Number.POSITIVE_INFINITY,
                        bottom: 194,
                        left: Number.NEGATIVE_INFINITY
                    }], [40, 29, ['top'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: Number.POSITIVE_INFINITY,
                        bottom: 194,
                        left: Number.NEGATIVE_INFINITY
                    }],
                    [102, 50, ['right'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: Number.POSITIVE_INFINITY,
                        bottom: Number.POSITIVE_INFINITY,
                        left: 27
                    }], [99, 50, ['right'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: Number.POSITIVE_INFINITY,
                        bottom: Number.POSITIVE_INFINITY,
                        left: 27
                    }],
                    [50, 199, ['bottom'], {
                        top: 37,
                        right: Number.POSITIVE_INFINITY,
                        bottom: Number.POSITIVE_INFINITY,
                        left: Number.NEGATIVE_INFINITY
                    }], [50, 201, ['bottom'], {
                        top: 37,
                        right: Number.POSITIVE_INFINITY,
                        bottom: Number.POSITIVE_INFINITY,
                        left: Number.NEGATIVE_INFINITY
                    }],
                    [20, 30, ['top', 'left'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: 94,
                        bottom: 194,
                        left: Number.NEGATIVE_INFINITY
                    }], [100, 30, ['top', 'right'], {
                        top: Number.NEGATIVE_INFINITY,
                        right: Number.POSITIVE_INFINITY,
                        bottom: 194,
                        left: 27
                    }],
                    [20, 200, ['bottom', 'left'], {
                        top: 37,
                        right: 94,
                        bottom: Number.POSITIVE_INFINITY,
                        left: Number.NEGATIVE_INFINITY
                    }], [100, 200, ['right', 'bottom'], {
                        top: 37,
                        right: Number.POSITIVE_INFINITY,
                        bottom: Number.POSITIVE_INFINITY,
                        left: 27
                    }]
                ],
                outsides: [
                    [10, 50], [105, 50],
                    [28, 50], [90, 50],
                    [50, 25], [50, 210],
                    [50, 40], [50, 150]
                ]
            };

            groups.insides.forEach(pair=> {
                var evt = {
                    clientX: pair[0],
                    clientY: pair[1]
                };
                expect(boundCheck.hasMovedOutOfResizingBound(evt)).toBe(false);
                expect(boundCheck.getResizingSides(evt).join('')).toBe(pair[2].join(''));
                constants.Sides.forEach(side=> {
                    expect(boundCheck.getResizingRangeOf(pair[2])[side]).toBe(pair[3][side]);
                });
            });

            groups.outsides.forEach(pair=> {
                var evt = {
                    clientX: pair[0],
                    clientY: pair[1]
                };
                expect(boundCheck.hasMovedOutOfResizingBound(evt)).toBe(true);
                expect(boundCheck.getResizingSides(evt).length).toBe(0);
            });
        }, done, 88);
    });
});
