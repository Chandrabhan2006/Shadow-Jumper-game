// Game elements
const startScreen = document.getElementById('start-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const gameScreen = document.getElementById('game-screen');
const levelCompleteScreen = document.getElementById('level-complete-screen');
const gameOverScreen = document.getElementById('game-over-screen');

// Buttons
const startButton = document.getElementById('start-button');
const instructionsButton = document.getElementById('instructions-button');
const backButton = document.getElementById('back-button');
const restartButton = document.getElementById('restart-button');
const menuButton = document.getElementById('menu-button');
const nextLevelButton = document.getElementById('next-level-button');
const levelMenuButton = document.getElementById('level-menu-button');
const tryAgainButton = document.getElementById('try-again-button');
const gameOverMenuButton = document.getElementById('game-over-menu-button');

// Game elements
const levelNumber = document.getElementById('level-number');
const completedLevel = document.getElementById('completed-level');
const gameOverMessage = document.getElementById('game-over-message');
const lightWorld = document.getElementById('light-world');
const shadowWorld = document.getElementById('shadow-world');
const lightCharacter = document.getElementById('light-character');
const shadowCharacter = document.getElementById('shadow-character');
const lightGoal = document.getElementById('light-goal');
const shadowGoal = document.getElementById('shadow-goal');

// Game state
let currentLevel = 1;
let gameInterval;
let platforms = [];
let obstacles = [];
let isGameActive = false;

// Character properties
const characters = {
    light: {
        element: lightCharacter,
        x: 50,
        y: 0,
        width: 30,
        height: 50,
        speed: 5,
        jumping: false,
        ducking: false,
        reachedGoal: false
    },
    shadow: {
        element: shadowCharacter,
        x: 50,
        y: 0,
        width: 30,
        height: 50,
        speed: 5,
        jumping: false,
        ducking: false,
        reachedGoal: false
    }
};

// Key states
const keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Level definitions
const levels = [
    // Level 1 - Very Simple Introduction (Just walk to goal)
    {
        platforms: [
            { x: 0, y: 0, width: 800, height: 20 }, // Ground for both worlds
        ],
        obstacles: [],
        lightGoal: { x: 700, y: 0 },
        shadowGoal: { x: 700, y: 0 }
    },
    // Level 2 - Simple obstacle introduction
    {
        platforms: [
            { x: 0, y: 0, width: 800, height: 20 }, // Ground for both worlds
        ],
        obstacles: [
            { x: 400, y: 0, width: 30, height: 30, world: 'light' }
        ],
        lightGoal: { x: 700, y: 0 },
        shadowGoal: { x: 700, y: 0 }
    }
];

// Function to generate remaining levels (3-100)
function generateLevels() {
    const platformTypes = {
        ground: { width: 800, height: 20 },
        small: { width: 100, height: 20 },
        medium: { width: 200, height: 20 },
        large: { width: 300, height: 20 }
    };

    for (let i = 3; i <= 100; i++) {
        const level = {
            platforms: [],
            obstacles: [],
            lightGoal: { x: 700, y: 0 },
            shadowGoal: { x: 700, y: 0 }
        };

        // Add ground platforms (gets more challenging after level 30)
        if (i < 30) {
            level.platforms.push({ x: 0, y: 0, width: 800, height: 20 });
        } else {
            // Split ground into sections
            const sections = Math.floor(i / 20);
            for (let j = 0; j < sections; j++) {
                level.platforms.push({
                    x: j * 300,
                    y: 0,
                    width: 250,
                    height: 20
                });
            }
        }

        // Add elevated platforms (starts at level 5)
        if (i >= 5) {
            const numPlatforms = Math.min(Math.floor(i / 10) + 1, 5);
            for (let j = 0; j < numPlatforms; j++) {
                const platformX = 100 + j * 150;
                const platformY = 50 + (j % 3) * 40;
                level.platforms.push({
                    x: platformX,
                    y: platformY,
                    width: 100,
                    height: 20,
                    world: j % 2 === 0 ? 'light' : 'shadow'
                });
            }
        }

        // Add obstacles (starts at level 3, gradually increases)
        if (i >= 3) {
            const numObstacles = Math.min(Math.floor(i / 15) + 1, 4);
            for (let j = 0; j < numObstacles; j++) {
                const obstacleX = 200 + j * 120;
                level.obstacles.push({
                    x: obstacleX,
                    y: 0,
                    width: 30,
                    height: 30,
                    world: j % 2 === 0 ? 'light' : 'shadow'
                });
            }
        }

        // Add floating obstacles (starts at level 15)
        if (i >= 15) {
            const numFloatingObstacles = Math.min(Math.floor((i - 15) / 20) + 1, 3);
            for (let j = 0; j < numFloatingObstacles; j++) {
                const obstacleX = 300 + j * 150;
                const obstacleY = 70;
                level.obstacles.push({
                    x: obstacleX,
                    y: obstacleY,
                    width: 30,
                    height: 30,
                    world: j % 2 === 0 ? 'shadow' : 'light'
                });
            }
        }

        // Adjust goal positions (gets more challenging after level 20)
        if (i >= 20) {
            const goalY = Math.min(Math.floor((i - 20) / 10) * 30, 90);
            level.lightGoal.y = goalY;
            level.shadowGoal.y = goalY;
        }

        // Add the generated level
        levels.push(level);
    }
}

// Generate the remaining levels
generateLevels();

// Event listeners for buttons
startButton.addEventListener('click', startGame);
instructionsButton.addEventListener('click', showInstructions);
backButton.addEventListener('click', showStartScreen);
restartButton.addEventListener('click', restartLevel);
menuButton.addEventListener('click', showStartScreen);
nextLevelButton.addEventListener('click', nextLevel);
levelMenuButton.addEventListener('click', showStartScreen);
tryAgainButton.addEventListener('click', restartLevel);
gameOverMenuButton.addEventListener('click', showStartScreen);

// Event listeners for keyboard
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Show start screen initially
showStartScreen();

// Screen management functions
function showStartScreen() {
    startScreen.classList.remove('hidden');
    instructionsScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    stopGame();
}

function showInstructions() {
    startScreen.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
}

function showGameScreen() {
    startScreen.classList.add('hidden');
    instructionsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    levelCompleteScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function showLevelComplete() {
    gameScreen.classList.add('hidden');
    levelCompleteScreen.classList.remove('hidden');
    completedLevel.textContent = currentLevel;
    stopGame();
}

function showGameOver(message) {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    gameOverMessage.textContent = message || 'One of your characters didn\'t make it!';
    stopGame();
}

// Game control functions
function startGame() {
    currentLevel = 1;
    loadLevel(currentLevel);
    showGameScreen();
}

function restartLevel() {
    loadLevel(currentLevel);
    showGameScreen();
}

function nextLevel() {
    currentLevel++;
    if (currentLevel <= levels.length) {
        loadLevel(currentLevel);
        showGameScreen();
    } else {
        // Game completed
        showGameOver('Congratulations! You\'ve completed all 100 levels! You\'re a Shadow Jumper Master!');
    }
}

function stopGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    // Reset key states
    keys.left = false;
    keys.right = false;
    keys.up = false;
    keys.down = false;
}

// Level management
function loadLevel(levelIndex) {
    clearLevel();
    updateLevelInfo();
    const level = levels[levelIndex - 1];
    resetCharacters();
    setGoalPositions(level);
    createPlatforms(level);
    createObstacles(level);
    startGameLoop();
}

function clearLevel() {
    // Remove all platforms and obstacles
    platforms.forEach(platform => {
        if (platform.element) {
            platform.element.remove();
        }
    });
    
    obstacles.forEach(obstacle => {
        if (obstacle.element) {
            obstacle.element.remove();
        }
    });
    
    platforms = [];
    obstacles = [];
}

function resetCharacters() {
    // Reset light character
    characters.light.x = 50;
    characters.light.y = 0;
    characters.light.jumping = false;
    characters.light.ducking = false;
    characters.light.reachedGoal = false;
    lightCharacter.style.left = characters.light.x + 'px';
    lightCharacter.style.bottom = characters.light.y + 'px';
    lightCharacter.classList.remove('jumping', 'ducking');
    
    // Reset shadow character
    characters.shadow.x = 50;
    characters.shadow.y = 0;
    characters.shadow.jumping = false;
    characters.shadow.ducking = false;
    characters.shadow.reachedGoal = false;
    shadowCharacter.style.left = characters.shadow.x + 'px';
    shadowCharacter.style.bottom = characters.shadow.y + 'px';
    shadowCharacter.classList.remove('jumping', 'ducking');
}

function setGoalPositions(level) {
    lightGoal.style.left = level.lightGoal.x + 'px';
    lightGoal.style.bottom = level.lightGoal.y + 'px';
    
    shadowGoal.style.left = level.shadowGoal.x + 'px';
    shadowGoal.style.bottom = level.shadowGoal.y + 'px';
}

function createPlatforms(level) {
    level.platforms.forEach(platformData => {
        const platform = document.createElement('div');
        platform.className = 'platform';
        platform.style.width = platformData.width + 'px';
        platform.style.height = platformData.height + 'px';
        platform.style.left = platformData.x + 'px';
        platform.style.bottom = platformData.y + 'px';
        
        // Add platform to appropriate world(s)
        if (!platformData.world || platformData.world === 'both') {
            // Add to both worlds
            const lightPlatform = platform.cloneNode();
            lightWorld.appendChild(lightPlatform);
            
            const shadowPlatform = platform.cloneNode();
            shadowWorld.appendChild(shadowPlatform);
            
            platforms.push({
                ...platformData,
                element: lightPlatform,
                world: 'light'
            });
            
            platforms.push({
                ...platformData,
                element: shadowPlatform,
                world: 'shadow'
            });
        } else {
            // Add to specific world
            if (platformData.world === 'light') {
                lightWorld.appendChild(platform);
            } else {
                shadowWorld.appendChild(platform);
            }
            
            platforms.push({
                ...platformData,
                element: platform,
                world: platformData.world
            });
        }
    });
}

function createObstacles(level) {
    level.obstacles.forEach(obstacleData => {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.style.width = obstacleData.width + 'px';
        obstacle.style.height = obstacleData.height + 'px';
        obstacle.style.left = obstacleData.x + 'px';
        obstacle.style.bottom = obstacleData.y + 'px';
        
        // Add obstacle to appropriate world
        if (obstacleData.world === 'light') {
            lightWorld.appendChild(obstacle);
        } else if (obstacleData.world === 'shadow') {
            shadowWorld.appendChild(obstacle);
        } else if (obstacleData.world === 'both') {
            const lightObstacle = obstacle.cloneNode();
            lightWorld.appendChild(lightObstacle);
            
            const shadowObstacle = obstacle.cloneNode();
            shadowWorld.appendChild(shadowObstacle);
            
            obstacles.push({
                ...obstacleData,
                element: lightObstacle,
                world: 'light'
            });
            
            obstacles.push({
                ...obstacleData,
                element: shadowObstacle,
                world: 'shadow'
            });
            
            return;
        }
        
        obstacles.push({
            ...obstacleData,
            element: obstacle,
            world: obstacleData.world
        });
    });
}

// Game loop
function startGameLoop() {
    isGameActive = true;
    gameInterval = setInterval(updateGame, 20);
}

function updateGame() {
    if (!isGameActive) return;
    
    // Update character positions based on key states
    updateCharacterPositions();
    
    // Apply gravity
    applyGravity();
    
    // Check collisions
    checkCollisions();
    
    // Check if level is complete
    checkLevelComplete();
}

// Input handling
function handleKeyDown(e) {
    if (!isGameActive) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'ArrowUp':
            if (!keys.up && !characters.light.jumping && !characters.light.ducking) {
                keys.up = true;
                jump('light');
                duck('shadow');
            }
            break;
        case 'ArrowDown':
            if (!keys.down && !characters.light.ducking && !characters.light.jumping) {
                keys.down = true;
                duck('light');
                jump('shadow');
            }
            break;
    }
}

