/**
 * By Felipe Lisboa
 * @version 0.2
**/
	
//===============================================================================
// Input
//===============================================================================

var pressedChecker = new Object();
pressedChecker.enter=false;
pressedChecker.space=false;
pressedChecker.left=false;
pressedChecker.up=false;
pressedChecker.right=false;
pressedChecker.down=false;

function keyDown(e) {
	switch(e.keyCode){
		case 0x0D:	pressedChecker.enter = 	true;	break;
		case 0x20:	pressedChecker.space = 	true;	break;
		case 0x25:	pressedChecker.left = 	true;	break;
		case 0x26:	pressedChecker.up = 	true;	break;
		case 0x27:	pressedChecker.right = 	true;	break;
		case 0x28:	pressedChecker.down = 	true;	break;
	}
	keyShortcuts();
}
	
function keyUp(e) { // No more pressed
	switch(e.keyCode){
		case 0x0D:	pressedChecker.enter = 	false;	break;
		case 0x20:	pressedChecker.space = 	false;	break;
		case 0x25:	pressedChecker.left = 	false;	break;
		case 0x26:	pressedChecker.up = 	false;	break;
		case 0x27:	pressedChecker.right = 	false;	break;
		case 0x28:	pressedChecker.down =	false;	break;
	}
	keyShortcuts();
}

function keyShortcuts(){
	pressedChecker.confirm = pressedChecker.enter || pressedChecker.space;
}

document.addEventListener('keyup', keyUp, false);
document.addEventListener('keydown', keyDown, false);

//===============================================================================
// Title Screen
//===============================================================================						

function titleScreen(){
	var frameCount, intervalId, imageLogo, imageTitleBackground,
	imageBackgroundSprite1, imageBackgroundSprite2, imageBackgroundSprite3, imageBackgroundSprite4;
		
	function create() {
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		
		//load highScore
		var highScoreLoaded = localStorage.highScoreGame;
		highScore = (typeof highScoreLoaded === "undefined") ? new Array() : JSON.parse(highScoreLoaded);

		//load images
		imageLogo = new Image();
		imageLogo.src = "res/img/logo.png";
		
		imageTitleBackground = new Image();
		imageTitleBackground.src = "res/img/titlebackground.png";
		
		imageBackgroundSprite1 = new Image();
		imageBackgroundSprite1.src = "res/img/titlesprite1.png";
		imageBackgroundSprite2 = new Image();
		imageBackgroundSprite2.src = "res/img/titlesprite2.png";
		imageBackgroundSprite3 = new Image();
		imageBackgroundSprite3.src = "res/img/titlesprite3.png";
		imageBackgroundSprite4 = new Image();
		imageBackgroundSprite4.src = "res/img/titlesprite4.png";

		frameCount=0;
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		intervalId = setInterval(mainLoop, 30);// Calls the msinLoop at each 30 frames
	}

	function mainLoop() {
		updateInput();
		draw(); 
		frameCount++;
	}
	
	function updateInput(){
		if(pressedChecker.confirm){
			finishScreen();
			game();
		}
	}
	
	function finishScreen(){
		clearInterval(intervalId);
	}

	function draw(){
		// Clear the screen
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Background
		var backgroundSize = 640;
		context.drawImage(imageTitleBackground, 0, 0); // parallax
		
		// Parallax
		var spriteSize = 16;
		for(var x=0-spriteSize;x<=backgroundSize+spriteSize;x+=spriteSize){
			// Sprite
			context.drawImage(imageBackgroundSprite1, x-frameCount/2%spriteSize, 88);
			context.drawImage(imageBackgroundSprite2, x-frameCount/3%spriteSize, 114);
			context.drawImage(imageBackgroundSprite3, x-frameCount/4%spriteSize, 134);
			context.drawImage(imageBackgroundSprite4, x-frameCount/6%spriteSize, 144);
		}
		
		// Logo
		context.drawImage(imageLogo, canvas.width/2-160, 220);
	}
	
	create();
}

//===============================================================================
// Game
//===============================================================================						

