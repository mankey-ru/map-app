document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


	return



	var debugDiv = document.createElement('div');
	debugDiv.style.position = 'absolute';
	debugDiv.style.top = '100px';
	debugDiv.style.left = '100px';
	debugDiv.style.backgroundColor = '#fff';
	debugDiv.style.border = '1px solid red';
	debugDiv.style.padding = '10px';
	debugDiv.style.zIndex = '9999';
	debugDiv.innerHTML = 'WAIT';

	document.body.appendChild(debugDiv)

	var debugDiv2 = document.createElement('div');
	debugDiv2.style.position = 'absolute';
	debugDiv2.style.top = '500px';
	debugDiv2.style.left = '500px';
	debugDiv2.style.backgroundColor = '#fff';
	debugDiv2.style.border = '1px solid blue';
	debugDiv2.style.padding = '10px';
	debugDiv2.style.zIndex = '99999';
	debugDiv2.innerHTML = 'WAIT';

	document.body.appendChild(debugDiv2)
}