function handleKeyUp(e) {
    switch (e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            if (characters.light.ducking) {
                unduck('light');
            }
            if (characters.shadow.ducking) {
                unduck('shadow');
            }
            break;
    }
}

// Character movement
function updateCharacterPositions() {
    // Light character moves normally
    if (keys.left) {
        characters.light.x -= characters.light.speed;
        characters.shadow.x += characters.shadow.speed; // Shadow moves opposite
    }
    
    if (keys.right) {
        characters.light.x += characters.light.speed;
        characters.shadow.x -= characters.shadow.speed; // Shadow moves opposite
    }
    
    // Update character elements
    updateCharacterElements();
}

function updateCharacterElements() {
    // Keep characters within bounds
    characters.light.x = Math.max(0, Math.min(characters.light.x, 770));
    characters.shadow.x = Math.max(0, Math.min(characters.shadow.x, 770));
    
    // Update DOM elements
    lightCharacter.style.left = characters.light.x + 'px';
    lightCharacter.style.bottom = characters.light.y + 'px';
    
    shadowCharacter.style.left = characters.shadow.x + 'px';
    shadowCharacter.style.bottom = characters.shadow.y + 'px';
}

function jump(character) {
    if (characters[character].jumping || characters[character].ducking) return;
    
    characters[character].jumping = true;
    characters[character].element.classList.add('jumping');
    
    // Jump animation
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight < 10) {
            characters[character].y += 8;
            jumpHeight++;
        } else if (jumpHeight < 20) {
            characters[character].y -= 8;
            jumpHeight++;
        } else {
            clearInterval(jumpInterval);
            characters[character].jumping = false;
            characters[character].element.classList.remove('jumping');
        }
        
        updateCharacterElements();
    }, 30);
}

