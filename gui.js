"use strict";

//----Gui callbacks----//
function updateParticleCount(){
	var diff = params.particleCount - particleCount;
	if (diff > 0){
		addParticles(diff);
	}
	else if (diff < 0){
		removeParticles(Math.abs(diff));
	}
}


//----Gui metric updates----//
function updateGuiMetrics(){
    params.fps = 1/dt;
}

function initializeGUI(){
    params = {fps: 1/dtMax, 
    		  particleCount: particleCount,
    		  reset: reset};
	gui = new dat.GUI();
	var guiFolderMetrics = gui.addFolder('Metrics');
    guiFolderMetrics.add(params, 'fps', 0, 100).listen();
    
    var guiFolderParticles = gui.addFolder('Particles');
    var entry = guiFolderParticles.add(params, 'particleCount', 0, 3000).step(1);
    entry.onFinishChange(updateParticleCount);

    gui.add(params, 'reset');

}

