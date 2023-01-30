const canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
var scale = 1, xFrom = -10, xTo = 10, yFrom = -10, yTo = 10
var mousedown = false, wasDown = false, dragging = false
var xMouse = 0, yMouse = 0
const sensitivity = 150

draw()
addEventListener('resize', draw)

// Change the scale whenever the user uses the mousewheel
addEventListener('wheel', (event) => {
    scale += event.deltaY * -0.01
})

canvas.addEventListener('mousedown', (event) => { mousedown = true })
canvas.addEventListener('mouseup', (event) => { mousedown = false })

canvas.addEventListener('mousemove', (event) => {

    if (!mousedown)
    {
        wasDown = false
        return
    } else if (!wasDown)
    {
        wasDown = true
        xMouse = window.event.clientX / sensitivity
        yMouse = window.event.clientY / sensitivity
    }

    xMouse -= window.event.clientX / sensitivity
    yMouse -= window.event.clientY / sensitivity

    xTo += xMouse
    xFrom += xMouse
    yTo += yMouse
    yFrom += yMouse

    draw()

    xMouse = window.event.clientX / sensitivity
    yMouse = window.event.clientY / sensitivity
})

// This method is called at program start and anytime the size of the window changes, redrawing the entire program onto screen.
function draw()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight 
    
    ctx.strokeStyle = '#000000'

    if (xFrom < 0 && xTo > 0)
    {
        let xZero = canvas.width * (Math.abs(xFrom) / (Math.abs(xFrom) + xTo))
        ctx.beginPath()
        ctx.moveTo(xZero, 0)
        ctx.lineTo(xZero, canvas.height)
        ctx.stroke()
    }
    if (yFrom < 0 && yTo > 0)
    {
        let yZero = canvas.height * (Math.abs(yFrom) / (Math.abs(yFrom) + yTo))
        ctx.beginPath()
        ctx.moveTo(0, yZero)
        ctx.lineTo(canvas.width, yZero)
        ctx.stroke()
    }
}