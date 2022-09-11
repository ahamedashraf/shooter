var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;

function preload(){
  player_running = loadAnimation("run.png", "stand.png");
  player_collided = loadAnimation("stand.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("enemy1.png");
  obstacle2 = loadImage("enemy2.png");
  obstacle3 = loadImage("fire.png");

  gameOver = loadImage("gameOver.png");

  gameRestart = loadImage("restart.png");
  
}

function setup() {
   createCanvas(windowWidth, windowHeight);
  
  player = createSprite(50,height-70,20,50);
  player.addAnimation("running", player_running);
  player.addAnimation("collided" ,player_collided);
  player.scale = 0.2;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage("Over",gameOver);
  gameOver.visible = false;
  
  gameRestart = createSprite(width/2,height/2);
  gameRestart.addImage("restart",gameRestart);
  gameRestart.visible = false;
  
  gameOver.scale = 0.5;
  gameRestart.scale = 0.5;

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  
  score = 0;
}

function draw() {
  background("#000000");
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && player.y  >= height-120) {
      player.velocityY = -10;
       touches = [];
    }
    
    player.velocityY = player.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    player.collide(invisibleGround);
    cloudy();
    obstical();
  
    if(obstaclesGroup.isTouching(player)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    player.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the player animation
    player.changeAnimation("collided",player_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      rebootSystems();
      touches = []
    }
  }
  
  
  drawSprites();
}

function cloudy() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = player.depth;
    player.depth = player.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function obstical() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = player.depth;
    player.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function rebootSystems(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  player.changeAnimation("running",player_running);
  
  score = 0;
  
}
