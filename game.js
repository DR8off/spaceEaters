// Space Eaters v1.0.0 - the JavaScrit videogame!
// #License
// GNU General Public License

// Hi! This is my silly project, or rather, my first game in JavaScript. The code may look a bit messy.
// You can do whatever you want with this, but please adhere to the license.
// This version can contain visual bugs.
// Visit my website (https://dr8off.github.io/portfolio/) to find more of my projects.
// By DR8 (https://github.com/DR8off) 

// Game Area
const gameArea = document.querySelector('.area')

// Game Settings
let sounds = true
let playerCanShoot = false

// LvlData *******************************************************************************
let currentLevel = 1
let enemiesSpeed = 2000

function handleEndAndStartLvl() {
    hideGameHood()
    playerCanShoot = false
    const endLvlModal = document.createElement('h1')
    endLvlModal.textContent = `Level ${currentLevel} clear!`
    endLvlModal.classList.add('lvlEndText')
    gameArea.appendChild(endLvlModal)
    if (sounds) {
        levelClearDefault.play()
    }

    setTimeout(() => {
        gameArea.removeChild(endLvlModal)
    }, 6000)

    setTimeout(() => {
        currentLevel++
        document.querySelector('.hood-top-level').textContent = `Lvl ${currentLevel}`
        const startLvlModal = document.createElement('h1')
        startLvlModal.textContent = `Level ${currentLevel}`
        startLvlModal.classList.add('lvlStartText')
        gameArea.appendChild(startLvlModal)
    }, 7000)
    setTimeout(() => {
        const startLvlModal = document.querySelector('.lvlStartText')
        gameArea.removeChild(startLvlModal)

        // Creating enemies
        generateLvlEnemyCount()
        levelEnemies.forEach((enemy, index) => {
            createEnemy(enemy, index)
        })
        enemiesAI()
        isAllEnemiesAlive = true
        playerCanShoot = true
        showGameHood()
    }, 13000)
}
function startGame() {
    handleResetGame()

    const startLvlModal = document.createElement('h1')
    startLvlModal.textContent = `Level ${currentLevel}`
    startLvlModal.classList.add('lvlStartText')
    gameArea.appendChild(startLvlModal)

    setTimeout(() => {
        const startLvlModal = document.querySelector('.lvlStartText')
        gameArea.removeChild(startLvlModal)

        // Creating enemies
        generateLvlEnemyCount()
        levelEnemies.forEach((enemy, index) => {
            createEnemy(enemy, index)
        })
        enemiesAI()
        isAllEnemiesAlive = true
        playerCanShoot = true
        showGameHood()
    }, 6000)
}
function handleResetGame() {
    hideGameOverScreen()
    hideGameHood()
    playerCanShoot = false
    playerInfo.hp = 100
    document.querySelector('progress').value = playerInfo.hp
    const gameScreen = document.querySelector('.gameScreen')
    gameScreen.style.display = 'none'
}

// Applying function to play again button on the endgame screen
document.querySelector('.playAgain-button').addEventListener('click', startGame)

// Starting game
const startButton = document.querySelector('.startGame-button')
startButton.addEventListener('click', startGame)

// Sounds ********************************************************************************
const music = new Audio('sounds/ost.mp3')
const levelClearDefault = new Audio('sounds/levelClear_default.mp3')
const playerShootDefault = new Audio('sounds/playerShoot_default.mp3')
const enemyDeath = new Audio('sounds/playerShoot_default.mp3')
const enemyShootDefault = new Audio('sounds/enemyShoot_default.mp3')
const enemyDeathDefault = new Audio('sounds/enemyDeath_default.mp3')

