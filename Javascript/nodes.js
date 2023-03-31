// This file handles adding dots, lines, and other conditions

let storedPosX = 0;
let storedPosY = 0;
var ctx = document.getElementById('canvas').getContext('2d')

// #region Pop up
let popUp = document.getElementById('pop-up')
popUp.style.opacity = 0;
document.getElementById('body').appendChild(popUp)

// document.addEventListener('mousedown', function () { 
//     Object.assign(popUp.style, {
//         left: '-100rem'
//     }) 
// })

document.addEventListener('contextmenu', function (e) {
    e.preventDefault()

    storedPosX = e.clientX
    storedPosY = e.clientY

    Object.assign(popUp.style, {
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        display: `block`,
        opacity: 1
    });
})
// #endregion
function createDot() {

    drawCircle(storedPosX, storedPosY, 5)
} 

function drawCircle(x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)

    ctx.fillStyle = 'black'
    ctx.fill()
  }