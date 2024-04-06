// Game const and variables
let inputDir = {x:0, y:0};
const foodSound = new Audio('./music/food.mp3');
const gameOverSound = new Audio('./music/gameover.mp3');
const moveSound = new Audio('./music/move.mp3');
const musicSound = new Audio('./music/music.mp3');
let temX = 0;
let temY = 1;
let pause = true;
let score = 0;
let speed = 7;
let lastPaintTime = 0;
let snakeArr = [
    {x:13, y:15}
]
let food = {x:6, y:7};


// Game Functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sArr){
    if(sArr[0].x==0 || sArr[0].x==18 || sArr[0].y==0 || sArr[0].y==18) return true;
    for(let i=1; i<snakeArr.length; i++){
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y===snakeArr[0].y) return true;
    }
    return false;
}

function gameEngine(){
    //Updating the snake array
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over. Press any key to play again!");
        inputDir = {x:0, y:0};
        snakeArr = [{x:13, y:15}];
        document.getElementById("score").innerHTML = "Score: "+0;
        score = 0;
        speed = 7;
        musicSound.play();
    }

    //If you have eaten the food
    if(snakeArr[0].y === food.y && snakeArr[0].x===food.x){
        foodSound.play();
        snakeArr.unshift({x:snakeArr[0].x+inputDir.x, y:snakeArr[0].y+inputDir.y});
        let a = 2;
        let b = 16    
        food = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())};
        score += 1;
        if((score%5)==0){
            speed+=1;
        }
        if(score>highScore){
            highScore = score
            localStorage.setItem("highScore", JSON.stringify(highScoreVal));
            highScoreBox.innerHTML= "High Score: "+highScore;
        }
        document.getElementById("score").innerHTML = "Score: "+score;
    }

    //Moving the snake
    if(pause == false){
        for(let i = snakeArr.length-2; i>=0; i--){
            snakeArr[i+1] = {...snakeArr[i]};
        }
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
    }

    //Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index===0){
            snakeElement.classList.add('head');
        }
        else
            snakeElement.classList.add('snake');
        
        board.appendChild(snakeElement);
    })

    //Display the Food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function playOrPause(){
    if(pause==true){
        pause = false;
    }
    else{
        pause = true;
    }
}



// Game Logic
let highScore = localStorage.getItem("highScore");
if(highScore===null){
    let highScoreVal = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreVal));
}
else{
    highScoreVal = JSON.parse(highScore);
    highScoreBox.innerHTML= "High Score: "+highScore;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e=>{
    musicSound.play();
    if(inputDir.x==0 && inputDir.y==0)
        inputDir = {x:0, y:-1} //Start the game
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            pause = false;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            pause = false;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            pause = false;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            pause = false;
            break;
        case " ":
            playOrPause();
            break;
        default: 
            break;

    }
})