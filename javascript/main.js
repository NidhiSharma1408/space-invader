/*setting the heigth of <div> that will contain enemies, weapon of ship, weapon of enemy.
 '54 px in the height of container that shows score,lives and levels*/
document.querySelector("#enemies").style.height =
  document.documentElement.clientHeight - 54 + "px";
document.querySelector("#weapons").style.height =
  document.documentElement.clientHeight - 54 + "px";
document.querySelector("#enemy-weapons").style.height =
  document.documentElement.clientHeight - 54 + "px";

var shoot = new Audio("../sounds/shoot.wav");
var explosion = new Audio("../sounds/explosion.wav");
var alien = new Audio("../sounds/ufo.wav");
var kill = new Audio("../sounds/invaderkilled.wav");

//Hero object
var ship = {
  left: 10,
  top: document.documentElement.clientHeight / 2 - 25,
};

//----variable declaration----'
var lives = 3; //stroes remaining lives of ship; initially three
var score = 0; //stores score; initially zero
var d = 0; //controls direction of enemy .up pr down
var time = 2500; // enemies shooting frequency; intially shoot one time in 2 sec
var level = 1; //levels of game; initially level is one
var weapons = []; // wepoon or bullets of ship
var enemies = []; //enemies
var enemyWeapon = []; //weapon or bullets of enemies
var power = []; //power ups
var delay = false;
var bullets = 30;
var meteors = [];

//----creating enemies in html----
function updateEnemy() {
  document.getElementById("enemies").innerHTML = "";
  var i;
  for (i = 0; i < enemies.length; i++) {
    if(i==enemies.length-1){
      document.getElementById("enemies").innerHTML +=
      "<div class='enemy boss' style='left:" +
      enemies[i].left +
      "px; top:" +
      enemies[i].top +
      "px;'></div>";
      break;
    }
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
    } else {
      enemies.splice(i, 1);
    }
  }
}

//----setting initial position of enemies----
function createEnemy() {
  if (lives <= 0) {
    return;
  } else {
    var l = document.getElementById("enemies").clientWidth - 50;
    var t = 10;
    for (var i = 0; i < 28; i++) {
      if(level>1){
        alien.play();
      }
      enemies.push({ left: l, top: t });
      t += 70;
      if (t >= document.getElementById("enemies").clientHeight - 120) {
        t = 10;
        l += 70;
      }
    }
  }
}

/*function to set the path of enemies:
 -> if the enemies touch the bottom of screen, start moving them upward
 -> if the enemies touch the top of screen, start moving them downward
 -> move enemies forward when any of them touches the bottom or top
*/
function moveEnemyUpDown() {
  if (lives <= 0) {
    return;
  }
  if (d == 0) {
    for (var i = 0; i < enemies.length -1; i++) {
      if (enemies[i].top <= 10) {
        d = 1;
        moveEnemy();
        break;
      } else {
        enemies[i].top -= 2.5;
      }
    }
  }
  if (d == 1) {
    for (var i = 0; i < enemies.length -1; i++) {
      if (
        enemies[i].top >=
        document.getElementById("enemies").clientHeight - 60
      ) {
        d = 0;
        moveEnemy();
        break;
      } else {
        enemies[i].top += 2.5;
      }
    }
  }
  updateEnemy();
}

function createMeteor() {
  if (lives <= 0) {
    return;
  }
  var t = 10;
  var l = 100;
  var i;
  for (i = 1; i <= 24; i++) {
    meteors.push({ left: l, top: t });
    l += 200;
    if (l >= document.documentElement.clientWidth - 100) {
      t += 150;
      l = 150;
    }
  }
}

function updateMeteor() {
  document.getElementById("meteors").innerHTML = "";
  var i;
  for (i = 0; i < meteors.length; i++) {
    document.getElementById("meteors").innerHTML +=
      "<div class='meteor' style='left:" +
      meteors[i].left +
      "px; top:" +
      meteors[i].top +
      "px;'></div>";
  }
}

