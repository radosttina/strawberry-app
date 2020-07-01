class PlantSkeleton {
	constructor(params) {
		this.params = params || {};
		this.alphaMap = new THREE.TextureLoader().load('./texture/alpha.png');

		this.mesh = this.createRoot();
	}

	createRoot() {
		var root = new THREE.Tree({
		    generations : 4,        // # for branch' hierarchy
		    length      : 0.5,      // length of root branch
		    uvLength    : 4,     // uv.v ratio against geometry length (recommended is generations * length)
		    radius      : 0.04,      // radius of root branch
		    radiusSegments : 8,     // # of radius segments for each branch geometry
		    heightSegments : 8      // # of height segments for each branch geometry
		});

		var rootGeometry = THREE.TreeGeometry.build(root);
		var rootMaterial = new THREE.MeshStandardMaterial({ 
		  color: "#CCAC77",
		  transparent: true,
		  side: THREE.DoubleSide,
		  alphaTest: 0.6
		});

		rootMaterial.alphaMap = this.alphaMap;
		rootMaterial.alphaMap.offset.y = 0;

		var rootMesh = new THREE.Mesh(
		    rootGeometry, 
		    rootMaterial
		);

		rootMesh.name = "ROOT";

		rootMesh.rotation.x = Math.PI;
		this.params.parent.add(rootMesh);

		return rootMesh;
	}

	getRoot() {
		return this.root();
	}

	getRandomArbitrary(min, max, toFixed) {
	  return (Math.random() * (max - min) + min).toFixed(toFixed)/1;
	}

	updateAlphaMask() {
	  var offsetAlphaMaskRoot = this.alphaMap.offset;

	  if (offsetAlphaMaskRoot.y > -3) {
	      offsetAlphaMaskRoot.y -= 0.01;
	  }
	}
}

THREE.PlantSkeleton = PlantSkeleton;
