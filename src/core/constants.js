module.exports = Object.freeze({
    Axes: Object.freeze(['x', 'y']),
    Distances: Object.freeze(['far', 'near']),
    Sides: Object.freeze(['top', 'right', 'bottom', 'left']),
    Naming: Object.freeze({
        SizeOfCoord: Object.freeze({
            x: 'width',
            y: 'height',
            xFull: 'offsetWidth',
            yFull: 'offsetHeight'
        }),

        SizeOfSide: Object.freeze({
            top: 'height',
            right: 'width',
            bottom: 'height',
            left: 'width'
        }),

        CoordOfSize: Object.freeze({
            width: 'x',
            height: 'y',
            offsetWidth: 'xFull',
            offsetHeight: 'yFull'
        }),

        CoordOfSide: Object.freeze({
            top: 'y',
            right: 'x',
            bottom: 'y',
            left: 'x'
        }),

        SidesOfDistance: Object.freeze({
            near: ['top', 'left'],
            far: ['right', 'bottom']
        }),

        SidesOfCoord: Object.freeze({
            x: Object.freeze(['right', 'left']),
            y: Object.freeze(['top', 'bottom'])
        }),

        OppositeSide: Object.freeze({
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right'
        }),

        CssOfCoord: Object.freeze({
            x: 'left',
            y: 'top'
        })
    })
});