function moveMeteor() {
  var i;
  for (i = 0; i < meteors.length; i++) {
    if (meteors[i].top <= document.documentElement.clientHeight) {
      meteors[i].top += 0.3;
    } else {
      meteors.splice(i, 1);
    }
  }
  updateMeteor();
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
    if (weapons[i].left >= document.documentElement.clientWidth) {
      weapons.splice(i, 1);
    }
  }
  updateWeapon();
}

//----updating ship's position in html----
function updateShip() {
  document.getElementById("ship").style.left = ship.left + "px";
  document.getElementById("ship").style.top = ship.top + "px";
}

function move(e) {
  if (lives <= 0) {
    return;
  }
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
      if (delay == false &&  bullets != 0) {
        delay == true;
        shoot.play();
        weapons.push({ left: ship.left, top: ship.top - 33 });
        bullets--;
        updateWeapon();
        setTimeout(function () {
          delay = false;
        });
      }
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
        kill.play();
        score += 10;
        enemies.splice(j, 1);
        weapons.splice(i, 1);
        break; //if we don't use break here, it will throw an error in case when only one weapon is there.
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
  if (lives <= 0) {
    return;
  }
  for (var j = 0; j < enemies.length; j++) {
    if (
      ship.left < enemies[j].left + 50 &&
      ship.left + 50 > enemies[j].left &&
      ship.top - 54 < enemies[j].top + 50 &&
      ship.top + 4 > enemies[j].top
    ) {
      lives--;
      enemies.splice(j, 1);
      respawn();
      updateShip();
    }
  }
  //check if enemies' weapon hit the ship.
  for (var j = 0; j < enemyWeapon.length; j++) {
    if (
      enemyWeapon[j].left > ship.left &&
      enemyWeapon[j].left < ship.left + 50 &&
      enemyWeapon[j].top + 15 > ship.top - 54 &&
      enemyWeapon[j].top < ship.top + 4
    ) {
      lives--;
      respawn();
      enemyWeapon.splice(j, 1);
      updateShip();
    }
  }

  for (var j = 0; j < meteors.length; j++) {
    if (
      ship.left < meteors[j].left + 30 &&
      ship.left + 50 > meteors[j].left &&
      ship.top - 54 < meteors[j].top + 30 &&
      ship.top + 4 > meteors[j].top
    ) {
      lives--;
      meteors.splice(j, 1);
      respawn();
      updateShip();
    }
  }
}

//----respawning ship at its initial position after being attacked----
function respawn() {
  explosion.play();
  ship.left = 10;
  ship.top = document.documentElement.clientHeight / 2 - 25;
  power_ups();
}

//----returns true when ship has crossed all enemies----
function out(enemy) {
  return enemy.left <= ship.left;
}

//----returns true if the current level is completed----
function level_cleared() {
  if (enemies.every(out) || enemies.length == 0) {
    return true;
  } else {
    return false;
  }
}

//----random enemy will shoot the ship.----
function ShootShip() {
  if (lives <= 0) {
    return;
  }
  //no shooting when there is no enemy
  if (enemies.length == 0) {
    return;
  }
  var i = Math.floor(Math.random() * enemies.length);
  enemyWeapon.push({ left: enemies[i].left, top: enemies[i].top - 25 });
  i = enemies.length - 1;
  enemies[i].top = ship.top-50;
  enemyWeapon.push({
    left: enemies[i].left,
    top: enemies[i].top + 20,
  });

}

