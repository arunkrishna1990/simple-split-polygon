
/*
    The goal of this exercise is to take a polygon defined by the points 'points', use the mouse
    events to draw a line that will split the polygon and then draw the two split polygons.
    In the start, you'll have the initial polygon (start.png)
    While dragging the mouse, the polygon should be shown along with the line you're drawing (mouseMove.png)
    After letting go of the mouse, the polygon will be split into two along that line (mouseUp.png)

    The code provided here can be used as a starting point using plain-old-Javascript, but it's fine
    to provide a solution using react/angular/vue/etc if you prefer.
*/
const points = [
    { x: 100, y: 100 },
    { x: 200, y: 50 },
    { x: 300, y: 50 },
    { x: 400, y: 200 },
    { x: 350, y: 250 },
    { x: 200, y: 300 },
    { x: 150, y: 300 },
]

let startX1, startY1, x1, y1, currentLine;
let canDrawLine = false, isSplittingDone = false;

const onMouseDown = (event) => {
    if (!isSplittingDone) {
        startX1 = event.x;
        startY1 = event.y;
        x1 = event.x;
        y1 = event.y;
        canDrawLine = true
    }
}

const onMouseMove = (event) => {
    if (canDrawLine) {
        drawLine(x1, y1, event.x, event.y);
        x1 = event.x;
        y1 = event.y;
    }
}

const onMouseUp = (event) => {
    if (canDrawLine) {
        drawLine(x1, y1, event.x, event.y);
        x1 = event.x;
        y1 = event.y;
        canDrawLine = false;

        // Get Polygon points
        const poly1 = [];
        const poly2 = [];
        let isPartOfFirstPolygon = true;
        for (let i = 0; i < points.length; i++) {
            isPartOfFirstPolygon ? poly1.push(points[i]) : poly2.push(points[i])

            const pointIndex = (i == points.length - 1) ? 0 : i + 1;
            const intersectingPoints = getIntersectionPoints(startX1, startY1, event.x, event.y, points[i].x, points[i].y, points[pointIndex].x, points[pointIndex].y)

            if (intersectingPoints) {
                poly1.push({ x: intersectingPoints.x, y: intersectingPoints.y })
                poly2.push({ x: intersectingPoints.x, y: intersectingPoints.y })
                isPartOfFirstPolygon = !isPartOfFirstPolygon;
            }
        }

        if (poly1.length > 0 && poly2.length > 0) {
            clearAllLines();
            drawPoly(poly1, 'blue');
            drawPoly(poly2, 'green');
            isSplittingDone = true;
        }
    }
}

//An algorithm for finding interceptions of two lines can be found in https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
const getIntersectionPoints = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    const numeratorA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
    const numeratorB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));

    if (denom == 0) {
        if (numeratorA == 0 && numeratorB == 0) {
            //Line is Colinear
            return;
        }
        //Line is Parallel
        return;
    }

    const t = numeratorA / denom;
    const u = numeratorB / denom;

    const isPointFallingWithFirstLineSegment = (t >= 0) && (t <= 1);
    const isPointFallingWithSecondLineSegment = (u >= 0) && (u <= 1);
    if (isPointFallingWithFirstLineSegment
        && isPointFallingWithSecondLineSegment) {
        //Line is Intersecting
        return {
            x: x1 + (t * (x2 - x1)),
            y: y1 + (t * (y2 - y1))
        };
    }

    return;
}

//DRAW LINE
const drawLine = (x1, y1, x2, y2, color = 'red') => {
    const content = document.getElementById('content');

    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    svgLine.setAttribute('x1', x1);
    svgLine.setAttribute('y1', y1);
    svgLine.setAttribute('x2', x2);
    svgLine.setAttribute('y2', y2);
    svgLine.setAttribute('stroke', color);
    svgLine.setAttribute('class', 'line');
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('height', "500");
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('fill', 'transparent');

    svgElement.appendChild(svgLine);
    content.appendChild(svgElement);
    return svgElement;
}

const drawPoly = (points, color = 'black') => {
    if (points.length < 2) {
        console.error("Not enough points");
        return;
    }

    const content = document.getElementById('content');

    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let path = 'M' + points[0].x + ' ' + points[0].y

    for (const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);

    svgElement.setAttribute('height', "500");
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');

    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

const clearAllLines = () => {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

const reset = () => {
    clearAllLines();
    drawPoly(points);
    startX1 = undefined;
    startY1 = undefined;
    x1 = undefined;
    y1 = undefined;
    canDrawLine = false;
    isSplittingDone = false;
}

const setup = () => {
    clearAllLines();
    drawPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

window.onload = () => setup()





























