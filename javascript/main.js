//ship object
var ship = {
  left: 0,
  top: 288,
};

var weapons = [];

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

function loop() {
  setTimeout(loop, 70);
  moveWeapon();
  updateWeapon();
  collideWithOwnBullet();
}
loop();

var lives = 3;
function collideWithOwnBullet() {
  for (var i = 0; i < weapons.length; i++) {
    if (
      ship.left + 9 >= weapons[i].left &&
      ship.left <= weapons[i].left &&
      ship.top >= weapons[i].top - 10
    ) {
      weapons[i] = "";
      lives--;
      document.getElementById("lives").innerHTML = "LIVES: " + lives;
      if (lives == 0) {
        document.getElementById("end").style.display = "block";
      }
    }
  }
}
