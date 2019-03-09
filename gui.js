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
    		  reset: reset,
    		  pause: pause};
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

    gui.add(params, 'reset');
    gui.add(params, 'pause');

}

