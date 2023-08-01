

// Helpful http://threejs.org/docs/#Reference/Math/Matrix4
var mvMatrixStack = [];
var mvMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);

function loadIdentity() 
{
	mvMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
}

function multMatrix(m) 
{
	mvMatrix.multiply(m);
}

function Translate(v0, v1, v2) 
{
	multMatrix(new THREE.Matrix4().set(1,0,0,v0, 0,1,0,v1, 0,0,1,v2, 0,0,0,1));
}
function scale(v0, v1, v2) 
{
	multMatrix(new THREE.Matrix4().set(v0,0,0,0, 0,v1,0,0, 0,0,v2,0, 0,0,0,1));
}

function rotate(inRadians, v0, v1, v2) 
{
	var rM = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
	var axis = new THREE.Vector3( v0, v1, v2 );

	rM.makeRotationAxis(axis, inRadians);
	multMatrix(rM);
}

function pushMatrix(m) 
{
	if (m) 
	{
		mvMatrixStack.push(m);
		mvMatrix.copy(m);
	} 
	else 
	{
		mm = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
		mm.copy(mvMatrix);
		mvMatrixStack.push(mm);
	}
}

function popMatrix() 
{
	if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
	}

	mvMatrix = mvMatrixStack.pop();
	return mvMatrix;
}