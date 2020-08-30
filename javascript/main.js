//Hero object
var ship = {
  left: 0,
  top: 288,
};

var weapons = [];
var enemies = [];
//constructor for creating enemies
function updateEnemy() {
    document.getElementById("enemies").innerHTML = "";
    var i;
    for (i = 0;i< enemies.length; i++){
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
    for( i =0; i< enemies.length; i++) {
        if(enemies[i].left >= -50){
          enemies[i].left -= 3;
        }   
    }
}

function createEnemy() {
    var l= document.documentElement.clientWidth - 50;
    var t= 60;
    for(i =1 ;i<=24 ;i++){
      enemies.push({ left: l, top: t});
      t+=90;
      if( t>= document.documentElement.clientHeight - 60)
      {
          t=60;
          l+=70;
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

function loop() {
  setTimeout(loop, 100);
  moveWeapon();
  updateWeapon();
  moveEnemy();
  updateEnemy();
}
loop();
createEnemy();
