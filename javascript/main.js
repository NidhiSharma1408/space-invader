//Hero object
var ship = {
  left: 0,
  top: 288,
};

var lives = 5;
var score = 0;
var weapons = [];
var enemies = [];
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
      enemies[i].left -= 3;
    }
  }
}

function createEnemy() {
  var l = document.documentElement.clientWidth - 50;
  var t = 105;
  var count = 0;
  for (i = 1; i <= getRandomNum(16, 24); i++) {
    enemies.push({ left: l, top: t });
    t += 90;

    if (t >= document.documentElement.clientHeight - 60) {
      count++;
      if (count % 2 == 0) {
        t = 105;
      } else {
        t = 30;
      }

      l += 70;
    }
  }
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

var cooldown = false;

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
      if (ship.top <= 10) {
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
      //cooling down bullets whe firing
      if (cooldown == false && weapons.length < 2) {
        cooldown = true;
        weapons.push({ left: ship.left, top: ship.top });
        updateWeapon();
        setTimeout(function () {
          cooldown = false;
        }, 5);
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
        weapons[i].left + 7 > enemies[j].left &&
        weapons[i].top < enemies[j].top + 50 &&
        weapons[i].top + 40 > enemies[j].top
      ) {
        score += 10;
        enemies.splice(j, 1);
        weapons.splice(i, 1);
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
      ship.top < enemies[j].top + 50 &&
      ship.top + 50 > enemies[j].top
    ) {
      lives--;
      respawn();
    }
  }
}

//respawning ship at its initial position after being attacked
function respawn() {
  ship.left = 0;
  ship.top = 288;
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
  setTimeout(loop, 30);
  moveWeapon();
  splicingBullets();
  updateWeapon();
  moveEnemy();
  updateEnemy();
  hitEnemiesWithBullets();
  hitByEnemies();
  updateStatus();
  checkForGameOver();
}
loop();
createEnemy();
