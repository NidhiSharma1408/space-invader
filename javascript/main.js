var hero = {
    left: 0,
    top: 288
}
function drawHero(){
    document.getElementById('hero').style.left = hero.left + 'px';
    document.getElementById('hero').style.top = hero.top + 'px';
}
document.onkeydown = function(e) {
    if (e.keyCode === 37) {
        // Left
        if(hero.left <= 10){
            console.log("cant move futher left");
        }
        else{
            hero.left = hero.left - 10;
        }
    }
    if (e.keyCode === 39) {
        //Right
        if(hero.left >= document.documentElement.clientWidth-60){
            console.log("cant move further right")
        }
        else{
            hero.left = hero.left + 10;
       } 
    }
    if(e.keyCode === 38){
        //up
        if(hero.top <= 10){
            console.log("cant move upward");
        }
        else{
            hero.top = hero.top - 10;
        } 
    }
    if(e.keyCode === 40){
        //down 
        if(hero.top >= document.documentElement.clientHeight-60){
            console.log("cant move downward");
        }
        else{
            hero.top = hero.top + 10; 
        }
    }
    drawHero();   
}
