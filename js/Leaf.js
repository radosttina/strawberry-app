class LeafGroup {
	constructor(params) {
		this.params = params || {};
		this.params.leafCount = this.getRandomArbitrary(3, 3, 0);
		this.leafs = []

		this.init();
	}

	async init() {
		this.leafgroup = new THREE.Object3D();
		this.model = await this.loadModel();

		for (let i = 0; i < this.params.leafCount; i++) {
			let leaf = this.model.clone();
			this.leafs.push(leaf);
			this.setLeafRotation(leaf, i);
			this.setFinalSize(leaf);
			this.leafgroup.add(leaf);
		}

		window.leafs = this.leafs;
		window.leafgroup = this.leafgroup;
		this.setPosition();
		this.leafgroup.rotation.set(
			0,
			this.getRandomArbitrary(2, -2, 2),
			this.getRandomArbitrary(1, 0, 2)
		);
		this.params.parent.mesh.add(this.leafgroup);

	}

	loadModel() {
		var that = this;
		return new Promise(resolve => {
	  		let loader = new THREE.FBXLoader();
	  		let textureLoader = new THREE.TextureLoader();
			let leafMaterial =  new THREE.MeshLambertMaterial(
				{
					map : textureLoader.load('./texture/leaf2.jpg'),
					alphaMap: textureLoader.load('./texture/leaf2_alpha.jpg'),
					color:0xF3FFE2,
					transparent: true,
					side: THREE.DoubleSide,
					alphaTest: 0.99
				});

			loader.load( './models/leaf.FBX', function ( object ) {
		   
				object.traverse( function ( child ) {
				   if ( child.isMesh ) {
				     child.castShadow = true;
				     child.material = leafMaterial;
				     child.receiveShadow = true;
				  }
				});

				object.scale.set(0.01, 0.01, 0.01);
				resolve(object);
			});
		});
	}

	setFinalSize(leaf) {
		leaf.finalSize = [this.getRandomArbitrary(0.2, 0.3, 1), this.getRandomArbitrary(0.1, 0.2, 1), 0.2];
	}

	setPosition() {
		this.parentVertex = this.params.parent.leafVertices[this.params.number];

		this.leafgroup.position.set(
			this.parentVertex.x,
			this.parentVertex.y,
			this.parentVertex.z
		)
	}

	setLeafRotation(leaf, i) {
		leaf.rotation.set(
			0,
			1.5*i,
			0
		);

		leaf.max_x = leaf.rotation.x + this.getRandomArbitrary(0, 0.1, 2);
		leaf.max_z = leaf.rotation.z + this.getRandomArbitrary(0, 0.1, 2);
		if (leaf.rotation.y < 0) {
			leaf.max_y = leaf.rotation.y - this.getRandomArbitrary(0, 0.1, 2);
		} else {
			leaf.max_y = leaf.rotation.y + this.getRandomArbitrary(0, 0.1, 2);
		}
	}

	animate() {

		setInterval(function(){
			this.leafs.forEach(leaf => {

				const dims = ['x', 'y', 'z'];

				dims.forEach(function(dim, index){
					if (leaf.finalSize[index] > leaf.scale[dim]) {
						leaf.scale[dim] += 0.002;
					}
				});

				if (leaf.rotation.x < leaf.max_x) {
					leaf.rotation.x +=0.005;
				}

				if (leaf.max_y < 0 && leaf.rotation.y > leaf.max_y) {
					leaf.rotation.y -= 0.005;
				} else if (leaf.max_y > 0 && leaf.rotation.y < leaf.max_y){
					leaf.rotation.y += 0.01;
				} 

				if (leaf.rotation.z < leaf.max_z) {
					leaf.rotation.z +=0.01;
				}
			})
		}.bind(this), this.getRandomArbitrary(40, 80, 0));
	}

	getRandomArbitrary(min, max, toFixed) {
	  return (Math.random() * (max - min) + min).toFixed(toFixed)/1;
	}
}

THREE.LeafGroup = LeafGroup;