// Player ********************************************************************************
function showGameOverScreen() {
    const gameOverScreen = document.querySelector('.gameOverScreen')
    // showing screen
    gameOverScreen.style.display = 'flex'
}
function hideGameOverScreen() {
    const gameOverScreen = document.querySelector('.gameOverScreen')
    // hiding screen
    gameOverScreen.style.display = 'none'
}
function createGameHood() {
    // Level
    const currentLevelHood = document.querySelector('.hood-top-level')
    currentLevelHood.textContent = `Lvl ${currentLevel}`

    // Menu
    const menuHood = document.querySelector('.hood-top-menu')

    const soundButton = document.createElement('div')
    soundButton.style.cursor = 'pointer'
    soundButton.textContent = sounds ? 'Mute sounds' : 'Unmute sounds'
    soundButton.addEventListener('click', () => {
        sounds = sounds ? false : true
        soundButton.textContent = sounds ? 'Mute sounds' : 'Unmute sounds'
    })
    menuHood.appendChild(soundButton)

    // Controls
    const arrows = ['a','s','d']
    const arrowsDOM = []
    const container = document.querySelector('.hood-bottom-arrows')

    const arrowsTop = document.createElement('div')
    const arrowW = document.createElement('div')
    arrowW.textContent = 'W'
    arrowW.classList.add('button')
    arrowW.classList.add('arrow-w')
    arrowsTop.appendChild(arrowW)
    arrowsDOM.push(arrowW)
    
    const arrowsBottom = document.createElement('div')
    arrowsBottom.style.display = 'flex'
    arrows.forEach(arrow => {
        const arrowDOM = document.createElement('div')
        arrowDOM.textContent = arrow.toUpperCase()
        arrowDOM.classList.add('button')
        arrowDOM.classList.add(`arrow-${arrow}`)
        arrowsBottom.appendChild(arrowDOM)
    })

    const spaceBarContainer = document.querySelector('.hood-bottom-space')
    const spacebar = document.createElement('div')
    spacebar.classList.add('button')
    spacebar.classList.add('spacebar')

    spacebar.style.setProperty('width', '10rem', 'important')
    
    spaceBarContainer.appendChild(spacebar)
    container.appendChild(arrowsTop)
    container.appendChild(arrowsBottom)

    // Observing keydowns
    document.addEventListener('keydown', (e) => {
        const pressedArrow = document.querySelector(`.arrow-${e.key}`)
        if (pressedArrow) {
            pressedArrow.classList.add('button-active')
        }
        if (e.keyCode === 32) {
            const spacebar = document.querySelector('.spacebar')
            spacebar.classList.add('button-active')
        }
    })
    document.addEventListener('keyup', (e) => {
        const pressedArrow = document.querySelector(`.arrow-${e.key}`)
        if (pressedArrow) {
            pressedArrow.classList.remove('button-active')
        }
        if (e.keyCode === 32) {
            const spacebar = document.querySelector('.spacebar')
            spacebar.classList.remove('button-active')
        }
    })
     
}
createGameHood()
function hideGameHood() {
    const gameHood = document.querySelector('.hood')
    gameHood.style.opacity = 0
    gameHood.style.pointerEvents = 'none'
}
function showGameHood() {
    const gameHood = document.querySelector('.hood')
    gameHood.style.opacity = 1
    gameHood.style.pointerEvents = 'all' 
}   

const playerInfo = {
    playerX: gameArea.offsetWidth / 2,
    playerY: gameArea.offsetHeight / 2,
    hp: 100,
    damage: 10,
    speed: 10,
    bulletSpeed: 1,
    sprite: 'assets/player_default.png',
    bulletSprite: 'assets/playerBullet_default.png'
}
// debugging the screen recycle so as not to lose the player
window.addEventListener('resize', () => {
    playerInfo.playerX = gameArea.offsetWidth / 2,
    playerInfo.playerY = gameArea.offsetHeight / 2
})
function createPlayer() {
    const player = document.createElement('div')
    const playerSprite = document.createElement('img')

    player.classList.add('player')
    playerSprite.src = playerInfo.sprite
    player.style.transform = `translate(${playerInfo.playerX}px, ${playerInfo.playerY}px)`

    const playerHpBar = document.createElement('progress')
    playerHpBar.max = 100
    playerHpBar.value = playerInfo.hp
    playerHpBar.style.position = 'absolute'
    playerHpBar.style.left = '50%'
    playerHpBar.style.transform = 'translateX(-50%)'
    playerHpBar.style.bottom = '-1rem'
    playerHpBar.style.width = '5rem'

    player.appendChild(playerHpBar)
    player.appendChild(playerSprite)
    gameArea.appendChild(player)    
}
createPlayer()