function duck(character) {
    if (characters[character].jumping || characters[character].ducking) return;
    
    characters[character].ducking = true;
    characters[character].element.classList.add('ducking');
    
    // Automatically unduck after a delay (same as jump duration)
    setTimeout(() => {
        unduck(character);
    }, 600);
}

function unduck(character) {
    if (!characters[character].ducking) return;
    
    characters[character].ducking = false;
    characters[character].element.classList.remove('ducking');
}

// Physics
function applyGravity() {
    // Check if characters are on a platform
    const lightOnPlatform = isOnPlatform('light');
    const shadowOnPlatform = isOnPlatform('shadow');
    
    // Apply gravity if not on platform and not jumping
    if (!lightOnPlatform && !characters.light.jumping) {
        characters.light.y = Math.max(0, characters.light.y - 5);
    }
    
    if (!shadowOnPlatform && !characters.shadow.jumping) {
        characters.shadow.y = Math.max(0, characters.shadow.y - 5);
    }
}

function isOnPlatform(character) {
    const char = characters[character];
    
    // Check if character is on any platform
    return platforms.some(platform => {
        if (platform.world !== character && platform.world !== 'both') return false;
        
        return (
            char.x + char.width > platform.x &&
            char.x < platform.x + platform.width &&
            Math.abs(char.y - platform.y - platform.height) < 5
        );
    });
}

