class Stem {
	constructor(params) {
		this.strawberryVertices = [];
		this.leafVertices = [];
		this.alphaMap = new THREE.TextureLoader().load('./texture/alpha.png');
		this.mesh = new THREE.Object3D();
		for (let i = 0; i < 7; i++) {
			this.mesh.add( this.createBranch(params.strawberryCount > i) );
		}
		
		params.scene.add(this.mesh);
	}

	createBranch (useForStrawberry) {
		var startPoint = new THREE.Vector3(0, 0 ,0);

		if (useForStrawberry) {
			var controlPoint = new THREE.Vector3(
				this.getRandomArbitrary(-0.1, 0.1, 1),
				this.getRandomArbitrary(1, 2, 1),
				this.getRandomArbitrary(-0.1, 0.1, 1)
				);
			var endPointPoint = controlPoint.clone().add(
				new THREE.Vector3(
					this.getRandomArbitrary(-1, 0.6, 1),
					this.getRandomArbitrary(0.3, 0.5, 1),
					this.getRandomArbitrary(-2, 2, 1))
				);

			var path = new THREE.CatmullRomCurve3([startPoint, controlPoint, endPointPoint]);
		} else {
			var controlPoint = new THREE.Vector3(this.getRandomArbitrary(-0.1, 0.1, 1), this.getRandomArbitrary(2, 3, 1), this.getRandomArbitrary(-0.1, 0.1, 1));
			var endPointPoint = controlPoint.clone().add(new THREE.Vector3(this.getRandomArbitrary(-1, 0.6, 1), this.getRandomArbitrary(0.5, 1, 1), this.getRandomArbitrary(-2, 2, 1)));
			var path = new THREE.CatmullRomCurve3([startPoint, controlPoint, endPointPoint]);
		}

		var stemMaterial = new THREE.MeshStandardMaterial({ 
		  color: "#32CD32",
		  transparent: true,
		  side: THREE.DoubleSide,
		  alphaTest: 0.3
		});	

		stemMaterial.alphaMap = this.alphaMap;
		stemMaterial.alphaMap.rotation = -1;
		stemMaterial.alphaMap.offset.y = 0;

		var geometry = new THREE.TubeGeometry( path, 20, 0.03, 8, false );
		var mesh = new THREE.Mesh( geometry, stemMaterial );
		mesh.name = "STEM";

		if (useForStrawberry) {
			this.strawberryVertices = this.strawberryVertices.concat(geometry.vertices.slice(-1));
		} else {
			this.leafVertices = this.leafVertices.concat(geometry.vertices.slice(-1));
		}

		return mesh;
	}

	updateAlphaMask() {
	  var offsetAlphaMaskRoot = this.alphaMap.offset;

	  if (offsetAlphaMaskRoot.y > -2) {
	      offsetAlphaMaskRoot.y -= 0.01;
	  }
	}

	getRandomArbitrary(min, max, toFixed) {
	  return (Math.random() * (max - min) + min).toFixed(toFixed)/1;
	}
}

THREE.Stem = Stem;
