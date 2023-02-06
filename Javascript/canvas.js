const CANVAS = document.getElementById("canvas")
const CTX = CANVAS.getContext('2d')

//#region Constants

const TEXT_DISPLAY = document.getElementById("display")
const INPUT = document.getElementById("input")

const MOUSE_SENSITIVITY = 0.015
const SCROLL_SENSITIVITY = 0.01
const RES = 0.01
const DEFAULT_RAW_SCALE = 4.5

const DEFAULT_GRAPH_X = 0
const DEFAULT_GRAPH_Y = 0

//#endregion Constants

//#region initilize variables

var mousedown = false
var lineSpacing = 2

var aspectRatio = 1

var graphX = DEFAULT_GRAPH_X;
var graphY = DEFAULT_GRAPH_Y;
var graphScale = DEFAULT_RAW_SCALE;

var rawScale = DEFAULT_RAW_SCALE;

var points = null // points to draw

//#endregion initilize variables

addEventListener('resize', screenResize)

screenResize()

display("") // clear display (if this code does not run we will know, as the display has default text)

home() // run home for coord display

// Change the scale whenever the user uses the mousewheel
addEventListener('wheel', function (event) {

    rawScale += event.deltaY * SCROLL_SENSITIVITY;

    calculateGraphScale()

    screenResize()

    try {
        graph(true)
    }
    catch {
        // nothing, this is fine
    }
})

// two events to tell if we have the mouse pressed down
CANVAS.addEventListener('mousedown', function () { mousedown = true })
CANVAS.addEventListener('mouseup', function () { mousedown = false })

// event ran on mouse move
CANVAS.addEventListener('mousemove', function (event) {
    if (!mousedown) {
        return
    }

    let scaleMovement = (graphScale / DEFAULT_RAW_SCALE) * MOUSE_SENSITIVITY

    graphY += event.movementY * scaleMovement // graphx is flipped from how it'd usually be
    graphX -= event.movementX * scaleMovement

    try {
        graph(true)
    }
    catch {
        // nothing
    }

    screenResize()
})

var temp = 0;

// uses the aspect ratio of the users screen to make the grid out of squares
function screenResize() {
    CANVAS.width = window.innerWidth
    CANVAS.height = window.innerHeight

    aspectRatio = window.innerWidth / window.innerHeight

    // calculate vertical graph bounds

    yDist = graphScale

    yFrom = graphY - yDist
    yTo = graphY + yDist

    // calculate horizontal graph bounds

    xDist = graphScale * aspectRatio

    xFrom = graphX - xDist
    xTo = graphX + xDist

    //#region Calculate Line Spacing

    lineSpacing = xDist / 5

    temp = 0;
    if (!Number.isInteger(lineSpacing))
    {
        temp = lineSpacing.toString().split('.')[1].length;
        lineSpacing *= 10 ** temp
    }
    
    let leftDigit = Math.trunc(lineSpacing / (10 ** (lineSpacing.toString().length - 1)))

    if (leftDigit > 5) {
        leftDigit = 5
    } else if (leftDigit > 2) {
        leftDigit = 2
    }

    lineSpacing = Math.round((10 ** (lineSpacing.toString().length - 1)) * leftDigit) / (10 ** temp)

    //#endregion Calculate Line Spacing

    draw()
}

// event for clicking the "home" button
function home() {
    rawScale = DEFAULT_RAW_SCALE; //reset default scale

    calculateGraphScale()

    graphX = DEFAULT_GRAPH_X;
    graphY = DEFAULT_GRAPH_Y;

    screenResize()

    try {
        graph(false)
    }
    catch {
        // nothing
    }
}

