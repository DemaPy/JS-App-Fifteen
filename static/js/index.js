const container = document.getElementById('fifteen')
const itemNodes = Array.from(container.querySelectorAll('.item'))
const countItems = 16


if (itemNodes.length !== 16) {
    throw new Error(`Should be exact ${countItems} items in HTML`)
}

itemNodes[countItems - 1].style.display = "none"

let matrix = getMatrix (
    itemNodes.map((e) => Number(e.dataset.matrixId))
);

setPosItems(matrix)

function getMatrix(array) {
    const matrix = [[],[],[],[]]
    let y =0
    let x =0

    for (let index = 0; index < array.length; index++) {
        if (x>=4) {
            y++
            x=0
        }

        matrix[y][x] = array[index]   
        x++     
    }
    return matrix
}

function setPosItems(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const value = matrix[y][x]
            const node = itemNodes[value - 1]
            setNodesStyles(node, x, y)
        }
    }
}

function setNodesStyles(node, x, y) {
    const shiftPs = 100
    node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`
}

document.getElementById('shuffle').addEventListener('click', function() {
    const shuffletArray = shuffleArray(matrix.flat())
    matrix = getMatrix(shuffletArray)
    setPosItems(matrix)
})


function shuffleArray(arr) {
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a,b) => a.sort - b.sort)
        .map(({ value }) => value)
}

const blankNumber = 16

container.addEventListener('click', (event) => {
    const buttonNode = event.target.closest('button')
    if (!buttonNode) {
        return
    }
    const buttonNumber = Number(buttonNode.dataset.matrixId)
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix)
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix)
    const isValid = isValidForSwap(buttonCoords, blankCoords)
    if (isValid) {
        swap(blankCoords, buttonCoords, matrix)
        setPosItems(matrix)
    }
})


function findCoordinatesByNumber(number, matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] ===number) {
                return {x,y}
            }
        }
    }
    return null
}

function isValidForSwap(coordinate1, coordinate2) {
    const diffX = Math.abs(coordinate1.x - coordinate2.x)
    const diffY = Math.abs(coordinate1.y - coordinate2.y)

    return(diffX === 1 || diffY === 1) && (coordinate1.x === coordinate2.x || coordinate1.y === coordinate2.y)
}

function swap(coordinate1, coordinate2, matrix) {
    const coordinate1Number = matrix[coordinate1.y][coordinate1.x]
    matrix[coordinate1.y][coordinate1.x] = matrix[coordinate2.y][coordinate2.x]
    matrix[coordinate2.y][coordinate2.x] = coordinate1Number

    if (isWon(matrix)) {
        addWonClass()
    }
}

const winFlatArr = new Array(16).fill(0).map((_item, i) => i + 1)

function isWon(matrix) {
    const flatMatrix = matrix.flat()
    for (let i = 0; i < winFlatArr.length; i++) {
        if (flatMatrix[i] !== winFlatArr[i]) {
            return false
        }
    }

    return true
}

window.addEventListener('keydown', (event) => {
    if (!event.key.includes('Arrow')) {
        return
    }

    const blankCoords = findCoordinatesByNumber(blankNumber, matrix)
    const buttonCoords = {
        x: blankCoords.x,
        y: blankCoords.y
    }

    const direction = event.key.split('Arrow')[1].toLowerCase()
    const maxIndexMatrix = matrix.length

    switch (direction) {
        case 'up':
            buttonCoords.y += 1
            break
        case 'down':
            buttonCoords.y -= 1
            break
        case 'left':
            buttonCoords.x += 1
            break
        case 'right':
            buttonCoords.x -= 1
            break
    }

    if (buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 || buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0) {
        return
    }
    
    swap(blankCoords, buttonCoords, matrix)
    setPosItems(matrix)
})

const wonClass = 'fifteenWon'
function addWonClass() {
    setTimeout(() => {
        container.classList.add(wonClass)

        setTimeout(() => {
            container.classList.remove(wonClass)
        }, 1000)
    }, 200)
}