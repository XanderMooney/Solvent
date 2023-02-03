var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')

//#region Constants

const TEXT_DISPLAY = document.getElementById("display")

const SENSITIVITY = 0.015
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
var rawScale = DEFAULT_RAW_SCALE;

var points = null // points to draw

////#endregion initilize variables

addEventListener('resize', screenResize)

screenResize()

display("") // reset display

// Change the scale whenever the user uses the mousewheel
addEventListener('wheel', function (event) {
    
    rawScale += event.deltaY;
    
    screenResize()

    try {
        graph(true)
    }
    catch {
        // nothing, this is fine
    }
})

// two events to tell if we have the mouse pressed down
canvas.addEventListener('mousedown', function () { mousedown = true })
canvas.addEventListener('mouseup', function () { mousedown = false })

// event ran on mouse move
canvas.addEventListener('mousemove', function (event) {
    if (!mousedown) {
        return
    }

    let scaleMovement = (rawScale / DEFAULT_RAW_SCALE) * SENSITIVITY

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

// uses the aspect ratio of the users screen to make the grid out of squares
function screenResize() {
    aspectRatio = window.innerWidth / window.innerHeight

    // calculate vertical graph bounds

    yDist = rawScale

    yFrom = graphY - yDist
    yTo = graphY + yDist

    // calculate horizontal graph bounds

    xDist = rawScale * aspectRatio

    xFrom = graphX - xDist
    xTo = graphX + xDist

    //#region Calculate Line Spacing

    lineSpacing = Math.trunc((Math.trunc(xTo) - Math.trunc(xFrom)) / 10)

    let leftDigit = Math.trunc(lineSpacing / (10 ** (lineSpacing.toString().length - 1)))
    
    if (leftDigit > 5) {
        leftDigit = 5
    } else if (leftDigit > 2) {
        leftDigit = 2
    }

    lineSpacing = (10 ** (lineSpacing.toString().length - 1)) * leftDigit

    //#endregion Calculate Line Spacing

    draw()
}

// event for clicking the "home" button
function home() {
    rawScale = DEFAULT_RAW_SCALE; //reset default scale

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
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    for (let i = xFrom - (xFrom % lineSpacing); i < xTo; i += lineSpacing) {
        
        if (i != 0) {
            ctx.lineWidth = 1
            ctx.strokeStyle = '#848484'
        } else {
            ctx.lineWidth = 1.25
            ctx.strokeStyle = '#000000'
        }

        ctx.beginPath()
        ctx.moveTo(xScreenPos(i), 0)
        ctx.lineTo(xScreenPos(i), canvas.height)
        ctx.stroke()

        if (yFrom > 0) {
            ctx.font = "12px sans-serif"
            // ctx.fillRect(xScreenPos(i), canvas.height - 20, 20, 20 )
            ctx.fillText(i, xScreenPos(i), canvas.height - 20)
        }
        else if (yTo < 0) {
            ctx.font = "12px sans-serif"
            ctx.fillText(i, xScreenPos(i), 20)
        }
        else {
            ctx.font = "18px sans-serif"
            ctx.fillText(i, xScreenPos(i), yScreenPos(0))
        }
    }

    for (let i = yFrom - (yFrom % lineSpacing); i < yTo; i += lineSpacing) {
        if (i != 0) {
            ctx.lineWidth = 1
            ctx.strokeStyle = '#848484'
        } else {
            ctx.lineWidth = 1.25
            ctx.strokeStyle = '#000000'
        }

        ctx.beginPath()
        ctx.moveTo(0, yScreenPos(i))
        ctx.lineTo(canvas.width, yScreenPos(i))
        ctx.stroke()

        if (xFrom > 0) {
            ctx.font = "12px sans-serif"
            ctx.fillText(i, 20, yScreenPos(i))
        }
        else if (xTo < 0) {
            ctx.font = "12px sans-serif"
            ctx.fillText(i, canvas.width - 20, yScreenPos(i))
        }
        else {
            ctx.font = "18px sans-serif"
            ctx.fillText(i, xScreenPos(0), yScreenPos(i))
        }
    }

    drawPoints();
}

// global method to convert from our built in numbers to screen numbers
function xScreenPos(num) {
    return canvas.width * -((num - xFrom) / (xFrom - xTo))
}
// global method to convert from our built in numbers to screen numbers; the Y-axis is drawn reverse of the X-Axis
function yScreenPos(num) {
    return canvas.height * -((num - yTo) / (yTo - yFrom))
}
// easier function that uses both X and Y
function screenPos(xNum, yNum) {
    return (xScreenPos(xNum), yScreenPos(yNum))
}

function execute() {
    var input = document.getElementById("debugInput").value

    display("error parsing \"" + input + "\" ! nothing will get passed to graph()! check ur JS m8!");

    let out = Function("return " + input)

    display(out + "<br>will be sent to graph()");
}

function drawPoints() {
    if (points != null) {
        for (let i = 1; i < points.length; i++) {
            ctx.beginPath();
            ctx.strokeStyle = "dodgerBlue"
            ctx.lineWidth = 3
            ctx.moveTo(xScreenPos(points[i - 1].x), yScreenPos(points[i - 1].y))
            ctx.lineTo(xScreenPos(points[i].x), yScreenPos(points[i].y))
            ctx.stroke();
        }
    }
}

function graph(draw = true) {
    var input = document.getElementById("input").value

    var inputSplit = input.split("y=")[1].split('');

    var vars = []

    var returnValue = ""

    for (let i = 0; i < inputSplit.length; i++) {
        if (isLetter(inputSplit[i])) {
            vars.push({
                index: i,
                var: inputSplit[i]
            })
        }

        returnValue += inputSplit[i];
    }

    var params = "unused";

    for (let i = 0; i < vars.length; i++) {
        params += ", " + vars[i].var;
    }

    var assembledFunction = "function anonymous(" + params + ") { return " + returnValue + "}" + "; anonymous("
    
    //console.log(assembledFunction)

    let res = RES * rawScale;

    points = []

    for (let x = xFrom; x < xTo; x += res) {
        var out = eval(assembledFunction + "0, " + x + ")");
      
        if (out < yFrom || out > yTo) {
          continue; // dont draw points outside of the viewport
        }

        points.push({
            x: x,
            y: out
          //xScreenPos(x), yScreenPos(out)
        })
    }

    if (draw) {
        drawPoints();
    }
}

function display(text) {
    TEXT_DISPLAY.innerHTML = text
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
