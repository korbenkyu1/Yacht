const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 1600;
const menu = document.querySelector("#menu");
const restartButton = menu.querySelector("button");

const mouse = {
    x: 0,
    y: 0,
    clicked: false
}
const keys = [];
let left = false, right = false;
const fps = 60;
let score = 0;
let scrollSpeed = 5;
let scrollAcceleration = 0.006;
let animation = 0;
ctx.font = '100px Georgia';

const player = {
    x: 425,
    y: 950,
    w: 40,
    h: 40,
    _x: 425,
    _y: 950,
    _w: 40, 
    _h: 40,
    img: new Image(),
    draw() {
        // draw hitbox
        // ctx.strokeStyle = 'red';
        ctx.drawImage(this.img, this.x, this.y-10);
        ctx.drawImage(this.img, this._x, this._y-10);    
        // ctx.strokeRect(this.x, this.y, this.w, this.h);
    },
    collision(obstacle){
        return this.x<obstacle.x+obstacle.w&&this.x+this.w>obstacle.x &&this.y<obstacle.y+obstacle.h&&this.y+this.h>obstacle.y
        || this._x<obstacle.x+obstacle.w&&this._x+this._w>obstacle.x &&this._y<obstacle.y+obstacle.h&&this._y+this._h>obstacle.y; 
    },
    update(){
        if(keys['KeyW']||keys['ArrowUp']||(mouse.clicked === true && mouse.y-player.y<-5)){ 
            player.y -= 5;
            if(player.y<0)
                player.y = 0;
        }
        if(keys['KeyS']||keys['ArrowDown']||(mouse.clicked === true && mouse.y-player.y>5)){
            player.y += 15;
            if(player.y+player.h>canvas.height) 
                player._y = player.y = canvas.height-player.h;
            obstacles.forEach((obstacle)=>{
                if(this.collision(obstacle))
                    player.y = obstacle.y-player.h;
            });
        } 

        if(left||keys['KeyA']||keys['ArrowLeft']||(mouse.clicked === true && mouse.x<player.x)){ 
            player.x -= 10;
            if(player.x+player.w<0)
                player.x += canvas.width;
            obstacles.forEach((obstacle)=>{
                if(this.collision(obstacle))
                    player.x = obstacle.x+obstacle.w;
            });
        }
        if(right||keys['KeyD']||keys['ArrowRight']||(mouse.clicked === true && mouse.x>player.x)){
            player.x += 10;
            if(player.x>canvas.width)
                player.x -= canvas.width;
            obstacles.forEach((obstacle)=>{
                if(this.collision(obstacle))
                    player.x = obstacle.x-player.w;
            });
        }
        if(player.x+player.w<0)
                player.x += canvas.width;
        if(player.x+player.w>canvas.width)
                player.x -= canvas.width;
        player._x = player.x + canvas.width;
        player._y = player.y;
    },
}
player.img.src = 'yacht.png';

class Obstacle {
    constructor(x=0, y=-50, w=50, h=50) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        this.y += scrollSpeed;
        if(player.collision(this)){
            clearInterval(animation);
            restartButton.innerText = 'Replay';
            menu.classList.remove('hidden');
        }
        if(this.y>canvas.height){
            this.w = Math.random()*75 + 125;
            this.h = Math.random()*75 + 125;
            this.x = Math.random()*(canvas.width-this.w);
            this.y = -250-Math.random()*500;
        }
    }
}
const obstacles = [];

class Cloud{
    constructor(x=0, y=-50, w=50, h=50){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw(){
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = 'snow';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.globalAlpha = 1;
    }
    update(){
        this.y += scrollSpeed * 1.1;
        if(this.y>canvas.height){
            this.x = Math.random()*(canvas.width-50);
            this.y = -250-Math.random()*800;
            this.w = Math.random()*50 +50;
            this.h = Math.random()*200 + 50;
        }
    }
}
const clouds = [];

class Particle {
    constructor(x=0, y=-50, w=8, h=8) {
        this.x = x-w/2;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = (Math.random()-0.5)*3;
        this.vy = (Math.random()-0.1)*6;
        this.t = Math.random()*100+100;
        this.color = Math.random()>0.5 ? 'blue' : 'white';
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x-this.w/2, this.y, this.w, this.h);
    }
    update(){
        this.x += this.vx;
        this.y += scrollSpeed + this.vy;
        if(this.t<0)
            particles.splice(index, 1);
            this.t--;
    }
}
const particles = [];

function init(){
    score = 0;
    scrollSpeed = 5;
    scrollAcceleration = 0.006;
    player.x = player._x = 425;
    player.y = player._y = 950;
    obstacles.length = 0;
    for(let i=0; i<3; i++){
        const obstacle1 = new Obstacle(0,0,0,0);
        obstacle1.w = Math.random()*75 + 125;
        obstacle1.h = Math.random()*75 + 125;
        obstacle1.x = Math.random()*(canvas.width-this.w);
        obstacle1.y = -200-Math.random()*100;
        obstacles.push(obstacle1);
        const obstacle2 = new Obstacle(0,0,0,0);
        obstacle2.w = Math.random()*75 + 125;
        obstacle2.h = Math.random()*75 + 125;
        obstacle2.x = Math.random()*(canvas.width-this.w);
        obstacle2.y = -800-Math.random()*100;
        obstacles.push(obstacle2);
        const obstacle3 = new Obstacle(0,0,0,0);
        obstacle3.w = Math.random()*75 + 125;
        obstacle3.h = Math.random()*75 + 125;
        obstacle3.x = Math.random()*(canvas.width-this.w);
        obstacle3.y = -1600-Math.random()*100;
        obstacles.push(obstacle3);
    }
    for(let i=0; i<5; i++){
        clouds.push(new Cloud(Math.random()*(canvas.width-50), -250-Math.random()*800, Math.random()*50 +50, Math.random()*200 + 50));
        clouds.push(new Cloud(Math.random()*(canvas.width-50), -500-Math.random()*800, Math.random()*50 +50, Math.random()*200 + 50));
    }

}
function run() {
    score += scrollSpeed;
    // input
    player.update();
    // clear screen
    ctx.fillStyle = 'lightskyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i=0; i<scrollSpeed/5; i++)
        particles.push(new Particle(player.x+player.w/2+4, player.y+player.h-5, 8, 8));

    particles.forEach((particle, index, particles)=>{
        particle.x += particle.vx;
        particle.y += scrollSpeed + particle.vy;
        if(particle.t<0)
            particles.splice(index, 1);
        particle.t--;
        particle.draw();
    });

    player.draw();

    obstacles.forEach((obstacle)=>{
        obstacle.update();
        obstacle.draw();
    });
    
    clouds.forEach((cloud)=>{
        cloud.update();
        cloud.draw();
    });

    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`${parseInt(score/1000)}`, canvas.width/2, 200);
    scrollSpeed += scrollAcceleration;
}

window.addEventListener('keydown', function(event){
    keys[event.code] = true;
});
window.addEventListener('keyup', function(event){
    keys[event.code] = false;
});
canvas.addEventListener('mousedown', function(){
    mouse.clicked = true;
});
window.addEventListener('touchstart', function(event){
    if(event.changedTouches[0].clientX<window.innerWidth/2){
        left = true;
    } else {
        right = true;
    }
});
canvas.addEventListener('mouseup', function(){
    mouse.clicked = false;
});
window.addEventListener('touchend', function(){
    left = false;
    right = false;
});
canvas.addEventListener('mousemove', function(event){
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouse.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
});
restartButton.addEventListener("click", function(){
    menu.classList.add('hidden');
    init();
    animation = setInterval(run, 1000/fps);
})
