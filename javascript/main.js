document.querySelector('#enemies').style.height = document.documentElement.clientHeight - 54 +'px';
document.querySelector('#weapons').style.height = document.documentElement.clientHeight - 54 +'px';
document.querySelector('#enemy-weapons').style.height = document.documentElement.clientHeight - 54 +'px';
//Hero object
var ship = {
  left: 10,
  top: document.documentElement.clientHeight/2 - 25,
};

var lives = 3;
var score = 0;
var d=0;
var time=2000;
var level =1;
var weapons = [];
var enemies = [];
var enemyWeapon=[];
//constructor for creating enemies
function updateEnemy() {
  document.getElementById("enemies").innerHTML = "";
  var i;
  for (i = 0; i < enemies.length; i++) {
    document.getElementById("enemies").innerHTML +=
      "<div class='enemy' style='left:" +
      enemies[i].left +
      "px; top:" +
      enemies[i].top +
      "px;'></div>";
  }
}

function moveEnemy() {
  var i;
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].left >= -50) {
      enemies[i].left -= 50;
    }
  }
}

function createEnemy() {
  var l= document.getElementById('enemies').clientWidth - 50;
  var t= 10;
  for(i =1 ;i<=28 ;i++){
    enemies.push({ left: l, top: t});
    t+=70;
    if( t>= document.getElementById('enemies').clientHeight - 120)
    {
        t=10;
        l+=70;
    }
  }
}


  function moveEnemyUpDown(){
    if(d==0){  
      
    for( i=0; i<enemies.length; i++){
      if(enemies[i].top <= 10){

        d=1;
        moveEnemy();
        break;
      }
      else{

          enemies[i].top -= 2.5;
      }
    }
  }
    if(d==1){      
      for( i=0; i<enemies.length; i++){
        if(enemies[i].top >= document.getElementById('enemies').clientHeight-60){
          d=0;
        
          moveEnemy();
          break;
        }
        else{
       
          enemies[i].top +=2.5;
        }
      }
    }  
  }


//constructor for creating bullets
function updateWeapon() {
  document.getElementById("weapons").innerHTML = "";
  var i;
  for (i = 0; i < weapons.length; i++) {
    document.getElementById("weapons").innerHTML +=
      "<div class='weapon' style='left:" +
      weapons[i].left +
      "px; top:" +
      weapons[i].top +
      "px;'></div>";
  }
}

function moveWeapon() {
  var i;
  for (i = 0; i < weapons.length; i++) {
    weapons[i].left += 10;
  }
}

//updating ship
function updateShip() {
  document.getElementById("ship").style.left = ship.left + "px";
  document.getElementById("ship").style.top = ship.top + "px";
}

document.addEventListener("keydown", move);

function move(e) {
  switch (e.keyCode) {
    case 37:
      if (ship.left <= 10) {
        console.log("can't move futher left");
      } else {
        ship.left -= 10;
      }
      updateShip();
      break;

    case 39:
      if (ship.left >= document.documentElement.clientWidth - 60) {
        console.log("can't move further right");
      } else {
        ship.left += 10;
      }
      updateShip();
      break;

    case 38:
      if (ship.top <= 64) {
        console.log("can't move upward");
      } else {
        ship.top -= 10;
      }
      updateShip();
      break;

    case 40:
      if (ship.top >= document.documentElement.clientHeight - 60) {
        console.log("can't move downward");
      } else {
        ship.top += 10;
      }
      updateShip();
      break;

    case 32:
      weapons.push({ left: ship.left, top: ship.top-33 });
      updateWeapon();
      break;
  }
}

//hitting enemies with bullets ---> using Axis aligned bounding box theroem
function hitEnemiesWithBullets() {
  for (var i = 0; i < weapons.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (
        weapons[i].left < enemies[j].left + 50 &&
        weapons[i].left + 40 > enemies[j].left &&
        weapons[i].top < enemies[j].top + 50 &&
        weapons[i].top + 7 > enemies[j].top
      ) {
        score += 10;
        enemies.splice(j, 1);
        weapons.splice(i, 1);
      }
    }
  }
}

//if ship gets hit by enemies
function hitByEnemies() {
  for (var j = 0; j < enemies.length; j++) {
    if (
      ship.left < enemies[j].left + 50 &&
      ship.left + 50 > enemies[j].left &&
      ship.top -54< enemies[j].top + 50 &&
      ship.top+4  > enemies[j].top
    ) {
      lives--;
      enemies.splice(j, 1);
      respawn();
      updateShip();
    }
  }
  for( var j=0;j< enemyWeapon.length;j++){
    if(
      enemyWeapon[j].left > ship.left && enemyWeapon[j].left < ship.left+50 &&
      enemyWeapon[j].top+7 > ship.top-54 && enemyWeapon[j].top < ship.top +4
    ){
      lives--;
      respawn();
      enemyWeapon.splice(j,1);
      updateShip();
    }
  }
}

//respawning ship at its initial position after being attacked
function respawn() {
  ship.left = 0;
  ship.top = document.documentElement.clientHeight/2 - 25;
}

function updateStatus() {
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("level").innerHTML = "Level: " + level;
}

function checkForGameOver() {
  if (lives == 0) {
    localStorage.setItem("score", score);
    if (score > localStorage.getItem("highScore")) {
      localStorage.setItem("highScore", score);
    }
    window.location.href = "end.html";
  }
}

function loop() {
  setTimeout(loop, 50);
  moveWeapon();
  updateWeapon();
  moveEnemyUpDown();
  updateEnemy();
  hitEnemiesWithBullets();
  hitByEnemies();
  updateEweapon();
  moveEweapon();
  updateStatus();
  checkForGameOver();
  if(level_cleared()){
    level++;
    score+=50;
    createEnemy();
  }
  
}
updateShip();
createEnemy();
setInterval(ShootShip, time);
document.addEventListener("keydown", move);
loop();
function out(enemy){
  return enemy.left <= 0;
}
function level_cleared(){
  if(enemies.every(out) || enemies.length==0){
    return true;
   }
   else{
     return false;
   }
}
function ShootShip(){
  var i=Math.floor(Math.random() * 28);
  console.log(i);
  enemyWeapon.push(
    {left: enemies[i].left,
     top: enemies[i].top}
     );
    // console.log(enemies[i].left,enemies[i].top);
}
function updateEweapon(){
  document.getElementById("enemy-weapons").innerHTML = "";
    var i;
    for (i = 0; i < enemyWeapon.length; i++) {
      document.getElementById("enemy-weapons").innerHTML +=
        "<div class='enemy-weapon' style='left:" +
        enemyWeapon[i].left +
        "px; top:" +
        enemyWeapon[i].top +
        "px;'></div>";
    }
}
function moveEweapon(){
  var i;
    for (i = 0; i < enemyWeapon.length; i++) {
        if(enemyWeapon[i].left >= -40){
            enemyWeapon[i].left -= 10;  
        }
    }
}