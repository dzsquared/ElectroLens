export function getMoleculeGeometry(view){

	view.molecule = {};
	view.molecule.atoms = [];
	view.molecule.bonds = [];

	var colorSetup = {"C":0x777777, "O":0xFF0000, "N":0x0000FF, "H":0xCCCCCC}
	var atomRadius = {
						"C":0.77,
						"O":0.73,
						"N":0.75,
						"H":0.37
					}
	var options = view.options;
	var scene = view.scene;

	for (var i = 0; i < view.coordinates.length; i++) {
	    //console.log(view.coordinates[i]);
	    //console.log(view.coordinates[i][1][0] , view.coordinates[i][1][1] ,view.coordinates[i][1][2]);
	    //console.log((view.coordinates[i][1][0]*10 + 0.5)*20, (view.coordinates[i][1][1]*10 + 0.5)*20,(view.coordinates[i][1][2]*10 + 0.5)*20);
	    //Do something
	    var geometry = new THREE.SphereGeometry(100, 50, 50);
	    //options.atomSize*atomRadius[view.coordinates[i][0]]*
		//geometry.translate( (view.coordinates[i][1][0]*10 + 0.5)*20, (view.coordinates[i][1][1]*10 + 0.5)*20,(view.coordinates[i][1][2]*10 + 0.5)*20);
			
		var material = new THREE.MeshBasicMaterial( {color: colorSetup[view.coordinates[i][0]]} );
		var atom = new THREE.Mesh(geometry, material);
		atom.scale.set(options.atomSize*atomRadius[view.coordinates[i][0]], options.atomSize*atomRadius[view.coordinates[i][0]], options.atomSize*atomRadius[view.coordinates[i][0]])
		atom.position.set((view.coordinates[i][1][0]*10 + 0.5)*20, (view.coordinates[i][1][1]*10 + 0.5)*20,(view.coordinates[i][1][2]*10 + 0.5)*20)
		view.molecule.atoms.push(atom);
		scene.add(atom);
	}
	
	for (var i = 0; i < view.coordinates.length; i++) {
		var coordinates1 = new THREE.Vector3(view.coordinates[i][1][0], view.coordinates[i][1][1], view.coordinates[i][1][2]);
		var point1 = new THREE.Vector3((view.coordinates[i][1][0]*10 + 0.5)*20, (view.coordinates[i][1][1]*10 + 0.5)*20,(view.coordinates[i][1][2]*10 + 0.5)*20);

	    for (var j = 0; j < view.coordinates.length; j++) {
	    	var coordinates2 = new THREE.Vector3(view.coordinates[j][1][0], view.coordinates[j][1][1], view.coordinates[j][1][2]);
	    	var point2 = new THREE.Vector3((view.coordinates[j][1][0]*10 + 0.5)*20, (view.coordinates[j][1][1]*10 + 0.5)*20,(view.coordinates[j][1][2]*10 + 0.5)*20);

	    	//console.log(point1, point2)

	    	 /* edge from X to Y */
		    
		    var bondlength = new THREE.Vector3().subVectors( coordinates2, coordinates1 ).length();
		    //console.log(direction.length());
		    if (bondlength < options.maxBondLength && bondlength > options.minBondLength) {
		    	var direction = new THREE.Vector3().subVectors( point2, point1 );
		    	var orientation = new THREE.Matrix4();
			    /* THREE.Object3D().up (=Y) default orientation for all objects */
			    orientation.lookAt(point1, point2, new THREE.Object3D().up);
			    /* rotation around axis X by -90 degrees 
			     * matches the default orientation Y 
			     * with the orientation of looking Z */
			    orientation.multiply(new THREE.Matrix4().set(1,0,0,0,
			                                            0,0,1,0, 
			                                            0,-1,0,0,
			                                            0,0,0,1));

			    /* cylinder: radiusAtTop, radiusAtBottom, 
			        height, radiusSegments, heightSegments */
			    //console.log(direction, orientation)
			    var bondGeometry = new THREE.CylinderGeometry( options.bondSize*10, options.bondSize*10, direction.length(), 32, 1, true);
			    //bondGeometry.translate( point1 );

			    var bond = new THREE.Mesh( bondGeometry, 
			            new THREE.MeshBasicMaterial( { color: 0xffffff } ) );

			    bond.applyMatrix(orientation)
			    //console.log(new THREE.Vector3().addVectors( point1, direction.multiplyScalar(0.5) ))
			    //bond.position = new THREE.Vector3().addVectors( point1, direction.multiplyScalar(0.5) );
			    //bond.position.set(new THREE.Vector3().addVectors(point1, direction.multiplyScalar(0.5)));
	            bond.position.x = (point2.x + point1.x) / 2;
			    bond.position.y = (point2.y + point1.y) / 2;
			    bond.position.z = (point2.z + point1.z) / 2;
			    view.molecule.bonds.push(bond);
			    scene.add(bond);
		    }
		    
		}

	}

}


export function updateMoleculeGeometry(view){
	
	for (var i = 0; i < view.molecule.bonds.length; i++) {
		view.scene.remove(view.molecule.bonds[i]);
	}

	for (var i = 0; i < view.molecule.atoms.length; i++) {
		var colorSetup = {"C":0x777777, "O":0xFF0000, "N":0x0000FF, "H":0xCCCCCC}
		var atomRadius = {
							"C":0.77,
							"O":0.73,
							"N":0.75,
							"H":0.37
						}
	}

	getMoleculeGeometry(view);

}


export function changeMoleculeGeometry(view){
	
	for (var i = 0; i < view.molecule.bonds.length; i++) {
		view.scene.remove(view.molecule.bonds[i]);
	}

	for (var i = 0; i < view.molecule.atoms.length; i++) {
		view.scene.remove(view.molecule.atoms[i]);
	}

	getMoleculeGeometry(view);

}

export function removeMoleculeGeometry(view){
	
	for (var i = 0; i < view.molecule.bonds.length; i++) {
		view.scene.remove(view.molecule.bonds[i]);
	}

	for (var i = 0; i < view.molecule.atoms.length; i++) {
		view.scene.remove(view.molecule.atoms[i]);
	}

}