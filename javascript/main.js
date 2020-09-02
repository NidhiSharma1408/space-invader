document.querySelector("#enemies").style.height =
  document.documentElement.clientHeight - 54 + "px";
document.querySelector("#weapons").style.height =
  document.documentElement.clientHeight - 54 + "px";
document.querySelector("#enemy-weapons").style.height =
  document.documentElement.clientHeight - 54 + "px";
//Hero object
var ship = {
  left: 10,
  top: document.documentElement.clientHeight / 2 - 25,
};

var lives = 5;
var score = 0;
var d = 0;
var time = 2000;
var level = 1;
var weapons = [];
var enemies = [];
var enemyWeapon = [];
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
    } else {
      enemies.splice(i, 1);
    }
  }
}

function createEnemy() {
  var l = document.getElementById("enemies").clientWidth - 50;
  var t = 10;
  for (i = 1; i <= 28; i++) {
    enemies.push({ left: l, top: t });
    t += 70;
    if (t >= document.getElementById("enemies").clientHeight - 120) {
      t = 10;
      l += 70;
    }
  }
}

function moveEnemyUpDown() {
  if (d == 0) {
    for (i = 0; i < enemies.length; i++) {
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
    for (i = 0; i < enemies.length; i++) {
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
    if (weapons[i].left >= document.documentElement.clientWidth) {
      weapons.splice(i, 1);
    }
  }
}

//updating ship
function updateShip() {
  document.getElementById("ship").style.left = ship.left + "px";
  document.getElementById("ship").style.top = ship.top + "px";
}

var delay = false;

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
      if (delay == false && weapons.length < 2) {
        delay == true;
        weapons.push({ left: ship.left, top: ship.top - 33 });
        updateWeapon();
        setTimeout(function () {
          delay = false;
        });
      }

      break;
  }
}

//hitting enemies with bullets ---> using Axis aligned bounding box theroem
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
        break;
      }
    }
  }
}

function splicingBullets() {
  for (var i = 0; i < weapons.length; i++) {
    if (weapons[i].left > document.documentElement.clientWidth) {
      weapons.splice(i, 1);
    }
  }
}

//if ship gets hit by enemies
function hitByEnemies() {
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
}

//respawning ship at its initial position after being attacked
function respawn() {
  ship.left = 0;
  ship.top = document.documentElement.clientHeight / 2 - 25;
  power_ups();
}

//Power_up function
var power = document.getElementById("power_ups");
var power_left;
var power_top;
function power_ups() {
  if (getRandomNum(0, 1) == 1) {
    var options = getRandomNum(0, 1);
    var a = getRandomNum(100, 800);
    var b = getRandomNum(0, 500);
    power.style.left = a + "px";
    power.style.top = b + "px";
    power_left = a;
    power_top = b;
    if (options == 0) {
      power.style.backgroundImage = "url('../images/hero.png')";
      captureBonus();
    } else {
      power.style.backgroundImage = "url('../images/enemy.png')";
      captureBonus();
    }
  }
}

/*
function captureBonus() {
  if (
    ship.left < power_left + 50 &&
    ship.left + 50 > power_left &&
    ship.top < power_top + 50 &&
    ship.top + 50 > power_top
  )
    alert("HIT!");
  power.style.display = "none";
}
*/
function updateStatus() {
  document.getElementById("lives").innerHTML = "Lives: " + lives;
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("level").innerHTML = "Level: " + level;
}

function checkForGameOver() {
  localStorage.setItem("score", score);
  if (score > localStorage.getItem("highScore")) {
    localStorage.setItem("highScore", score);
  }
  window.location.href = "end.html";
}

function loop() {
  setTimeout(loop, 30);
  moveWeapon();
  splicingBullets();
  updateWeapon();
  moveEnemyUpDown();
  updateEnemy();
  hitEnemiesWithBullets();
  hitByEnemies();
  updateEweapon();
  moveEweapon();
  updateStatus();
  if (lives == 0) checkForGameOver();
  if (level_cleared()) {
    level++;
    score += 50;
    lives++;
    time -= 500;
    if (time == 0) checkForGameOver();
    clearInterval(interval);
    var interval = setInterval(ShootShip, time);
    createEnemy();
  }
}
updateShip();
createEnemy();
var interval = setInterval(ShootShip, time);
document.addEventListener("keydown", move);
loop();
function out(enemy) {
  return enemy.left <= ship.left;
}

function level_cleared() {
  if (enemies.every(out) || enemies.length == 0) {
    return true;
  } else {
    return false;
  }
}
function ShootShip() {
  if (enemies.length == 0) {
    return;
  }
  var i = Math.floor(Math.random() * enemies.length);
  enemyWeapon.push({ left: enemies[i].left, top: enemies[i].top });
}
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
function moveEweapon() {
  var i;
  for (i = 0; i < enemyWeapon.length; i++) {
    if (enemyWeapon[i].left >= -40) {
      enemyWeapon[i].left -= 10;
    } else {
      enemyWeapon.splice(i, 1);
    }
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
