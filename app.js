const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let wordle

const getWordle = () => {
    fetch('http://localhost:8000/word')
      .then(res => res.json())
      .then(data => {
          console.log(data)
          wordle = data.toUpperCase()
      })
      .catch(err => console.log(err))
}
getWordle()
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<<'
]
const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0 
let currentTile = 0
let isGameOver = false

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.appendChild(buttonElement)
})

guessRows.forEach((guessRow, guessRowIndex) => {
 const rowElement = document.createElement('div')
 rowElement.setAttribute('id', `guessRow-${guessRowIndex}`)
 guessRow.forEach((guess, guessIndex) => {
     const tileElement = document.createElement('div')
     tileElement.setAttribute('id', `guessRow-${guessRowIndex}-tile-${guessIndex}`)
     tileElement.classList.add('tile')
     rowElement.appendChild(tileElement)
 })
 tileDisplay.appendChild(rowElement)
})

const handleClick = (letter) => {
    if(!isGameOver) {
        if(letter === '<<') {
            deleteLetter(letter)
            console.log(guessRows)
            return
        }
        if(letter === 'ENTER'){
            checkRow()
            return
        }
        addLetter(letter)
    }
}

const addLetter = (letter) => {
   if(currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`)
    tile.textContent = letter
    guessRows[currentRow][currentTile] = letter
    tile.setAttribute('data', letter)
    currentTile++
    console.log(guessRows)
   }
}

const deleteLetter = () => {
    if(currentTile > 0) {
      currentTile--
      const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`)
      tile.textContent = ''
      guessRows[currentRow][currentTile] = ''
      tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')

    if(currentTile > 4) {
        fetch(`http://localhost:8000/check/?word=${guess}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data === 'Entry word not found'){
                showMessage("That's not a word!")
                return
            }else{
                flipTile()
                if(guess === wordle) {
                    showMessage('Your Win!!')
                    isGameOver = true
                    return
                }else{
                    if(currentRow >= 5) {
                        isGameOver = true
                        showMessage('Game Over :(')
                        return
                    }
                    if(currentRow < 5) {
                        currentRow++
                        currentTile = 0
                    }
                }
            }
        })
        .catch(err => console.log(err))
    }
}

const showMessage = (message) => {
    const messageElement =  document.createElement('p')
    messageElement.textContent = message
    messageDisplay.appendChild(messageElement)
    setTimeout(() => {
      messageDisplay.removeChild(messageElement)
    }, 2000);
}

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

const flipTile = () => {
   const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes
   let checkWordle = wordle
   const guess = []

   rowTiles.forEach(tile => {
       guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay'})
   })

   guess.forEach((guess, index) => {
       if(guess.letter === wordle[index]) {
           guess.color = 'green-overlay'
           checkWordle = checkWordle.replace(guess.letter, '')
       }
   })

   guess.forEach(guess => {
       if(checkWordle.includes(guess.letter)){
           guess.color = 'yellow-overlay'
           checkWordle = checkWordle.replace(guess.letter, '')
       }
   })


   rowTiles.forEach((tile, index) => {
      setTimeout(() => {
          tile.classList.add('flip')
          tile.classList.add(guess[index].color)
          addColorToKey(guess[index].letter, guess[index].color)
      }, 300 * index);
   })
}

// const addLetterKeydown = (e) => {
//     console.log(e.key)
//  }

// const handleKeyDown = (e) => {
//    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`)
//    tile.textContent = e.key.toUpperCase()
//    currentTile++
// }
// window.addEventListener('keydown',  handleKeyDown)