function game(){
	var player, jumpPressed, started, gameOver, gravity, jumpSpeed, validHeight, distance, score, pipeIntervalX, pipeIntervalY, enemies, 
		highScore, highScoreMaxSize, debug, frameCount, frameCountRound, frameCountPlayer, intervalId,
		imagePlayer, imagePlayerFrame2, imagePlayerGameOver1, imagePlayerGameOver2, imagePlayerGameOver3, imageScoreBox, imageHighScoreBox,
		imagePipe, imagePipeHole, imagePipeHoleReverse, imageBackground, imageBackgroundParallax, imageBackgrounds, imageBackgroundsParallax;
		
	function create() {
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		
		//load highScore
		var highScoreLoaded = localStorage.highScoreGame;
		highScore = (typeof highScoreLoaded === "undefined") ? new Array() : JSON.parse(highScoreLoaded);

		//load images
		imagePipe = new Image();
		imagePipe.src = "res/img/pipe.png";
		imagePipeHole = new Image();
		imagePipeHole.src = "res/img/pipehole.png";
		imagePipeHoleReverse = new Image();
		imagePipeHoleReverse.src = "res/img/pipeholereverse.png";
		imagePlayer = new Image();
		imagePlayer.src = "res/img/player.png";
		imagePlayerFrame2 = new Image();
		imagePlayerFrame2.src = "res/img/player2.png";
		imagePlayerGameOver1 = new Image();
		imagePlayerGameOver1.src = "res/img/playergameover1.png";
		imagePlayerGameOver2 = new Image();
		imagePlayerGameOver2.src = "res/img/playergameover2.png";
		imagePlayerGameOver3 = new Image();
		imagePlayerGameOver3.src = "res/img/playergameover3.png";
		imageScoreBox = new Image();
		imageScoreBox.src = "res/img/scorebox.png";
		imageHighScoreBox = new Image();
		imageHighScoreBox.src = "res/img/highscorebox.png";
		
		var backgroundsLength = 3;
		imageBackgrounds=new Array();
		imageBackgroundsParallax=new Array();
		for(var i=0;i<backgroundsLength;i++){
			imageBackgrounds[i] = new Image();
			imageBackgrounds[i].src = "res/img/background"+(i+1)+".png";
			imageBackgroundsParallax[i] = new Image();
			imageBackgroundsParallax[i].src = "res/img/backgroundparallax"+(i+1)+".png";
		}

		frameCount=0;
		initialize();
		
		intervalId = setInterval(gameLoop, 30);// Calls the gameLoop at each 30 frames
	}


	function initialize() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		player = rectImageFactory(canvas.width/2-22,canvas.height/2-12,24,15,imagePlayer);
		player.image2 = imagePlayerFrame2;
		player.speedX = 4; // Must divide 100
		player.speedY = 0;
		distance = 0;
		score = 0;
		started = false;
		gameOver = false;
		frameCountRound=0;
		frameCountPlayer=0;
		jumpPressed=false;
		debug=false;
		enemies = new Array();
		// Define random background and parallax
		var indexPicked = Math.floor(imageBackgrounds.length * Math.random());
		imageBackground = imageBackgrounds[indexPicked];
		imageBackgroundParallax = imageBackgroundsParallax[indexPicked];
		// Constants
		pipeIntervalX = 200;
		pipeIntervalY = 96;
		gravity=2;
		jumpSpeed=12;
		validHeight=400; // Without counting the floor
		highScoreMaxSize=9; 
	}

	function gameLoop() {
		updateInput();
		if(started && !gameOver){
			gameLogic();
		}
		draw(); 
		if(gameOver)
			drawGameOver();
		updateFrameCounts();
	}
	
	function updateInput(){
		jumpPressed	= frameCountPlayer>=4 && (pressedChecker.confirm || pressedChecker.up);
		if(jumpPressed){
			started=true;
		}
		if(gameOver && frameCountPlayer>=24 && pressedChecker.confirm){
			initialize();
		}	
	}

	function updateFrameCounts(){
		if(!gameOver){
			frameCountRound++;
		}
		frameCountPlayer++;
		frameCount++;
	}

	function gameLogic(){
		var fix=-100;
		if((distance+fix)%pipeIntervalX==0){
			enemies.push(generateEnemy());
			if(enemies.length==5)
				removeArray(enemies,0);
		}
		for(var i=0;i<enemies.length;i++){
			enemies[i].top.x -= player.speedX;
			enemies[i].bottom.x -= player.speedX;
		}
		distance+=player.speedX;
		if(jumpPressed)
			player.speedY=-jumpSpeed;
		player.speedY+=gravity;
		player.y+=player.speedY;
		if(player.y<0){	// Correct top limits
			player.speedY=0;
			player.y=0;
		}
		
		score = distance/player.speedX;

		//Checks collisions
		for(var i=0;i<enemies.length;i++){
			if (checkColisions(player,enemies[i].top) || checkColisions(player,enemies[i].bottom)){
				startGameOver();
			}					
		}
		if(player.y+player.height>validHeight){	// Player fall
			player.y=validHeight-player.height; // Put the player at floor
			startGameOver();	
		}
	}
	
	function startGameOver(){
		gameOver=true;
		frameCountPlayer=0;
		updatehighScoreIfNecessary(score);
	}
	
	function updatehighScoreIfNecessary(newScore){
		if(highScore.length==highScoreMaxSize && highScore[highScore.length-1]>=newScore)
			return false;
		if(highScore.length==highScoreMaxSize)
			highScore.pop();
		highScore.push(newScore);
		highScore.sort(function(a,b){return b-a});
		localStorage.highScoreGame = JSON.stringify(highScore);
		return true;
	}

	function draw(){
		// Clear the screen
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Background
		var backgroundSize = 640;
		var spriteDistance = player.speedX*frameCountRound;
		// parallax
		context.drawImage(imageBackgroundParallax, 0-(spriteDistance)/4%backgroundSize, 0); 
		context.drawImage(imageBackgroundParallax, backgroundSize-(spriteDistance)/4%backgroundSize, 0);
		// Normal Background
		context.drawImage(imageBackground, 0-spriteDistance%backgroundSize, 0);
		context.drawImage(imageBackground, backgroundSize-spriteDistance%backgroundSize, 0);

		// Enemies
		for(var i=0;i<enemies.length;i++){
			var pipePieceHeight = 16;
			for(var j=0;j<enemies[i].top.height;j+=pipePieceHeight){
				var image = imagePipe;
				if(j==enemies[i].top.height-pipePieceHeight) // Last
					image = imagePipeHole;
				context.drawImage(image, enemies[i].top.x, j);
			}
			for(var j=0;j<enemies[i].bottom.height;j+=pipePieceHeight){
				var image = imagePipe;
				if(j==0) // First
					image = imagePipeHoleReverse;
				context.drawImage(image, enemies[i].bottom.x, j+enemies[i].bottom.y);
			}
		}
		
		// Player
		var playerImage = null;
		if(gameOver){
			if(frameCountPlayer<4){
				playerImage = imagePlayerGameOver1;
			}else if(frameCountPlayer<8){
				playerImage = imagePlayerGameOver2;
			}else if(frameCountPlayer<12){
				playerImage = imagePlayerGameOver3;
			}
		}else{
			playerImage = (frameCountPlayer/4%2!=0) ? player.image : player.image2;
		}
		if(playerImage!=null)
			context.drawImage(playerImage, player.x, player.y);

		// Score
		context.drawImage(imageScoreBox, 0, canvas.height-32);
		context.font = "20pt Helvetica";
		context.fillStyle = "#000000";
		context.fillText("Score: "+score,4,canvas.height-4);
	}

	function drawGameOver(){
		if(frameCountPlayer<24)
			return
		context.drawImage(imageHighScoreBox, (canvas.width / 2)-148, 6);
		context.font = "40pt Helvetica";
		context.fillText("Game Over",(canvas.width / 2)-140,50);
		drawhighScore(context, highScore, score);
	}

	function generateEnemy(){
		var ret = new Object();
		ret.midY = Math.floor(1+(validHeight/(pipeIntervalY/2)-4) * Math.random());
		ret.midY *= pipeIntervalY/2;
		var pipeWidth = 32;
		ret.top = rectFactory(canvas.width,0,pipeWidth,ret.midY);
		ret.bottom = rectFactory(canvas.width,ret.midY+pipeIntervalY,pipeWidth,validHeight-(ret.midY+pipeIntervalY));
		return ret;
	}
	
	create();
}

