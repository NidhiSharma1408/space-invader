// This functions handles the background music as the pages loads
window.onload = function () {
  document.getElementById("theme_song").play();
};

/*setting the heigth of <div> that will contain enemies, weapon of ship, weapon of enemy.
 54 px is the height of container that shows score,lives and levels*/
document.querySelector("#enemies").style.height =
  document.documentElement.clientHeight - 54 + "px";
document.querySelector("#weapons").style.height =
  document.documentElement.clientHeight - 54 + "px";
document.querySelector("#enemy-weapons").style.height =
  document.documentElement.clientHeight - 54 + "px";

//Creation of audio objects.
var shooting = new Audio("../sounds/shoot.wav");
var self_explosion = new Audio("../sounds/explosion.wav");
var alien = new Audio("../sounds/ufo.wav");
var alien_explosion = new Audio("../sounds/hit.wav");
var Bullet_collision = new Audio("../sounds/B_hit.wav");

//Ship object - initialising the position of player's ship.
var ship = {
  left: 10,
  top: document.documentElement.clientHeight / 2 - 25,
};

//----variable declaration----'
var lives = 3; //stores lives of player's ship throughout the game.
var score = 0; //stores scores of the player throughout the game.
var flag = 0; //controls direction of enemy - up or down
var time = 2500; // enemies shooting frequency; intially shoot one time in 2 sec
var level = 1; //levels of game.
var weapons = []; //stores location of player's bullets as objects.
var enemies = []; //stores location of enemies as objects.
var enemyWeapon = []; //stores location of enemies's bullets as objects.
var power = []; //stores power-ups.
var delay = false;
var bullets = 30;
var meteors = []; //stores location of meteors as objects.

/*function to set initial position of enemies.
->starts allocating positions to enemies from top.
->when last enemy in the respective column is 120px above the screen bottom, next column will be initialised.
*/
function createEnemy() {
  if (lives <= 0) {
    return;
  } else {
    var _left = document.getElementById("enemies").clientWidth - 50;
    var _top = 10;
    for (var i = 0; i < 29; i++) {
      if (level > 1) {
        alien.play();
      }
      enemies.push({ left: _left, top: _top });
      _top += 70;
      if (_top >= document.getElementById("enemies").clientHeight - 120) {
        _top = 10;
        _left += 70;
      }
    }
  }
}

