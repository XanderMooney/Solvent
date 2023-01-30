const canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var scale = 1, xFrom = -10, xTo = 10
var mousedown = false
var xMouse = 0, yMouse = 0
const sensitivity = 150, linesToDraw = 10
var clientX = 0, clientY = 0
var lineSpacing = 2
var aspectRatio = 1;

ctx.font = "30px Arial"
screenResize()

var yFrom = -10 / aspectRatio, yTo = 10 / aspectRatio
addEventListener('resize', screenResize)

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
    yTo += yMouse * aspectRatio
    yFrom += yMouse * aspectRatio

    draw()

    xMouse = clientX / sensitivity
    yMouse = clientY / sensitivity
})

function screenResize() {
    aspectRatio = window.innerWidth / window.innerHeight
    yFrom = xFrom / aspectRatio, yTo = xTo / aspectRatio
    draw()
}
// This method is called at program start and anytime the lineSpacing of the window changes, redrawing the entire program onto screen.
function draw()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight 
    
    lineSpacing = Math.round(Math.abs(xTo - xFrom)) / linesToDraw
    
    console.log(xTo + " " + xFrom)
    
    for(let i = Math.floor(xFrom) + 1; i < xTo; ++i)
    {
        if (i % lineSpacing != 0)
        {
            continue
        }
        i != 0 ? ctx.strokeStyle = '#848484' : ctx.strokeStyle = '#000000'

        ctx.beginPath()
        ctx.moveTo(xScreenPos(i), 0)
        ctx.lineTo(xScreenPos(i), canvas.height)
        ctx.stroke()

        if (yFrom > 0) { ctx.fillText(i, xScreenPos(i), 25) }
        else if (yTo < 0) { ctx.fillText(i, xScreenPos(i), canvas.height - 25) }
        else { ctx.fillText(i, xScreenPos(i), yScreenPos(0)) }
    }
    
    for(let i = Math.floor(yFrom) + 1; i < yTo; ++i)
    {
        if (i % lineSpacing != 0)
        {
            continue
        }
        i != 0 ? ctx.strokeStyle = '#848484' : ctx.strokeStyle = '#000000'

        ctx.beginPath()
        ctx.moveTo(0, yScreenPos(i))
        ctx.lineTo(canvas.width, yScreenPos(i))
        ctx.stroke()

        if (xFrom > 0) { ctx.fillText(i, 25, yScreenPos(i)) }
        else if (xTo < 0) { ctx.fillText(i, canvas.width - 25, yScreenPos(i)) }
        else { ctx.fillText(i, xScreenPos(0), yScreenPos(i)) }
    }
}

// global method to convert from our built in numbers to screen numbers
function xScreenPos(num) {
    return canvas.width * (Math.abs((num - xFrom) / (xFrom - xTo)))
}
// global method to convert from our built in numbers to screen numbers
function yScreenPos(num) {
    return canvas.height * (Math.abs((num - yFrom) / (yFrom - yTo)))
}
