const canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var scale = 1, xFrom = -10, xTo = 10
var mousedown = false
var xMouse = 0, yMouse = 0
const sensitivity = 0.0225, lineGap = 20
var clientX = 0, clientY = 0
var lineSpacing = 2
var aspectRatio = 1;

screenResize()

var yFrom = -10 / aspectRatio, yTo = 10 / aspectRatio
addEventListener('resize', screenResize)

// Change the scale whenever the user uses the mousewheel
addEventListener('wheel', function (event) {
    scale += event.deltaY * -0.001
    draw()
})

canvas.addEventListener('mousedown', function () { mousedown = true })
canvas.addEventListener('mouseup', function () { mousedown = false })

canvas.addEventListener('mousemove', function (event) {
    if (!mousedown) {
        return
    }
    clientX += event.movementX
    clientY += event.movementY

    xMouse -= clientX * sensitivity
    yMouse -= clientY * sensitivity

    xTo += xMouse
    xFrom += xMouse
    // we subtract with the Y-Axis as the Y-Axis is drawn reverse of the X-Axis
    yTo -= yMouse 
    yFrom -= yMouse

    draw()

    xMouse = clientX * sensitivity
    yMouse = clientY * sensitivity
})

function screenResize() {
    aspectRatio = window.innerWidth / window.innerHeight
    yFrom = xFrom / aspectRatio, yTo = xTo / aspectRatio
    draw()
}
// This method is called at program start and anytime the lineSpacing of the window changes, redrawing the entire program onto screen.
function draw() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    lineSpacing = 2//canvas.width * scale / lineGap

    for (let i = Math.floor(xFrom) + 1; i < xTo; ++i) {
        if (i % lineSpacing != 0) {
            continue
        }
        if (i != 0) {
            ctx.lineWidth = 1
            ctx.strokeStyle = '#848484'
        } else {
            ctx.lineWidth = 2
            ctx.strokeStyle = '#000000'
        }

        ctx.beginPath()
        ctx.moveTo(xScreenPos(i), 0)
        ctx.lineTo(xScreenPos(i), canvas.height)
        ctx.stroke()

        if (yFrom > 0) {
            ctx.font = "18px serif"
            ctx.fillText(i, xScreenPos(i), canvas.height - 20)
        }
        else if (yTo < 0) {
            ctx.font = "18px serif"
            ctx.fillText(i, xScreenPos(i), 20)
        }
        else {
            ctx.font = "24px serif"
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
            ctx.lineWidth = 2
            ctx.strokeStyle = '#000000'
        }

        ctx.beginPath()
        ctx.moveTo(0, yScreenPos(i))
        ctx.lineTo(canvas.width, yScreenPos(i))
        ctx.stroke()

        if (xFrom > 0) {
            ctx.font = "18px serif"
            ctx.fillText(i, 20, yScreenPos(i))
        }
        else if (xTo < 0) {
            ctx.font = "18px serif"
            ctx.fillText(i, canvas.width - 20, yScreenPos(i))
        }
        else {
            ctx.font = "24px serif"
            ctx.fillText(i, xScreenPos(0), yScreenPos(i))
        }
    }
}

// global method to convert from our built in numbers to screen numbers
function xScreenPos(num) {
    return scale * canvas.width * (Math.abs((num - xFrom) / (xFrom - xTo)))
}
// global method to convert from our built in numbers to screen numbers; the Y-axis is drawn reverse of the X-Axis
function yScreenPos(num) {
    return scale * canvas.height * (Math.abs((num - yTo) / (yTo - yFrom)))
}
function screenPos(xNum, yNum) {
    return (xScreenPos(xNum), yScreenPos(yNum))
}