//===============================================================================
// Commons
//===============================================================================	
	
function drawhighScore(context, highScore, lastScore){
	var showed = false;
	var font = "20pt Helvetica";
	var fontHighScore = "8pt Helvetica"
	context.font = font;
	for(var i=0;i<highScore.length;i++){
		var text = (i+1)+"  -  "+highScore[i];
		var x = (canvas.width / 2)-70;
		var y = 100+(40*i);
		context.fillText(text,x,y);
		if(!showed && highScore[i]==lastScore){
			context.font = fontHighScore;
			context.fillText("NEW RECORD",x+128,y-6);
			context.font = font;
			showed = true;
		}
	}
}

//===============================================================================
// Utils
//===============================================================================	

function rectFactory(x,y,width,height){
	var ret = new Object();
	ret={x:x,y:y,width:width,height:height};
	return ret;
}

function rectImageFactory(x,y,width,height,image){ //TODO matar
	var ret = rectFactory(x,y,width,height);
	ret.image = image;
	return ret;
}

function checkColisions(rect1,rect2){
	var rect = new Array();
	rect.push(rect1);
	rect.push(rect2);
	var ret=false;
	for(var i=0;i<2;i++){
		if( ((rect[0].x+rect[0].width)>rect[1].x && (rect[1].x+rect[1].width)>rect[0].x &&
				(rect[1].y+rect[1].height)>rect[0].y && (rect[0].y+rect[0].height)>rect[1].y) || 	// X-axis
				((rect[0].y+rect[0].height)>rect[1].y && (rect[1].y+rect[1].height)>rect[0].y &&
				(rect[1].x+rect[1].width)>rect[0].x && (rect[0].x+rect[0].width)>rect[1].x)) 		// Y-axis
			ret=true
	}
	return ret;
}


// Remove the index position. This method creates other array and put all element for the oldArray to the new one and returns it.
function removeArray(oldArray,index){
	var ret = new Array();
	for(var i=0;i<oldArray.length-2;i++){
		ret.push(oldArray[(i<index) ? i : i+1]);
	}
	return ret;
}

titleScreen();	