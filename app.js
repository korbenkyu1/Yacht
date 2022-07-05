const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 1600;

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
let timer = 0;

const player = {
    x: 425,
    y: 950,
    w: 40,
    h: 40,
    img: new Image(),
    draw() {
        // draw hitbox
        // ctx.strokeStyle = 'red';
        ctx.drawImage(this.img, this.x, this.y-10);    
        // ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
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
}
const obstacles = [
    new Obstacle(Math.random()*(canvas.width-50), -250-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    new Obstacle(Math.random()*(canvas.width-50), -250-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    new Obstacle(Math.random()*(canvas.width-50), -250-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    
    new Obstacle(Math.random()*(canvas.width-50), -800-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    new Obstacle(Math.random()*(canvas.width-50), -800-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    new Obstacle(Math.random()*(canvas.width-50), -800-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    
    new Obstacle(Math.random()*(canvas.width-50), -1350-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    new Obstacle(Math.random()*(canvas.width-50), -1350-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
    new Obstacle(Math.random()*(canvas.width-50), -1350-Math.random()*500, Math.random()*80 + 100, Math.random()*80 + 100),
];
class Cloud {
    constructor(x=0, y=-50, w=50, h=50) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    draw() {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = 'snow';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.globalAlpha = 1;
    }
}
const clouds = [];
for(let i=0; i<5; i++){
    clouds.push(new Cloud(Math.random()*(canvas.width-50), -250-Math.random()*800, Math.random()*50 +50, Math.random()*200 + 50));
    clouds.push(new Cloud(Math.random()*(canvas.width-50), -500-Math.random()*800, Math.random()*50 +50, Math.random()*200 + 50));
}
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
}
const particles = [];

function run() {
    timer++;
    score += scrollSpeed;
    // input
    if(keys['KeyW']||keys['ArrowUp']||(mouse.clicked === true && mouse.y-player.y<-5)){ 
        player.y -= 5;
        if(player.y<0)
            player.y = 0;
    }
    if(keys['KeyS']||keys['ArrowDown']||(mouse.clicked === true && mouse.y-player.y>5)){
        player.y += 15;
        if(player.y+player.h>canvas.height)
            player.y = canvas.height-player.h;
        obstacles.forEach((obstacle)=>{
            if(collision(player, obstacle))
                player.y = obstacle.y-player.h;
        });
    } 

    if(left||keys['KeyA']||keys['ArrowLeft']||(mouse.clicked === true && mouse.x<player.x)){ 
        player.x -= 10;
        if(player.x+player.w<0)
            player.x += canvas.width;
        obstacles.forEach((obstacle)=>{
            if(collision(player, obstacle))
                player.x = obstacle.x+obstacle.w;
        });
    }
    if(right||keys['KeyD']||keys['ArrowRight']||(mouse.clicked === true && mouse.x>player.x)){
        player.x += 10;
        if(player.x>canvas.width)
            player.x -= canvas.width;
        obstacles.forEach((obstacle)=>{
            if(collision(player, obstacle))
                player.x = obstacle.x-player.w;
        });
    }
    if(player.x+player.w<0)
            player.x += canvas.width;
    if(player.x>canvas.width)
            player.x -= canvas.width;

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
        obstacle.y += scrollSpeed;
        if(collision(player, obstacle)){
            clearInterval(animation);
        }
        if(obstacle.y>canvas.height){
            obstacle.x = Math.random()*(canvas.width-50);
            obstacle.y = -250-Math.random()*500;
            obstacle.w = Math.random()*80 + 125;
            obstacle.h = Math.random()*80 + 125;
        }
        obstacle.draw();
    });
    
    clouds.forEach((cloud)=>{
        cloud.y += scrollSpeed * 1.1;
        if(cloud.y>canvas.height){
            cloud.x = Math.random()*(canvas.width-50);
            cloud.y = -250-Math.random()*800;
            cloud.w = Math.random()*50 +50;
            cloud.h = Math.random()*200 + 50;
        }
        cloud.draw();
    });

    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`${parseInt(score/1000)}`, canvas.width/2, 200);
    scrollSpeed += scrollAcceleration;
}

function collision(player, obstacle) {
    return player.x<obstacle.x+obstacle.w&&player.x+player.w>obstacle.x &&player.y<obstacle.y+obstacle.h&&player.y+player.h>obstacle.y;
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
canvas.addEventListener('touchstart', function(){
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    if(mouse.x<canvas.width/2){
        left = true;
    } else {
        right = true;
    }
});
canvas.addEventListener('touchend', function(){
    left = false;
    right = false;
});
canvas,addEventListener('mousemove', function(event){
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouse.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
});
animation = setInterval(run, 1000/fps);
