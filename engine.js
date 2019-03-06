"use strict";

class Grid {
    constructor(rows, columns, width, height){
        this.rows = rows;
        this.columns = columns;
        this.width = width;
        this.height = height;
        this.gridSpacing = {x:null, y:null};
        this.elem = [];
        this.initializeNodes();
    }

    initializeNodes(){

        this.gridSpacing.x = this.width / this.columns;
        this.gridSpacing.y = this.height / this.rows;

        for (var i = 0; i < this.columns; i++){
            var xLoc = this.gridSpacing.x/2 + this.gridSpacing.x * i;
            var rowArray = [];
            for (var j = 0; j < this.rows; j++){
                var yLoc = this.gridSpacing.y/2 + this.gridSpacing.y * j;
                var node = new GridNode(xLoc, yLoc, i, j);
                rowArray.push(node);
            }
            this.elem.push(rowArray);
        }
    }

    getNodeFromLocation(x, y){
        var i,j;
        i = Math.floor(x / this.gridSpacing.x);
        j = Math.floor(y / this.gridSpacing.y);

        if (i >= 0 && i < this.columns && j >= 0 && j < this.rows){
            return this.elem[i][j];
        }
        return null;
    }

    getAllNodesInRadius(x, y, radius){
        var nodes, radiusSq, rootNode, xExtent, yExtent;
        nodes = [];
        radiusSq = radius * radius;
        rootNode = this.getNodeFromLocation(x, y);
        nodes.push(rootNode);

        xExtent = Math.ceil(radius / this.gridSpacing.x);
        yExtent = Math.ceil(radius / this.gridSpacing.y);
        for (var i = -xExtent; i <= xExtent; i++){
            for (var j = -yExtent; j <= yExtent; j++){
                var checkX = rootNode.indX + i;
                var checkY = rootNode.indY + j;

                if (checkX >= 0 && checkX < this.columns && checkY >= 0 && checkY < this.rows){
                    var elem = this.elem[checkX][checkY];
                    if (getDistanceSq(x, y, elem.x, elem.y) <= radiusSq){
                        nodes.push(elem);
                    }
                }
            }
        }
        return nodes;
    }

    getClosestValidNodeFromLocation(x, y){
        var i,j;
        i = Math.floor(x / this.gridSpacing.x);
        j = Math.floor(y / this.gridSpacing.y);

        if (i < 0){
            i = 0;
        }
        else if (i >= this.columns){
            i = this.columns - 1;
        }
        if (j < 0){
            j = 0;
        }
        else if (j >= this.rows){
            j = this.rows - 1;
        }
        return this.elem[i][j];
    }
    update(){
        for (var i = 0; i < this.columns; i++){
            for (var j = 0; j < this.rows; j++){
                this.elem[i][j].update();
            }
        }
    }
    draw(){
        for (var i = 0; i < this.columns; i++){
            for (var j = 0; j < this.rows; j++){
                this.elem[i][j].draw();
            }
        }
    }
}

class GridNode{
    constructor(x, y, indX, indY){
        this.x = x;
        this.y = y;
        this.indX = indX;
        this.indY = indY;
        this.update();
    }
    update(){
        this.angle = noise.simplex3(this.indX / 40, this.indY / 40, timeFactor) * Math.PI * 2;
        this.length = noise.simplex3(this.indX / 60, this.indY / 60 + 40000, timeFactor); //0-1
    }
    draw(){
        canvasContext.save();
        canvasContext.strokeStyle = "black";
        canvasContext.translate(this.x, this.y);
        canvasContext.rotate(this.angle);
        canvasContext.beginPath();
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(0, gridSpacing * this.length);
        canvasContext.stroke();
        canvasContext.restore();
    }
}

class Particle {
    constructor(x, y, size){
        this.size = size;
        this.position = {x: x, y: y};
        this.velocity = {x: Math.random()*2 - 1, y: Math.random()*2 - 1};
        this.acceleration = {x: 0, y: 0};
    }

    update(dt){
        var node, accel, vel, speed, dir;
        node = grid.getNodeFromLocation(this.position.x, this.position.y);
        //Update acceleration. Zero out if off screen.
        if (node != null){
            accel = rotateVector(0, accelContributionFromField * node.length, node.angle, false);
            this.acceleration = addVector(this.acceleration, accel);
        }
        else{
            this.acceleration = magnifyVector(this.acceleration, 0);
        }
        //Update velocity
        this.velocity = addVector(this.velocity, this.acceleration);
        vel = getMagnitudeAndDirection(this.velocity);
        speed = vel.magnitude;
        dir = vel.direction;
        if (speed > velocityCapSq){
            speed = velocityCap;
            this.velocity = magnifyVector(dir, speed);
        }
        this.position = addVector(this.position, this.velocity);
        this.maybeWrap();
    }

    maybeWrap(){
        if(this.position.x > canvas.width) {
            this.position.x = 0;
        } else if(this.position.x < -this.size) {
            this.position.x = canvas.width - 1;
        }
        if(this.position.y > canvas.height) {
            this.position.y = 0;
        } else if(this.position.y < -this.size) {
            this.position.y = canvas.height - 1;
        }
    }

    draw(){
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}

function checkAABB(objA, objB){
    if ((objA.x - objA.size / 2) > (objB.x + objB.size / 2)){
        return false;
    }
    if ((objA.y - objA.size / 2) > (objB.y + objB.size / 2)){
        return false;
    }
    return true;
}

function rotateVector(xi, yi, theta, degrees){
    //Rotate a vector by theta (-theta == CW, +theta == CCW)
    //returns a vector (vector.x, vector.y)
    if (degrees){
        theta *= Math.PI/180;
    }
    return {x: xi * Math.cos(theta) - yi * Math.sin(theta), 
            y: xi * Math.sin(theta) + yi * Math.cos(theta)};
}

function getMagnitudeAndDirection(vector){
    var magnitude = getVectorMag(vector);
    return {direction: {x: vector.x / magnitude, y: vector.y / magnitude}, magnitude: magnitude};
}
function normalizeVector(vector){
    var magnitude = getVectorMag(vector);
    return {x: vector.x / magnitude, y: vector.y / magnitude};
}

function addVector(vector1, vector2){
    return {x: vector1.x + vector2.x, y: vector1.y + vector2.y};
}

function magnifyVector(vector, scalar){
    return {x: vector.x * scalar, y: vector.y * scalar};
}
function getVectorMag(vector){
    return Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
}

function getDistance(vector1, vector2){
    return Math.sqrt(getDistanceSq(vector1, vector2));
}

function getDistanceSq(vector1, vector2){
    return Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2);
}

function dotProduct(vector1, vector2){
    return vector1.x * vector2.x + vector1.y * vector2.y;
}


