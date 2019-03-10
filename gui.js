"use strict";

//----Gui callbacks----//
//Particles
function updateParticleCount(){
	var diff = params.particleCount - particleCount;
	if (diff > 0){
		addParticles(diff);
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

//Field
function updateFieldParameters(){
	fieldAngleFactorX = params.angleVolatilityX;
	fieldAngleFactorY = params.angleVolatilityY;
	fieldMagnitudeFactorX = params.magnitudeVolatilityX;
	fieldMagnitudeFactorY = params.magnitudeVolatilityY;
	fieldTimeFactor = params.timeFactor / 1000;
}
//General
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
    		  saveImage: saveImage};
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
    entry.onChange(updateFieldParameters);

    gui.add(params, 'reset');
    gui.add(params, 'pause');
    gui.add(params, 'saveImage');

}

