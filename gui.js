"use strict";

//----Gui callbacks----//
//Particles
function updateParticleCount(){
	var diff = params.particleCount - particleCount;
	if (diff > 0){
		addNewParticles(diff);
	}
	else if (diff < 0){
		removeParticles(Math.abs(diff));
	}
}
function updateParticleVelocityCap(){
    velocityCap = params.maxVelocity;
    velocityCapSq = velocityCap * velocityCap;
}

function updateFieldFactor(){
	accelContributionFromField = params.fieldFactor;
}

function updateParticleSpawnParams(){
	currentParticleSpawnLocation = params.spawnLocation;
}

//Field
function updateFieldParameters(){
	fieldAngleFactorX = params.angleVolatilityX;
	fieldAngleFactorY = params.angleVolatilityY;
	fieldMagnitudeFactorX = params.magnitudeVolatilityX;
	fieldMagnitudeFactorY = params.magnitudeVolatilityY;
	fieldTimeFactor = params.timeFactor / 1000;
}
//Color
function updateBackgroundColor(){
    currentBackgroundRGB = params.backgroundColor;
    drawBackground(1);
}

function updateTrailPersistence(){
    currentTrailPersistence = params.trailPersistence;
}
//General
function updateCanvasResolution(){
	canvas.width = canvasDimensions[params.canvasDimensions][0];
	canvas.height = canvasDimensions[params.canvasDimensions][1];
	currentCanvasDimensions = params.canvasDimensions;
}
function pause(){
	if (playbackPaused){
		playbackPaused = false;
		requestAnimationFrame(main);
	}
	else{
		playbackPaused = true;
	}
}
//----Gui metric updates----//
function updateGuiMetrics(){
    params.fps = 1/dt;
}

function initializeGUI(){
    params = {fps: 1/dtMax, 
    		  particleCount: particleCount,
    		  maxVelocity: velocityCap,
    		  fieldFactor: accelContributionFromField,
    		  angleVolatilityX: fieldAngleFactorX,
    		  angleVolatilityY: fieldAngleFactorY,
    		  magnitudeVolatilityX: fieldMagnitudeFactorX,
    		  magnitudeVolatilityY: fieldMagnitudeFactorY,
    		  timeFactor: fieldTimeFactor * 1000, 
    		  reset: reset,
    		  pause: pause,
    		  spawnLocation: particleSpawnTypes[0],
              backgroundColor: currentBackgroundRGB,
              trailPersistence: currentTrailPersistence,
              canvasDimensions: canvasDimKeys[0]};

	gui = new dat.GUI();
	var guiFolderMetrics = gui.addFolder('Metrics');
    guiFolderMetrics.add(params, 'fps', 0, 100).listen();
    
    var guiFolderParticles = gui.addFolder('Particles');
    var entry = guiFolderParticles.add(params, 'particleCount', 0, 3000).step(1);
    entry.onFinishChange(updateParticleCount);
    
    entry = guiFolderParticles.add(params, 'maxVelocity', 0, 3);
    entry.onChange(updateParticleVelocityCap);
    
    entry = guiFolderParticles.add(params, 'fieldFactor', 0, 3);
    entry.onChange(updateFieldFactor);

    entry = guiFolderParticles.add(params, 'spawnLocation', particleSpawnTypes);
    entry.onChange(updateParticleSpawnParams);

    var guiFolderField = gui.addFolder('Field');
    entry = guiFolderField.add(params, 'angleVolatilityX', 1, 200).step(1);
    entry.onChange(updateFieldParameters);

    entry = guiFolderField.add(params, 'angleVolatilityY', 1, 200).step(1);
    entry.onChange(updateFieldParameters);

    entry = guiFolderField.add(params, 'magnitudeVolatilityX', 1, 200).step(1);
    entry.onChange(updateFieldParameters);

    entry = guiFolderField.add(params, 'magnitudeVolatilityY', 1, 200).step(1);
    entry.onChange(updateFieldParameters);

    entry = guiFolderField.add(params, 'timeFactor', 0, 10).step(1);
    entry.onFinishChange(updateFieldParameters);

    var guiFolderColor = gui.addFolder('Color');
    entry = guiFolderColor.addColor(params, 'backgroundColor');
    entry.onFinishChange(updateBackgroundColor);
    
    entry = guiFolderColor.add(params, 'trailPersistence', 0, 1);
    entry.onChange(updateTrailPersistence);

//----canvas properties
//adjust box size and canvas size. *enum?

//----draw types
//draw grid
//normal

//----color props
//trail transparency
//dynamic hue bool
//dynamic hue rate
//background color
//trail "length" dictated by background fill alpha
//if no dynamic hue, set color
	entry = gui.add(params, 'canvasDimensions', canvasDimKeys);
	entry.onFinishChange(updateCanvasResolution);

    gui.add(params, 'reset');
    gui.add(params, 'pause');
}