//----creating enemies's weapon in html----
function updateEweapon() {
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

//----move enemies' weapon forward. remove them when they cross the ship----
function moveEweapon() {
  var i;
  for (i = 0; i < enemyWeapon.length; i++) {
    if (enemyWeapon[i].left > ship.left) {
      enemyWeapon[i].left -= 10;
    } else {
      enemyWeapon.splice(i, 1);
    }
  }
  updateEweapon();
}

//----update score, remaining life and current level----
function updateStatus() {
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("level").innerHTML = "Level: " + level;
  document.getElementById("bullets").innerHTML =
    "Bullets remaining: " + bullets;
}

//----stop the game and move to result's page; store the current score in local storage----
function GameOver() {
  localStorage.setItem("score", score);
  //if the score is greater than the highscore, update highscore
  if (score > localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", score);
  }
  document.getElementById("player_score").innerHTML =
    "Your Score: " + localStorage.getItem("score");
  document.getElementById("game-over").style.visibility = "visible";
}

//----returns random number between a given range----
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//---if ship catches the bonus then increase life and score---
function captureBonus() {
  if (lives <= 0) {
    return;
  }
  if (power.length == 0) {
    return;
  }
  if (
    ship.left < power[0].left + 50 &&
    ship.left + 50 > power[0].left &&
    ship.top < power[0].top + 50 &&
    ship.top + 50 > power[0].top
  ) {
    power.splice(0, 1);
    if (power[0] == 0) {
      if (lives < 3) {
        lives++;
      }
      score += 30;
    } else {
      bullets += 5;
      score += 30;
    }
  }
}

//---manage visibily of power ups in html----
function updatePower() {
  var power_up = document.querySelector("#power_ups");
  if (power.length == 0) {
    power_up.style.visibility = "hidden";
    return;
  }
  power_up.style.visibility = "visible";
  power_up.style.left = power[0].left + "px";
  power_up.style.top = power[0].top + "px";
}
//----create power ups and updates them----
function power_ups() {
  if (lives <= 0) {
    return;
  }
  if (power.length != 0) {
    power.splice(0, 1);
  }
  if (getRandomNum(0, 1) == 1) {
    var options = getRandomNum(0, 1);
    power.push({
      left: getRandomNum(
        10,
        document.getElementById("background").clientWidth / 2
      ),
      top: getRandomNum(
        54,
        document.getElementById("background").clientHeight - 50
      ),
    });
    updatePower();
    var power_up = document.querySelector("#power_ups");
    if (options == 0) {
      power_up.style.backgroundImage = "url('../images/fuel.png')";
    } else {
      power_up.style.backgroundImage = "url('../images/blast.gif')";
    }
  }
}

//----game control function---
function loop() {
  var id = setTimeout(loop, 50);
  moveWeapon();
  moveEnemyUpDown();
  moveMeteor();
  hitEnemiesWithBullets();
  hitByEnemies();
  WWcollision();
  moveEweapon();
  updateStatus();
  captureBonus();
  updatePower();
  if (lives <= 0) {
    clearInterval(id);
    GameOver();
  }
  if (level_cleared()) {
    createEnemy();
    meteors = [];
    createMeteor();
    level++;
   
    score += 50;
    if (lives < 5) {
      lives++;
    }
    time -= 250;
    bullets = bullets + 28;
    weapons.splice(0, weapons.length);
    updateWeapon();
    if (time <= 500) {
      clearInterval(id);
      GameOver();
    }
    clearInterval(shootInterval);
    var shootInterval = setInterval(ShootShip, time);
  }
}

//----initialise the game----
updateShip();
createEnemy();
createMeteor();

var shootInterval = setInterval(ShootShip, time);
document.addEventListener("keydown", move);
loop();
setInterval(power_ups, 2000);
function WWcollision(){
  for(i = 0 ; i< weapons.length; i++){
    for(j = 0; j<enemyWeapon.length;j++){
      if(
        enemyWeapon[j].top+15 >= weapons[i].top && enemyWeapon[j].top <= weapons[i].top+15 && 
        enemyWeapon[j].left+42 >= weapons[i].left && enemyWeapon[j].left <= weapons[i].left+42
      ){
        bullets++;
        explosion.play();
        enemyWeapon.splice(j,1);
        weapons.splice(i,1);
        score +=2; 
        break;
      }

    }
  }
}