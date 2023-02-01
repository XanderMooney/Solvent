const canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')

const sensitivity = 0.015

var scale = 1, xFrom = -10, xTo = 10
var mousedown = false
var xMouse = 0, yMouse = 0
var clientX = 0, clientY = 0
var lineSpacing = 2
var aspectRatio = 1;

screenResize()

var yFrom = -10 / aspectRatio, yTo = 10 / aspectRatio
addEventListener('resize', screenResize)

var localScale = 1;

const SCALAR = 75

var calculatedScale = 1; // default scale is 20/20

// Change the scale whenever the user uses the mousewheel
addEventListener('wheel', function (event) {
    localScale += event.deltaY
    
    scale = localScale / 1000

    var deltaY = event.deltaY;

    if (event.deltaY < 0) { // scrolling in
        xTo += event.deltaY / SCALAR;
        xFrom -= event.deltaY / SCALAR;
    }
    else { // scrolling out
        xTo += event.deltaY / SCALAR;
        xFrom -= event.deltaY / SCALAR;
    }

    calculatedScale = Math.abs(xTo - xFrom) / 20; // always calculate so other functions can use

    screenResize()
})

// two events to tell if we have the mouse pressed down
canvas.addEventListener('mousedown', function () { mousedown = true })
canvas.addEventListener('mouseup', function () { mousedown = false })

// event ran on mouse move
canvas.addEventListener('mousemove', function (event) {
    if (!mousedown) {
        return
    }

    clientX += event.movementX
    clientY += event.movementY

    xMouse -= clientX * sensitivity
    yMouse -= clientY * sensitivity

    // multiply by calculatedScale so we still move at a consistent pace nomatter how big or small the grid is
    xTo += xMouse * Math.abs(calculatedScale)
    xFrom += xMouse * Math.abs(calculatedScale)
    // we subtract with the Y-Axis as the Y-Axis is drawn reverse of the X-Axis
    yTo -= yMouse * Math.abs(calculatedScale)
    yFrom -= yMouse * Math.abs(calculatedScale)

    draw()

    // set the mouse position for next frame
    xMouse = clientX * sensitivity
    yMouse = clientY * sensitivity
})

// uses the aspect ratio of the users screen to make the grid out of squares
function screenResize() {
    aspectRatio = window.innerWidth / window.innerHeight
    yFrom = xFrom / aspectRatio, yTo = xTo / aspectRatio
    draw()
}
// This method is called at program start and anytime the lineSpacing of the window changes, redrawing the entire program onto screen.
function draw() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    lineSpacing = Math.floor((Math.floor(xTo) - Math.floor(xFrom)) / 10)
  
    console.log(lineSpacing)

    while (lineSpacing % 5 != 0 && lineSpacing != 2 && lineSpacing != 1)
    {
        --lineSpacing
    }

    for (let i = Math.floor(xFrom) + 1; i < xTo; ++i) {
        if (i % lineSpacing != 0) {
            continue
        }
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
            ctx.font = "18px sans-serif"
           // ctx.fillRect(xScreenPos(i), canvas.height - 20, 20, 20 )
            ctx.fillText(i, xScreenPos(i), canvas.height - 20)
        }
        else if (yTo < 0) {
            ctx.font = "18px sans-serif"
            ctx.fillText(i, xScreenPos(i), 20)
        }
        else {
            ctx.font = "24px sans-serif"
            ctx.fillText(i, xScreenPos(i), yScreenPos(0))
        }
    }
    for (let i = Math.floor(yFrom) + 1; i < yTo; ++i) {
        if (i % lineSpacing != 0) {
            continue
        }
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
            ctx.font = "18px sans-serif"
            ctx.fillText(i, 20, yScreenPos(i))
        }
        else if (xTo < 0) {
            ctx.font = "18px sans-serif"
            ctx.fillText(i, canvas.width - 20, yScreenPos(i))
        }
        else {
            ctx.font = "24px sans-serif"
            ctx.fillText(i, xScreenPos(0), yScreenPos(i))
        }
    }
}

// global method to convert from our built in numbers to screen numbers
function xScreenPos(num) {
    return canvas.width * (Math.abs((num - xFrom) / (xFrom - xTo)))
}
// global method to convert from our built in numbers to screen numbers; the Y-axis is drawn reverse of the X-Axis
function yScreenPos(num) {
    return canvas.height * (Math.abs((num - yTo) / (yTo - yFrom)))
}
// easier function that uses both X and Y
function screenPos(xNum, yNum) {
    return (xScreenPos(xNum), yScreenPos(yNum))
}