const bulletsQueue = []
function createPlayerBullet() {
    const bullet = document.createElement('div')
    bullet.classList.add('bullet')
    const bulletSprite = document.createElement('img')

    bullet.style.transition = playerInfo.bulletSpeed + 's'
    bullet.style.transform = `translate(${playerInfo.playerX+14}px, ${playerInfo.playerY-40}px)`
    bulletSprite.src = playerInfo.bulletSprite
    bullet.append(bulletSprite)
    const timeoutId1 = setTimeout(() => {
        bullet.style.transform = `translate(${playerInfo.playerX+14}px, -100vh)`
    }, 10)

    gameArea.appendChild(bullet)
    bulletsQueue.push(bullet)
    
    if (sounds) {
        playerShootDefault.play()
    }

    // Observing enemy hit
    const timeoutId3 = setTimeout(() => {
        levelEnemies = levelEnemies.map((enemy, index) => {
            if (Math.abs(playerInfo.playerX - enemy.enemyX) <= 40) {
                if (enemy.hp - playerInfo.damage <= 0) {
                    const domEnemy = document.querySelector(`.enemy-${index}`)
                    if (domEnemy) {
                        const enemySprite = domEnemy.querySelector('img')
                        enemySprite.src = 'assets/enemy_explosion.gif'

                        if (sounds) {
                            enemyDeathDefault.play()
                        }
                        
                        setTimeout(() => {
                            gameArea.removeChild(domEnemy)
                        }, 1000) //Delay for death animation
                    }
                    return {...enemy, status: 'death'}
                }
            }
            return enemy
        })
        
        // Cheking if all enemies dead
        if (levelEnemies.every(enemy => enemy.status === 'death')) {
            isAllEnemiesAlive = false
            handleEndAndStartLvl()
        }

    }, playerInfo.bulletSpeed * 100) //maybe change delay in future!!!

    // Removing bullet from queue and DOM
    if (bulletsQueue.length > 0) {
        const first = bulletsQueue.shift()
        const timeoutId2 = setTimeout(() => {
            gameArea.removeChild(first)
        }, 1000)
    }
}

function transformPlayer() {
    const player = document.querySelector('.player')
    player.style.transform = `translate(${playerInfo.playerX}px, ${playerInfo.playerY}px)`
}

function playerMoveAndShoot(key) {
    switch (key) {
        case 87:
            if (playerInfo.playerY > gameArea.offsetHeight - 400) {
                playerInfo.playerY -= playerInfo.speed
                transformPlayer()
            }
            break
        case 83:
            if (playerInfo.playerY < 570) {
                playerInfo.playerY += playerInfo.speed
                transformPlayer()
            }
            break
        case 65:
            if (playerInfo.playerX > 20) {
                playerInfo.playerX -= playerInfo.speed
                transformPlayer()
            }
            break   
        case 68:
            if (playerInfo.playerX < gameArea.offsetWidth - 80) {
                playerInfo.playerX += playerInfo.speed
                transformPlayer()
            }
            break
        case 32:
            if (playerCanShoot) {
                createPlayerBullet()
            }
            break
        default:
            break             
    }
}

document.addEventListener('keydown', e => {
    playerMoveAndShoot(e.keyCode)
})

// Enemies ********************************************************************
const enemies = [
    { 
        type: 'light',
        status: 'alive', 
        hp: 10, 
        damage: 10,
        speed: 1,
        enemyX: gameArea.offsetWidth / 2,
        enemyY: gameArea.offsetHeight / 8,
        sprite: 'assets/enemy_1.png'
    }
]
let levelEnemies = []
let isAllEnemiesAlive = true

function generateLvlEnemyCount() {
    // Clear previous enemies
    levelEnemies = []

    const [ enemy ] = enemies
    const count = currentLevel * 5

    for (let i = 0; i < count; i++) {
        levelEnemies.push(enemy)
    }

    // Spreading enemies by X cords
    levelEnemies = levelEnemies.map((enemy, index) => {
        return {...enemy, enemyX: (enemy.enemyX - (gameArea.offsetWidth / 4)) + (index * 50)}
    })
}

