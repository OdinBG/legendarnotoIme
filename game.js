// Creating variables
var canvas = document.getElementsByTagName("canvas")[0];
var geometry = [new THREE.BoxBufferGeometry( 5, 5, 5 ), new THREE.BoxBufferGeometry( 5, 5, 5 )];
var egeometry = new THREE.BoxBufferGeometry( 2, 15, 2 );
var sphere = new THREE.SphereGeometry( 0.5, 10, 10 );
var material = new THREE.MeshPhongMaterial({color: '#5f5f5f'});
var material2 = new THREE.MeshPhongMaterial({color: '#5f5f5f'});
var bmaterial = new THREE.MeshPhongMaterial({color: 'yellow'});
var ematerial = new THREE.MeshPhongMaterial({color: 'red'});
var bgeometry = new THREE.SphereGeometry(0.125, 10, 10);

var texture = new THREE.TextureLoader().load( 'az.jpg' );
var textureMaterial = new THREE.MeshBasicMaterial( { map: texture } );

var floorGeometry = new THREE.BoxBufferGeometry( 10000, 1, 10000 );
var floor = new THREE.Mesh(floorGeometry, material2);
floor.position.set(0, -4, 0);
scene.add(floor);

var nw = 0, ne = 500;
var wall = [], t = [];

var hand = 1;

var health = 150;

let bvel = 2;
var enemy = [];
var bullets = [], dx=[], dy2=[], dz=[];

for (var i=0; i<ne; ++i){
    enemy[i] = new THREE.Mesh(egeometry, ematerial);
    enemy[i].position.set(Math.random()*144 - 121, 0, Math.random()*(1336 + 1347) - 1336);
    scene.add(enemy[i]);
}

var h = 2;

var light = new THREE.PointLight( );
var light2 = new THREE.PointLight( );
var light3 = new THREE.PointLight( );
light.position.set(2000, 200, 2000);
light2.position.set(-1000, 200, -2000);
light3.position.set(0, 200, 0);
scene.add( light );
scene.add( light2 );
scene.add( light3 );

var cx = Math.floor(Math.random()*200), cy = 10, cz = Math.floor(Math.random()*200), dy=0;
var alpha=-Math.PI/2, beta=0;
updateCamera();

function buildBox(cordX, cordY, cordZ, longX, longY, longZ){
    var boxMaterial = new THREE.MeshPhongMaterial({color: '#b49c4d'});
    var boxGeometry = new THREE.BoxGeometry(longX, longY, longZ);
    var box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(cordX, cordY, cordZ);
    scene.add(box);
}

