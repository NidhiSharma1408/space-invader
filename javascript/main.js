/*setting the heigth of <div> that will contain enemies, weapon of ship, weapon of enemy.
 '54 px in the height of container that shows score,lives and levels*/
document.querySelector('#enemies').style.height = document.documentElement.clientHeight - 54 +'px';
document.querySelector('#weapons').style.height = document.documentElement.clientHeight - 54 +'px';
document.querySelector('#enemy-weapons').style.height = document.documentElement.clientHeight - 54 +'px';

//----variable declaration----
//Hero object
var ship = {
  left: 10,
  top: document.documentElement.clientHeight/2 - 25,
};
var lives = 3;      //stroes remaining lives of ship; initially three
var score = 0;      //stores score; initially zero
var d=0;            //controls direction of enemy .up pr down 
var time=2000;      // enemies shooting frequency; intially shoot one time in 2 sec
var level =1;       //levels of game; initially level is one
var weapons = [];   // wepoon or bullets of ship
var enemies = [];  //enemies 
var enemyWeapon=[];//weapon or bullets of enemies

//----creating enemies in html----
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

//----move enemies in forward direction and remove them once they cross the screen----
function moveEnemy() {
  var i;
  for (i = 0; i < enemies.length; i++) {
    if (enemies[i].left >= -50) {
      enemies[i].left -= 50;
    }
    else{
      enemies.splice(i,1);
    }
  }
}

//----setting initial position of enemies----
function createEnemy() {
  var l= document.getElementById('enemies').clientWidth - 50;
  var t= 10;
  for(i =1 ;i<=28 ;i++){
    enemies.push({ left: l, top: t});
    t+=70;
    if( t>= document.getElementById('enemies').clientHeight - 120){
        t=10;
        l+=70;
    }
  }
}

/*function to set the path of enemies:
 -> if the enemies touch the bottom of screen, start moving them upward
 -> if the enemies touch the top of screen, start moving them downward
 -> move enemies forward when any of them touches the bottom or top
*/
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

//----creating weapons in html----
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

//----move ship's weapon----
function moveWeapon() {
  var i;
  for (i = 0; i < weapons.length; i++) {
    weapons[i].left += 10;
    //remove the weapon if when it goes outside the html page width 
    if(weapons[i].left >= document.documentElement.clientWidth){
      weapons.splice(i,1);
    }
  }
}

//----updating ship's position in html----
function updateShip() {
  document.getElementById("ship").style.left = ship.left + "px";
  document.getElementById("ship").style.top = ship.top + "px";
}

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

/* check if ship's weapon hit the enemies:
if so:
  -> increase score
  -> remove that enemy which was hit
  -> remove weapon 
*/

function hitEnemiesWithBullets() {
  for (var i = 0; i < weapons.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (
        weapons[i].left < enemies[j].left + 50 &&
        weapons[i].left + 42 > enemies[j].left &&
        weapons[i].top < enemies[j].top + 50 &&
        weapons[i].top + 15 > enemies[j].top
      ) {
        score += 10;
        enemies.splice(j, 1);
        weapons.splice(i, 1);
        break;//if we don't use break here, it will throw an error in case when only one weapon is there.
      }
    }
  }
}

/* check if ship collides with bullets or enemy-ship.
if so: 
-> decrease remaining lives. 
-> respawn the ship. 
-> remove the bullet/enemy-ship that hit the ship. 
-> update position of ship on screen
*/
function hitByEnemies() {
  //check if enemy hit the ship.
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
  //check if enemies' weapon hit the ship.
  for( var j=0;j< enemyWeapon.length;j++){
    if(
      enemyWeapon[j].left > ship.left && enemyWeapon[j].left < ship.left+50 &&
      enemyWeapon[j].top+15 > ship.top-54 && enemyWeapon[j].top < ship.top +4
    ){
      lives--;
      respawn();
      enemyWeapon.splice(j,1);
      updateShip();
    }
  }
}

//----respawning ship at its initial position after being attacked----
function respawn() {
  ship.left = 0;
  ship.top = document.documentElement.clientHeight/2 - 25;
}

//----returns true when ship has crossed all enemies----
function out(enemy){
  return enemy.left <= ship.left;
}

//----check if the current level is completed----
function level_cleared(){
  if(enemies.every(out) || enemies.length==0){
    return true;
   }
   else{
     return false;
   }
}

//----random enemy will shoot the ship.----
function ShootShip(){
  //no shooting when there is no enemy
  if(enemies.length==0){
    return;
  }
  var i=Math.floor(Math.random() * enemies.length);
  enemyWeapon.push(
    {left: enemies[i].left,
     top: enemies[i].top-25}
     );
}

//----creating enemies's weapon in html----
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

//----move enemies' weapon forward. remove them when they cross the screen---- 
function moveEweapon(){
  var i;
    for (i = 0; i < enemyWeapon.length; i++) {
        if(enemyWeapon[i].left >= -42){
            enemyWeapon[i].left -= 10;  
        }
        else{
          enemyWeapon.splice(i,1);
        }
    }
}

//----update score, remaining life and current level----
function updateStatus() {
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("level").innerHTML = "Level: " + level;
}

//----stop the game and move to result's page; store the current score in local storage----
function GameOver() {
    localStorage.setItem("score", score);
    //if the score is greater than the highscore, update highscore
    if (score > localStorage.getItem("highScore")) {
      localStorage.setItem("highScore", score);
    }
    window.location.href = "end.html";
}

//----game control function---
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
  if(lives==0)
    GameOver();
  if(level_cleared()){
    level++;
    score+=50;
    lives++;
    time -= 500;
    if(time == 0)
      GameOver();
    clearInterval(interval);
    var interval = setInterval(ShootShip, time);
    createEnemy();
  }
  
}

//----initialise the game----
updateShip();
createEnemy();
var interval = setInterval(ShootShip, time);
document.addEventListener("keydown", move);
loop();

