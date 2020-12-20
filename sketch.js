var mario, mario_running,mario_collided; 
var ground, groundImg, bkgnd, bkgndImg;
var obstacleAnim, obstacleGroup;
var brick, brickImg, brickGroup;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImg,restart,restartImg;
var jumpSound,dieSound,checkpointSound;

function preload() {
  bkgndImg = loadImage("bg.png");

  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");

  groundImg = loadImage("ground2.png");
  //ground.x = ground.width / 2;

  obstacleAnim = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");

  brickImg = loadImage("brick.png");
  
  mario_collided=loadImage("collided.png");
  
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 200);

  bkgnd = createSprite(300, 100);
  bkgnd.addImage("bkgnd", bkgndImg);
  //bkgnd.scale = 1.2;

  //mario = createSprite(50, 140, 20, 50);
  mario = createSprite(50, 30, 20, 50);
  mario.addAnimation("running", mario_running);
  edges = createEdgeSprites();

  ground = createSprite(200, 200, 400, 20);
  ground.addImage("ground", groundImg);

  gameOver=createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  gameOver.visible=false;
  
  restart=createSprite(300,130);
  restart.addImage(restartImg);
  restart.scale=0.5;
  restart.visible=false;
  
  score = 0;
  obstacleGroup = new Group();
  brickGroup = new Group();
  mario.setCollider("rectangle",0,7,20,20);
  //mario.debug=true;
}

function draw() {
    background("blue");

    if (gameState === PLAY) {
    ground.velocityX = -2;
    
    /*if (keyDown("space") && brickGroup.isTouching(mario)) {
      score = score + 1;
    }*/

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && mario.y > 100) {
      mario.velocityY = -10;
      jumpSound.play();
    }
    mario.velocityY = mario.velocityY + 0.5;
    //spawn the obstacles
    spawnObstacles();

    //spawn the bricks
    spawnBricks();
    
    //Calculating the score
    if(mario.isTouching(brickGroup))
    {
        score=score+1;
        for (i=0;i<brickGroup.length;i++)
        {
          if(brickGroup[i].isTouching(mario))
          {
            brickGroup[i].destroy();
          }
        }

    }
    
    if(obstacleGroup.isTouching(mario))
      {
        gameState=END;
        dieSound.play();
      }
    
    if(score>0 && score%100===0)
    {
      checkpointSound.play();
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    
    mario.addAnimation("running",mario_collided);
    
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    
    //setting the visibility of gameOver and restart to true
    gameOver.visible=true;
    restart.visible=true;
      
    //resetting the game on click of restart button
    if(mousePressedOver(restart))
    {
      reset();
    }
  }
  //mario collides the ground so that it doesn't fall off
  mario.collide(ground);

  drawSprites();
  
  //printing the score
  fill("black");
  text("Score:" + score, 500, 25);
}

function reset()
{
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  //changing animation to running after reset
  mario.addAnimation("running", mario_running);
 
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  score=0;
}

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    var obstacle = createSprite(600, 143, 10, 40);
    obstacle.addAnimation("biting", obstacleAnim);
    obstacle.scale=0.7;
    obstacle.velocityX = -4;
    obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);
  }
}

function spawnBricks() {
  if (frameCount % 60 === 0) {
    brick = createSprite(550, Math.round(random(40, 90)), 10, 30);
    brick.addImage("brck", brickImg);
    brick.velocityX = -3;
    brick.lifetime = 300;
    brickGroup.add(brick);

    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    if (mario.isTouching(brick)) {
      score = score + 1;
    }
  }
}
