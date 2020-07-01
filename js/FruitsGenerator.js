class FruitsGenerator {
	constructor (params) {
		this.params = params || {};
		this.fruitPositions = [];
		this.init();
	}

	async init () {
		for (let i = 0; i < this.params.count; i++) {
		    var fruit = new THREE.PetalGroup({
		      scene: this.params.scene,
		      parent: this.params.parent,
		      busySpots: this.fruitPositions,
		      number: i
		    });

		    this.fruitPositions.push(fruit.getPosition());
		  }
	}
}

THREE.FruitsGenerator = FruitsGenerator;
