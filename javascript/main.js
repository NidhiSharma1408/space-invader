//Hero object
var ship = {
  left: 0,
  top: 288,
};

var lives = 3;
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
  for (i = 1; i <= 24; i++) {
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
      weapons.push({ left: ship.left, top: ship.top });
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
}

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
  setTimeout(loop, 50);
  moveWeapon();
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