function updateCamera(){
    camera.position.set(cx, cy, cz);
    camera.lookAt(new THREE.Vector3(Math.cos(beta)*Math.cos(alpha) + cx, Math.sin(beta) + cy, Math.cos(beta)*Math.sin(alpha) + cz));
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//            _    _  ___  ______
//            |\  /| |   | |    |
//            | \/ | |---| |____|
//            |    | |   | |
//    
buildBox( 50, -8, 50, 50, 260, 80)
buildBox( 50, -8, 140, 50, 300, 80)
buildBox( 50, -8, 230, 50, 230, 80)
buildBox( 50, -8, 320, 50, 200, 80)
buildBox( 50, -8, 410, 50, 250, 80)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
buildBox( -150, -8, 50, 50, 250, 80)
buildBox( -150, -8, 140, 50, 200, 80)
buildBox( -150, -8, 230, 50, 230, 80)
buildBox( -150, -8, 320, 50, 300, 80)
buildBox( -150, -8, 410, 50, 260, 80)
//            _    _  ___  ______
//            |\  /| |   | |    |
//            | \/ | |---| |____|
//            |    | |   | |
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var vel = 0.5;
var onwall;

function update() {
    if (health<=0) {return;}
    if (cx<=-200) {cx=-200;}
    if (cx>=200) {cx=200;}
    if (cz<=-200) {cz=-200;}
    if (cz>=200) {cz=200;}
    if (isKeyPressed[key_up]) {
        t[nw] = Math.floor(Math.random()*2)
        wall[nw] = new THREE.Mesh( geometry[t[nw]], material );
        wall[nw].position.set(cx + Math.cos(alpha)*25, cy + Math.sin(beta)*16 - 1, cz + Math.sin(alpha)*25);
        scene.add(wall[nw]);
        nw++;
        scene.add(wall[nw]);
    }
    if (isKeyPressed[key_down]) {
        bullets.push(new THREE.Mesh(bgeometry, bmaterial));
        bullets[bullets.length-1].position.set(cx /*+ Math.cos(alpha)*25*/, cy + Math.sin(beta)*20, cz /*+ Math.sin(alpha)*25*/)/*(cx, cy, cz)*/;
        scene.add(bullets[bullets.length-1]);
    
        dx.push(Math.cos(alpha)*Math.cos(beta)*bvel);
        dy2.push(Math.sin(beta)*bvel);
        dz.push(Math.sin(alpha)*Math.cos(beta)*bvel);
    }
    var oldy = cy;
    cy += dy;
    dy -= 0.01;
    var oldx = cx;
    var oldz = cz;
    if (cy<=6) {cy=6;}
    if (isKeyPressed[87]){
        cx += Math.cos(alpha)*vel;
        cz += Math.sin(alpha)*vel;
    }
    if (isKeyPressed[83]){
        cx -= Math.cos(alpha)*vel;
        cz -= Math.sin(alpha)*vel;
    }
    if (isKeyPressed[68]){
        cx += Math.cos(alpha+Math.PI/2)*vel;
        cz += Math.sin(alpha+Math.PI/2)*vel;
    }
    if (isKeyPressed[65]){
        cx += Math.cos(alpha-Math.PI/2)*vel;
        cz += Math.sin(alpha-Math.PI/2)*vel;
    }
    onwall = false;
    for (var i=0; i<ne; ++i){
        enemy[i].rotation.y = Math.atan2(cz - enemy[i].position.z, cx - enemy[i].position.x);
        enemy[i].position.x += Math.cos(enemy[i].rotation._y)*vel/2;
        enemy[i].position.z += Math.sin(enemy[i].rotation._y)*vel/2;
        for (var j=0; j<nw; ++j){
            if (t[j] == 0){
                if(areColliding(enemy[i].position.x-1, enemy[i].position.z-1, 2, 2, wall[j].position.x-5, wall[j].position.z-0.5, 10, 1)){
                    enemy[i].position.x -= Math.cos(enemy[i].rotation._y)*vel/2;
                    enemy[i].position.z -= Math.sin(enemy[i].rotation._y)*vel/2;
                    break;
                }
            }else{
                if(areColliding(enemy[i].position.x-1, enemy[i].position.z-1, 2, 2, wall[j].position.x-0.5, wall[j].position.z-5, 1, 10)){
                    enemy[i].position.x -= Math.cos(enemy[i].rotation._y)*vel/2;
                    enemy[i].position.z -= Math.sin(enemy[i].rotation._y)*vel/2;
                    break;
                }
            }
        }
    }
    for (var i=0; i<nw; ++i){
        if (t[i] == 0){
            if(areColliding(cx-1, cz-1, 2, 2, wall[i].position.x-3, wall[i].position.z-3, 5, 5) && cy <= wall[i].position.y+4*h){
                cx = oldx;
                cy = oldy;
                dy = 0;
                cz = oldz;
                onwall = true;
                break;
            }
        }else{
            if(areColliding(cx-1, cz-1, 2, 2, wall[i].position.x-3, wall[i].position.z-3, 5, 5) && cy <= wall[i].position.y+4*h){
                cx = oldx;
                cy = oldy;
                dy = 0;
                cz = oldz;
                onwall = true;
                break;
            }
        }
    }
    for (var i=0; i<bullets.length; ++i){
        bullets[i].position.x += dx[i];
        bullets[i].position.z += dz[i];
        if (bullets[i].position.x > 10000 || bullets[i].position.x < -10000 || bullets[i].position.z > 10000 || bullets[i].position.z < -10000){
            scene.remove(bullets[i]);
            bullets[i] = bullets[bullets.length-1];
            dx[i] = dx[bullets.length-1]
            dz[i] = dz[bullets.length-1]
            bullets.pop();
            dx.pop();
            dz.pop();
            continue;
        }
        var rem=false;
        for (var j=0; j<nw; ++j){
            if (t[j] == 0){
                if(areColliding(bullets[i].position.x-0.25, bullets[i].position.z-0.25, 0.5, 0.5, wall[j].position.x-3, wall[j].position.z-3, 5, 5)){
                    scene.remove(bullets[i]);
                    bullets[i] = bullets[bullets.length-1];
                    dx[i] = dx[bullets.length-1]
                    dz[i] = dz[bullets.length-1]
                    bullets.pop();
                    dx.pop();
                    dz.pop();
                    rem = true;
                    break;
                }
            }else{
                if(areColliding(bullets[i].position.x-0.25, bullets[i].position.z-0.25, 0.5, 0.5, wall[j].position.x-3, wall[j].position.z-3, 5, 5)){
                    scene.remove(bullets[i]);
                    bullets[i] = bullets[bullets.length-1];
                    dx[i] = dx[bullets.length-1]
                    dz[i] = dz[bullets.length-1]
                    bullets.pop();
                    dx.pop();
                    dz.pop();
                    rem = true;
                    break;
                }
            }
        }
        if (rem) continue;
        for (var j=0; j<ne; ++j){
            if(areColliding(bullets[i].position.x-0.5, bullets[i].position.z-0.5, 1, 1, enemy[j].position.x-1, enemy[j].position.z-1, 2, 2)){
                scene.remove(bullets[i]);
                bullets[i] = bullets[bullets.length-1];
                dx[i] = dx[bullets.length-1]
                dz[i] = dz[bullets.length-1]
                bullets.pop();
                dx.pop();
                dz.pop();
                scene.remove(enemy[j]);
                enemy[j].position.z = 200000;
                break;
            }
            if(areColliding(cx, cz, 1, 1, enemy[j].position.x-1, enemy[j].position.z-1, 2, 2)){
                health-=0.1;
            }
        }
    }
    updateCamera();
}

function keyup(key) {
	// Show the pressed keycode in the console
    if (key == 86){
        hand++;
    }
    if (key == 27){
        document.exitPointerLock();
    }
    if ((cy<=6 || onwall) && key == 32){
        dy = 0.5;
    }
	console.log("Pressed", key);
}

function mouseup() {
    if (document.pointerLockElement !== canvas){
        canvas.requestPointerLock();
    }
    if (hand%2 == 0){
        t[nw] = Math.floor(Math.random()*2)
        wall[nw] = new THREE.Mesh( geometry[t[nw]], material );
        wall[nw].position.set(cx + Math.cos(alpha)*25, cy + Math.sin(beta)*16 - 1, cz + Math.sin(alpha)*25);
        scene.add(wall[nw]);
        nw++;
        scene.add(wall[nw]);
    }else{
        bullets.push(new THREE.Mesh(bgeometry, bmaterial));
        bullets[bullets.length-1].position.set(cx /*+ Math.cos(alpha)*25*/, cy + Math.sin(beta)*20, cz /*+ Math.sin(alpha)*25*/)/*(cx, cy, cz)*/;
        scene.add(bullets[bullets.length-1]);
    
        dx.push(Math.cos(alpha)*Math.cos(beta)*bvel);
        dy2.push(Math.sin(beta)*bvel);
        dz.push(Math.sin(alpha)*Math.cos(beta)*bvel);
    }
}

function mousedown() {
    if (hand%2 == 0){
    }else{
        bullets.push(new THREE.Mesh(bgeometry, bmaterial));
        bullets[bullets.length-1].position.set(cx /*+ Math.cos(alpha)*25*/, cy + Math.sin(beta)*20, cz /*+ Math.sin(alpha)*25*/)/*(cx, cy, cz)*/;
        scene.add(bullets[bullets.length-1]);
    
        dx.push(Math.cos(alpha)*Math.cos(beta)*bvel);
        dy2.push(Math.sin(beta)*bvel);
        dz.push(Math.sin(alpha)*Math.cos(beta)*bvel);
    }
}

function mouseMove(mx, my){
    alpha += mx/300;
    beta -= my/300;
    if (beta >= Math.PI/2) beta = Math.PI/2;
    if (beta <= -Math.PI/2) beta = -Math.PI/2;
}