// Collision detection
function checkCollisions() {
    // Check if either character has fallen off the screen
    if (characters.light.y < 0 || characters.shadow.y < 0) {
        showGameOver('One of your characters fell off the platform!');
        return;
    }
    
    // Check collisions with obstacles
    checkObstacleCollisions();
}

function checkObstacleCollisions() {
    // Check light character collisions
    const lightCollision = obstacles.some(obstacle => {
        if (obstacle.world !== 'light' && obstacle.world !== 'both') return false;
        
        return (
            characters.light.x + characters.light.width > obstacle.x &&
            characters.light.x < obstacle.x + obstacle.width &&
            characters.light.y + characters.light.height > obstacle.y &&
            characters.light.y < obstacle.y + obstacle.height
        );
    });
    
    // Check shadow character collisions
    const shadowCollision = obstacles.some(obstacle => {
        if (obstacle.world !== 'shadow' && obstacle.world !== 'both') return false;
        
        return (
            characters.shadow.x + characters.shadow.width > obstacle.x &&
            characters.shadow.x < obstacle.x + obstacle.width &&
            characters.shadow.y + characters.shadow.height > obstacle.y &&
            characters.shadow.y < obstacle.y + obstacle.height
        );
    });
    
    if (lightCollision || shadowCollision) {
        showGameOver('One of your characters hit an obstacle!');
    }
}

// Level completion
function checkLevelComplete() {
    // Check if light character reached goal
    if (!characters.light.reachedGoal) {
        const lightGoalX = parseInt(lightGoal.style.left);
        const lightGoalY = parseInt(lightGoal.style.bottom);
        
        if (
            Math.abs(characters.light.x - lightGoalX) < 20 &&
            Math.abs(characters.light.y - lightGoalY) < 20
        ) {
            characters.light.reachedGoal = true;
        }
    }
    
    // Check if shadow character reached goal
    if (!characters.shadow.reachedGoal) {
        const shadowGoalX = parseInt(shadowGoal.style.left);
        const shadowGoalY = parseInt(shadowGoal.style.bottom);
        
        if (
            Math.abs(characters.shadow.x - shadowGoalX) < 20 &&
            Math.abs(characters.shadow.y - shadowGoalY) < 20
        ) {
            characters.shadow.reachedGoal = true;
        }
    }
    
    // If both characters reached their goals, level is complete
    if (characters.light.reachedGoal && characters.shadow.reachedGoal) {
        showLevelComplete();
    }
}

// Add level progress display
function updateLevelInfo() {
    levelNumber.textContent = `${currentLevel}/100`;
} 