function createEnemy(enemy, index) {
    const { hp, damage, speed, enemyX, enemyY, sprite } = enemy
    const enemyDiv = document.createElement('div')
    const enemySprite = document.createElement('img')

    enemySprite.src = sprite
    enemyDiv.appendChild(enemySprite)
    enemyDiv.classList.add('enemy')
    enemyDiv.classList.add(`damage-${damage}`)
    enemyDiv.classList.add(`hp-${hp}`)
    enemyDiv.style.transition = speed + 's'
    enemyDiv.style.position = 'absolute'
    enemyDiv.style.transform = `translate(${gameArea.offsetWidth / 2}px, ${-gameArea.offsetHeight}px)`
    // Indexing enemy for future removal
    enemyDiv.classList.add(`enemy-${index}`)
    gameArea.appendChild(enemyDiv)

    const timeoutId = setTimeout(() => {
        enemyDiv.style.transform = `translate(${enemyX}px, ${enemyY}px)`
    }, speed * 1000)
}

// Enemies random movement
function generateRandomWithStep(max, step = 10) {
    const numberOfSteps = Math.floor(max / step)
    const randomStep = Math.floor(Math.random() * (numberOfSteps + 1))
    return randomStep * step
}
// Enemies "AI"
function enemiesAI() {
    if (isAllEnemiesAlive) {
        levelEnemies.forEach((enemy, index) => {
            if (enemy.status === 'alive') {
                const randomActionIndex = Math.floor(Math.random() * (3 - 1 + 1)) + 1
                switch (randomActionIndex) {
                    case 1: 
                        if (enemy.enemyX > 100) {
                            enemy.enemyX -= 100
                            transformEnemy(enemy, index)
                        }
                        break
                    case 2:
                        if (enemy.enemyX < gameArea.offsetWidth - 100) {
                            enemy.enemyX += 100
                            transformEnemy(enemy, index)
                        }
                        break
                    case 3:
                        enemyShoot(enemy)
                        break
                    default:
                        break
                }
            }
        })
    }
    setTimeout(enemiesAI, 2000) //<--- literally the game speed
}

function transformEnemy(enemy, index) {
    const enemyDOM = document.querySelector(`.enemy-${index}`)
    enemyDOM.style.transform = `translate(${enemy.enemyX}px, ${enemy.enemyY}px)`
}
const enemiesBulletQueue = []
function enemyShoot(enemy) {
    const bulletDOM = document.createElement('div')
    const bulletSprite = document.createElement('img')
    bulletSprite.src = playerInfo.bulletSprite
    bulletSprite.style.width = '1.5rem'
    bulletDOM.style.transition = '1s'
    bulletDOM.style.position = 'absolute'
    bulletDOM.appendChild(bulletSprite)

    bulletDOM.style.transform = `translate(${enemy.enemyX}px, ${enemy.enemyY}px)`
    gameArea.appendChild(bulletDOM)
    enemiesBulletQueue.push(bulletDOM)
    const timeoutId = setTimeout(() => {
        bulletDOM.style.transform = `translate(${enemy.enemyX}px, 100vh)`
    })

    // Register player hit
    if (enemy.enemyX === playerInfo.playerX) {
        // Register player death
        if (playerInfo.hp === 10) {
            // Deleting all enemies from game area
            document.querySelectorAll('.enemy').forEach(child => {
                gameArea.removeChild(child)
            })
            playerCanShoot = false
            isAllEnemiesAlive = false
            showGameOverScreen()
            return
        }

        playerInfo.hp -= enemy.damage
        // Updating value in hp bar
        document.querySelector('progress').value = playerInfo.hp
    }

    if (sounds) {
        enemyShootDefault.play()
    }

    // Removing enemies bullet from DOM and queue
    if (enemiesBulletQueue.length > 0) {
        const first = enemiesBulletQueue.shift()
        const timeoutId = setTimeout(() => {
            gameArea.removeChild(first)
        }, 1000)
    }
}