/*Funtion to update enemy's position:
->assigns new enemy(Boss) from level 2.
->updates left and top position of enemies.
*/
function updateEnemy() {
  document.getElementById("enemies").innerHTML = "";
  var i;
  for (i = 0; i < enemies.length; i++) {
    if (i == enemies.length - 1 && level >= 2) {
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

/*Function to move enemies:
->moves enemies in forward direction.
->removes enemy's object from the array as soon as the crosses the left side of the screen.
*/
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

/*function to set the path of enemies:
 -> if the enemies touches the bottom of screen, they starts moving upward
 -> if the enemies touches the top of screen, they starts moving downward
 -> calls the moveEnemy function for the conditions mentioned above.
*/
function moveEnemyUpDown() {
  if (lives <= 0) {
    return;
  }
  var len;
  if (level >= 2) {
    len = enemies.length - 1;
  } else {
    len = enemies.length;
  }
  if (flag == 0) {
    for (var i = 0; i < len; i++) {
      if (enemies[i].top <= 10) {
        flag = 1;
        moveEnemy();
        break;
      } else {
        enemies[i].top -= 2.5;
      }
    }
  }
  if (flag == 1) {
    for (var i = 0; i < len; i++) {
      if (
        enemies[i].top >=
        document.getElementById("enemies").clientHeight - 60
      ) {
        flag = 0;
        moveEnemy();
        break;
      } else {
        enemies[i].top += 2.5;
      }
    }
  }
  updateEnemy();
}

/*function to set initial position of meteors.
->starts allocating positions to meteors from left.
->when last meteors in the respective row is 100px to the left of right, next row will be initialised.
*/
function createMeteor() {
  if (lives <= 0 || level < 2) {
    return;
  }
  lives += 2;
  var _top = 10;
  var _left = 100;
  var i;
  for (i = 1; i <= 24; i++) {
    meteors.push({ left: _left, top: _top });
    _left += 200;
    if (_left >= document.documentElement.clientWidth - 100) {
      _top += 150;
      _left = 150;
    }
  }
}

/*Funtion to update meteor's position:
->updates left and top position of meteors.
*/
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

/*Function to move meteors:
->moves meteors in downwards direction.
->removes meteor's object from the array as soon as the crosses the bottom of the screen.
*/
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

/*Funtion to update player's weapon's position:
->updates left and top position of bullets.
*/
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

/*Function to move player's bullets:
->moves bullets in forward direction.
->removes bullet's object from the array as soon as the crosses the right side of the screen.
*/
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

//Function to update the value of player's ship.
function updateShip() {
  document.getElementById("ship").style.left = ship.left + "px";
  document.getElementById("ship").style.top = ship.top + "px";
}

/*function to move player's ship:
->takes event object from event handling function, if possible.
->uses 37 keycode to move ship towards left, if possible.
->uses 39 keycode to move ship towards right, if possible.
->uses 38 keycode to move ship upwards, if possible.
->uses 40 keycode to move ship downwards, if possible.
->uses 42 keycode to shoot bullets.
*/
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
      if (delay == false && bullets != 0) {
        delay == true;
        shooting.play();
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

/*Funtion to check player's bullet collision with enemy:
if so:
  -> increase score
  -> remove that enemy that was hit from the enemies array.
  -> remove that bullet from the weapons array. 
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
        alien_explosion.play();
        score += 10;
        enemies.splice(j, 1);
        weapons.splice(i, 1);
        break; //if we don't use break here, it will throw an error in case when only one weapon is there.
      }
    }
  }
}

/*Function to check if the player gets hit by enemy, its weapon or meteor:
if so: 
-> decrease remaining lives. 
-> respawn the ship. 
-> remove the bullet/enemy-ship/meteor that hit the ship. 
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
  //check if enemy's weapon hit the ship.
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

/*Funtion to dectect Bullet to bullet collision:
->checks if player's bullet and enemy's bullet gets hit.
->if so, the increases bullet by 1 and scores by 5, along with removing both the bullets.
*/
function bullletToBulletCollision() {
  for (i = 0; i < weapons.length; i++) {
    for (j = 0; j < enemyWeapon.length; j++) {
      if (
        enemyWeapon[j].top + 15 >= weapons[i].top &&
        enemyWeapon[j].top <= weapons[i].top + 15 &&
        enemyWeapon[j].left + 42 >= weapons[i].left &&
        enemyWeapon[j].left <= weapons[i].left + 42
      ) {
        bullets++;
        Bullet_collision.play();
        enemyWeapon.splice(j, 1);
        weapons.splice(i, 1);
        score += 5;
        break;
      }
    }
  }
}

/*Function to respawn player's ship:
->sends player's ship back to it's initial position.
->activates power-ups.
*/
function respawn() {
  self_explosion.play();
  ship.left = 10;
  ship.top = document.documentElement.clientHeight / 2 - 25;
  power_ups();
}

//Function to check if all the enemies exits the screen.
function out(enemy) {
  return enemy.left <= ship.left;
}

//Function to check if current level gets completed.
function level_cleared() {
  if (enemies.every(out) || enemies.length == 0) {
    return true;
  } else {
    return false;
  }
}

/*Function to shoot player's ship:
->checks if enemies are still alive.
->Randomly chooses an enemy and make it shoot the player's ship.
->Makes Boss enemy shoot the player from level 2 onwards.
*/
function ShootShip() {
  if (lives <= 0) {
    return;
  }
  //no shooting when there is no enemy
  if (enemies.length == 0) {
    return;
  }
  var i = getRandomNum(0, enemies.length - 1);
  enemyWeapon.push({ left: enemies[i].left, top: enemies[i].top - 25 });
  if (level >= 2) {
    i = enemies.length - 1;
    enemies[i].top = ship.top - 54;
    enemies[i].left = enemies[i - 1].left + 150;
    enemyWeapon.push({
      left: enemies[i].left,
      top: enemies[i].top + 17.5,
    });
  }
}

/*Funtion to update enemy's bullets position:
->updates left and top position of enemy's bullets.
*/
function updateEnemyweapon() {
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

/*funtion to move enemy's bullets:
->move enemy's bullets towards left.
->making bullets disappear when bullets crosses the player's ship.
*/
function moveEnemyweapon() {
  var i;
  for (i = 0; i < enemyWeapon.length; i++) {
    if (enemyWeapon[i].left > ship.left) {
      enemyWeapon[i].left -= 10;
    } else {
      enemyWeapon.splice(i, 1);
    }
  }
  updateEnemyweapon();
}

/*function to update game status:
->updates lives.
->updates scores.
->updates levels
->bullet count.
*/
function updateStatus() {
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("level").innerHTML = "Level: " + level;
  document.getElementById("bullets").innerHTML =
    "Bullets remaining: " + bullets;
}

/*Function to display GameOver and update scores.
->sets score for GameOver screen.
->sets highest level reached.
->sets high scores.
->Displays Game Over.
*/
function GameOver() {
  localStorage.setItem("score", score);

  //if the score is greater than the highscore, update highscore
  if (score > localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", score);
  }

  localStorage.setItem("level", level);

  //if the level is greater than the highest level, update highest level
  if (level > localStorage.getItem("highestLevel")) {
    localStorage.setItem("highestLevel", level);
  }
  document.getElementById("player_score").innerHTML =
    "Your Score: " + localStorage.getItem("score");

  document.getElementById("player_level").innerHTML =
    "Your level: " + localStorage.getItem("level");

  document.getElementById("game-over").style.visibility = "visible";
}

//Function to return a random number from the given range.
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Function for effects of power-ups:
->checks collision with power ups.
->checks the type:
  -power[0]-> life + extra score points.
  -power[1]-> 5 bullets + extra score points.
*/
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
      lives++;
    } else {
      bullets += 5;
    }
    score += 30;
  }
}

//Function to update and manage power ups visibility.
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

//Function to create power ups at random location.
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

//Function to loop throw all necessary game functions.
function loop() {
  var id = setTimeout(loop, 50);
  moveWeapon();
  moveEnemyUpDown();
  moveMeteor();
  hitEnemiesWithBullets();
  hitByEnemies();
  bullletToBulletCollision();
  moveEnemyweapon();
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
    if (level > 2) time = 2500;
    time -= 250;
    bullets = bullets + 30;
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
