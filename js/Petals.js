class PetalGroup {
	constructor (params) {
		this.params = params || {};
		this.params.petalsCount = 5;
		this.petals = [];
		this.strawberry = null;
		this.rotationSpectrum = Math.PI*4;
		this.stopGrowth = this.params.number;

		if (this.stopGrowth > 1) {
			this.stopGrowth = this.getRandomArbitrary(0, 9, 0)%2;
		};

		this.groupVertices = [];
		this.init();
	}

	async init () {
		this.group = new THREE.Object3D();
		this.setPosition();

		this.model = await this.loadModel();
		this.strawberry = await this.loadStawberryModel();

		for (let i = 0; i < this.params.petalsCount; i++) {
			let petal = this.model.clone();
			this.petals.push(petal);
			this.setPetalRotation(petal);
			this.setFinalSize(petal, "petal");
			petal.highlight = this.highlight.bind(this);
		    petal.unhighlight = this.unhighlight.bind(this);
			this.group.add(petal);
		}

		this.setFinalSize(this.strawberry, "strawberry-init");

		if (this.isPositionValid()) { 
				this.params.parent.mesh.add(this.group);
		}

		if (this.noFreeSpot) {
			return null;
		} else {
			this.animate();
		}
	}

	loadModel () {
		var that = this;
		return new Promise(resolve => {
	  		let loader = new THREE.FBXLoader();
	  		let initialTexture = that.stopGrowth ? "./texture/petal.jpg" : "./texture/dark-green.jpg";
	  		let model = that.stopGrowth ? "./models/petal.FBX" : "./models/cup.FBX";

			let uniforms = {
				textureOne: {type: "t", value: THREE.ImageUtils.loadTexture("./texture/dark-green.jpg")},
				textureTwo: {type: "t", value: THREE.ImageUtils.loadTexture(initialTexture)},
				ratio: {type: "int", value: 0}
			};
			let petalMaterial = new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: document.getElementById('vertexShader').textContent,
				fragmentShader: document.getElementById('fragmentShader').textContent
			});

			loader.load( model, function ( object ) {
			   
				object.traverse( function ( child ) {
					if ( child.isMesh ) {
				     child.castShadow = true;
				     child.material = petalMaterial;
				     child.receiveShadow = true;
				     child.name = that.stopGrowth ? "FLOWER" : "FRUIT";
				  }
				});

				object.scale.set(0, 0, 0);
				resolve(object);
			});
		});
	}

	loadStawberryModel () {
		var that = this;
		return new Promise(resolve => {
			let initialTexture = that.stopGrowth ? "./texture/yellow.png" : "./texture/green.jpg";
	  		let loader = new THREE.FBXLoader();
			let uniforms = {
				textureOne: {type: "t", value: THREE.ImageUtils.loadTexture("./texture/green.jpg")},
				textureTwo: {type: "t", value: THREE.ImageUtils.loadTexture(initialTexture)},
				ratio: {type: "int", value: 0}
			};
			let strawberryMaterial = new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: document.getElementById('vertexShader').textContent,
				fragmentShader: document.getElementById('fragmentShader').textContent
			});

			loader.load( './models/strawberry.FBX', function ( object ) {
		   
				object.traverse( function ( child ) {
				   if ( child.isMesh ) {
				     child.castShadow = true;
				     child.material = strawberryMaterial;
				     child.receiveShadow = true;
				     child.name = that.stopGrowth ? "FLOWER" : "FRUIT";
				  }
				});

				object.scale.set(0, 0, 0);
				object.highlight = that.highlight.bind(that);
				object.unhighlight = that.unhighlight.bind(that);
				resolve(object);
			});
		});
	}

	setFinalSize (object, type) {
		if (type === "petal") {
			if (this.stopGrowth) {
				object.finalSize = [0.1, 0.1, 0.1];
			} else {
				object.finalSize = [0.04, 0.03, 0.04];	
			}
		}

		if (type === "strawberry-init") {
		let scale = this.getRandomArbitrary(0.08, 0.10, 2);
			object.finalSize = [scale, scale, scale];
		}

		if (type === "strawberry-ripe") {
			let scale = this.getRandomArbitrary(0.05, 0.3, 2);
			object.finalSize = [scale, scale, scale];
		}
	}

	setPosition () {
		var positionVertex = this.getFreeVertex();

		if (!positionVertex) {
			return;
		}

		this.group.position.set(
			positionVertex.x,
			positionVertex.y,
			positionVertex.z
		)
	}

	getFreeVertex () {
		var continueSearch = true;
		var suggestedIndex = 0;
		var busySpotIndex = 0;
		var busySpot = null;
		var suggestedVertex = null;

		while (continueSearch) {
			busySpot = this.params.busySpots[busySpotIndex];
			suggestedVertex = this.params.parent.strawberryVertices[suggestedIndex];

			if (!busySpot) {
				continueSearch = false;
				continue;
			}

			if (!suggestedVertex) {
				suggestedVertex = null;
				continueSearch = false;
				continue;
			}

			if (this.isCollision(suggestedVertex, busySpot)) {
				// restart search with a new suggested position
				busySpotIndex = 0;
				suggestedIndex++;
			} else {
				// check for collision against the other busy sports
				busySpotIndex++;
			}
		}

		return suggestedVertex;

	}

	isCollision (suggestedPosition, busySpot) {
		if (suggestedPosition.distanceTo(busySpot) < 1) {
			return true;
		}

	}

	getPosition () {
		return this.group.position;
	}

	isPositionValid () {
		var position = this.getPosition();

		return position.x || position.y || position.z;

	}

	setPetalRotation (petal) {
		this.rotationSpectrum -= this.rotationSpectrum/7;
		petal.rotation.set(0, this.rotationSpectrum, 0);
	}

	animate () {
		Promise.all([this.growPetals(), this.growInitialStawberry()])
		.then(function(){
			if (!this.stopGrowth) {
				this.ripeStrawberry.call(this);
			}
		}.bind(this));
	}

	growInitialStawberry () {
		this.group.add(this.strawberry);
		var that = this;
		return new Promise(function(resolve, reject){
			let interval = setInterval(function(){
					const dims = ['x', 'y', 'z'];				
					dims.forEach(function(dim, index){
						if (that.strawberry.finalSize[index] > that.strawberry.scale[dim]) {
							that.strawberry.scale[dim] += 0.001;
							if (!that.stopGrowth) {
								that.strawberry.children[0].material.uniforms.ratio.value += 0.03;
							} 
						} else {
							clearInterval(interval);
							resolve();
						}
					});
				}.bind(that), that.getRandomArbitrary(40, 80, 0));
		});
	}

	ripeStrawberry () {
		this.setFinalSize(this.strawberry, "strawberry-ripe");
		this.strawberry.children[0].material.uniforms.ratio.value = 0;
		this.strawberry.children[0].material.uniforms.textureTwo.value = THREE.ImageUtils.loadTexture("./texture/green.jpg");
		this.strawberry.children[0].material.uniforms.textureOne.value = THREE.ImageUtils.loadTexture("./texture/strawberry.jpg");

		let that = this;

		var rotationIsPositive = (this.group.position.z < 0) ? false : true;
		var rotationZ = rotationIsPositive ? 0.02 : -0.02;
		return new Promise(function(resolve, reject){
			let interval = setInterval(function(){
					const dims = ['x', 'y', 'z'];

					 this.group.rotateZ(rotationZ);
					 this.group.position.y -= 0.0001;

					 that.petals.forEach(function(petal){
					 	petal.position.y -= 0.0002;
					 })

					dims.forEach(function(dim, index){
						if (Math.abs(that.group.rotation.z) < 3) {
							that.strawberry.scale[dim] += 0.0007;
							that.strawberry.children[0].material.uniforms.ratio.value += 0.03;
						} else {
							clearInterval(interval);
							resolve();
						}
					});
				}.bind(that), that.getRandomArbitrary(20, 40, 0));
		});
	}

	growPetals () {
		var that = this;
		return new Promise(function(resolve, reject){
			let interval = setInterval(function(){
				that.petals.forEach(petal => {
					const dims = ['x', 'y', 'z'];

					dims.forEach(function(dim, index){
						if (petal.finalSize[index] > petal.scale[dim]) {
							petal.scale[dim] += 0.001;
						} else {
							clearInterval(interval);
							resolve();
						}
					});
				})
			}.bind(that), that.getRandomArbitrary(20, 50, 0));
		});
	}

	dissolvePetals () {
		var that = this;
		return new Promise(function(resolve, reject){
			var interval = setInterval(function(){
				that.petals.forEach(petal => {
					const dims = ['x', 'y'];

					dims.forEach(function(dim, index){
						if (0 < petal.scale[dim]) {
							petal.scale[dim] = petal.scale[dim] - 0.002;
						}
					});

					petal.children[0].material.uniforms.ratio.value += 0.1;

					let scaleSum = petal.scale.x + petal.scale.y;

					if (scaleSum < 0.1) {
						clearInterval(interval);
						resolve();
					}
				})
			}.bind(that), that.getRandomArbitrary(40, 80, 0));
		});
	}

	highlight() {
		let highlightTexture = THREE.ImageUtils.loadTexture("./texture/red_highlight.png");
		this.setUniformParams(this.strawberry, highlightTexture, 10);
		this.petals.forEach(function(petal){
			this.setUniformParams(petal, highlightTexture, 7);
		}.bind(this))
	}

	unhighlight() {
		let strawberryTexture, petalTexture;

		if (this.stopGrowth) {
			strawberryTexture = THREE.ImageUtils.loadTexture("./texture/yellow.png");
			petalTexture = THREE.ImageUtils.loadTexture("./texture/petal.jpg");
		} else {
			strawberryTexture = THREE.ImageUtils.loadTexture("./texture/strawberry.jpg");
			petalTexture = THREE.ImageUtils.loadTexture("./texture/green.jpg");
		}

		this.setUniformParams(this.strawberry, strawberryTexture, 10);
		this.petals.forEach(function(petal){
			this.setUniformParams(petal, petalTexture, 10);
		}.bind(this));
	}

	setUniformParams(object, texture, ratio) {
		object.children[0].material.uniforms.textureOne.value = texture;
		object.children[0].material.uniforms.ratio.value = ratio;
	}

	getRandomArbitrary(min, max, toFixed) {
	  return (Math.random() * (max - min) + min).toFixed(toFixed)/1;
	}
}

THREE.PetalGroup = PetalGroup;