// This method is called at program start and anytime the lineSpacing of the window changes, redrawing the entire program onto screen.
function draw() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    for (let i = xFrom - (xFrom % lineSpacing); i < xTo; i += lineSpacing) {

        if (i != 0) {
            CTX.lineWidth = 1
            CTX.strokeStyle = '#848484'
        } else {
            CTX.lineWidth = 1.25
            CTX.strokeStyle = '#000000'
        }

        CTX.beginPath()
        CTX.moveTo(xScreenPos(i), 0)
        CTX.lineTo(xScreenPos(i), CANVAS.height)
        CTX.stroke()

        fixed_i = fixFloat(i)

        if (yFrom > 0) {
            CTX.font = "12px sans-serif"
            CTX.fillText(fixed_i, xScreenPos(i), CANVAS.height - 20)
        }
        else if (yTo < 0) {
            CTX.font = "12px sans-serif"
            CTX.fillText(fixed_i, xScreenPos(i), 20)
        }
        else {
            CTX.font = "18px sans-serif"
            CTX.fillText(fixed_i, xScreenPos(i), yScreenPos(0))
        }
    }

    for (let i = yFrom - (yFrom % lineSpacing); i < yTo; i += lineSpacing) {
        if (i != 0) {
            CTX.lineWidth = 1
            CTX.strokeStyle = '#848484'
        } else {
            CTX.lineWidth = 1.25
            CTX.strokeStyle = '#000000'
        }

        CTX.beginPath()
        CTX.moveTo(0, yScreenPos(i))
        CTX.lineTo(CANVAS.width, yScreenPos(i))
        CTX.stroke()

        fixed_i = fixFloat(i)

        if (xFrom > 0) {
            CTX.font = "12px sans-serif"
            CTX.fillText(fixed_i, 20, yScreenPos(i))
        }
        else if (xTo < 0) {
            CTX.font = "12px sans-serif"
            CTX.fillText(fixed_i, CANVAS.width - 20, yScreenPos(i))
        }
        else {
            CTX.font = "18px sans-serif"
            CTX.fillText(fixed_i, xScreenPos(0), yScreenPos(i))
        }
    }

    display("x: " + graphX + "<br>y: " + graphY + "<br>s: " + graphScale)

    // draw existing points
    drawPoints();
}

// global method to convert from our built in numbers to screen numbers
function xScreenPos(num) {
    return CANVAS.width * -((num - xFrom) / (xFrom - xTo))
}
// global method to convert from our built in numbers to screen numbers; the Y-axis is drawn reverse of the X-Axis
function yScreenPos(num) {
    return CANVAS.height * -((num - yTo) / (yTo - yFrom))
}
// easier function that uses both X and Y
function screenPos(xNum, yNum) {
    return (xScreenPos(xNum), yScreenPos(yNum))
}

function calculateGraphScale() {
    if (rawScale < 1) {
        graphScale = 2 ** (rawScale - 1)
    } else {
        graphScale = rawScale
    }
}

function drawPoints() {
    if (points == null) {
        return; // return if points are empty
    }

    CTX.beginPath(); // begin drawing

    CTX.strokeStyle = "dodgerBlue" // blue lines
    CTX.lineWidth = 3 // wide lines

    CTX.moveTo(xScreenPos(points[0].x), yScreenPos(points[0].y)) // move to first point

    // starting at the second point, draw the entire function
    for (let i = 1; i < points.length; i++) {
        CTX.lineTo(xScreenPos(points[i].x), yScreenPos(points[i].y))
    }

    CTX.stroke();
}

function graph(graphPoints = true, restrictToViewport = false) {
    let input = INPUT.value.replace(/y=/i, "");

    input = input.replace("**", "^")

    let res = RES * graphScale;

    points = []

    if (restrictToViewport) {
        for (let x = xFrom; x < xTo; x += res) {

            let out = math.compile(input).evaluate({ x: x })

            if (out < yFrom || out > yTo) {
                continue; // dont draw points outside of the viewport
            }

            points.push({
                x: x,
                y: out
            })
        }
    }
    else {
        for (let x = xFrom; x < xTo; x += res) {
            points.push({
                x: x,
                y: math.compile(input).evaluate({ x: x })
            })
        }
    }


    if (graphPoints) {
        draw();
    }
}

function display(text) {
    TEXT_DISPLAY.innerHTML = text
}

function isLetter(str) {
    return str.match(/[a-z]/i);
}

function fixFloat(number) {
    return (parseFloat(number.toPrecision(12)));
}