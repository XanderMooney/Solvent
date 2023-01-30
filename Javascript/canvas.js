const canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
var scale = 1, xFrom = -10, xTo = 10, yFrom = -10, yTo = 10
var mousedown = false, dragging = false
var xMouse = 0, yMouse = 0
const sensitivity = 150, linesToDraw = 10
var clientX = 0, clientY = 0
var size = 2
draw()
addEventListener('resize', draw)

// Change the scale whenever the user uses the mousewheel
addEventListener('wheel', function(event) {
    scale += event.deltaY * -0.01
})

canvas.addEventListener('mousedown', function() { mousedown = true })
canvas.addEventListener('mouseup', function() { mousedown = false })

canvas.addEventListener('mousemove', function(event) 
{
    if (!mousedown)
    {
        return
    } 
    clientX += event.movementX
    clientY += event.movementY

    xMouse -= clientX / sensitivity
    yMouse -= clientY / sensitivity

    xTo += xMouse
    xFrom += xMouse
    yTo += yMouse
    yFrom += yMouse

    draw()

    xMouse = clientX / sensitivity
    yMouse = clientY / sensitivity
})

// This method is called at program start and anytime the size of the window changes, redrawing the entire program onto screen.
function draw()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight 
    
    size = Math.round(Math.abs(xTo - xFrom)) / linesToDraw
    
    ctx.strokeStyle = '#000000'
    
    console.log(xTo + " " + xFrom)
    for(let i = Math.floor(xFrom); i < xTo; ++i)
    {
        if (i % size != 0)
        {
            continue
        }

        ctx.beginPath()
        ctx.moveTo(xScreenPos(i), 0)
        ctx.lineTo(xScreenPos(i), canvas.height)
        ctx.stroke()

    }
    /* if (xFrom < 0 && xTo > 0)
    {
        let xZero = xScreenPos(0)
        ctx.beginPath()
        ctx.moveTo(xZero, 0)
        ctx.lineTo(xZero, canvas.height)
        ctx.stroke()
    }
    if (yFrom < 0 && yTo > 0)
    {
        let yZero = yScreenPos(0)
        ctx.beginPath()
        ctx.moveTo(0, yZero)
        ctx.lineTo(canvas.width, yZero)
        ctx.stroke()
    } */
}

function xScreenPos(num) {
    return canvas.width * ((Math.abs(xFrom) + num)/ (Math.abs(xFrom) + Math.abs(xTo)))
}

function yScreenPos(num) {
    return canvas.height * ((Math.abs(yFrom) + num)/ (Math.abs(yFrom) + Math.abs(yTo)))
}