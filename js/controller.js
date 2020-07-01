var canvas = document.getElementById("myCanvas");
var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.5, 5000);
camera.position.z = 40;

var raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();


// scene
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

// lights
var ambientLight = new THREE.AmbientLight(0xffffff, 0.9),
  pointLight = new THREE.PointLight(0xffffff, 0.5);

pointLight.position.y = 1;
scene.add(ambientLight);
scene.add(pointLight);

var selectedObject = null;
var sceneOffset = 0;

let leafs = [];
const fruitsCount = 3;
const leafCount = 4;

this.infoBoard = new InfoBoard ({id: "info-board"});
this.content = {};

function closeInfoBoard( event ) {
  this.infoBoard.closeInfoBoard();
  canvas.style.marginLeft = "0px";
  sceneOffset = 0;
}

function updateInfoBoardState(selectedItem) {
  this.infoBoard.setSelectedItem(selectedItem);
  this.infoBoard.showInfoBoard();
  
  canvas.style.marginLeft = "-400px";
  sceneOffset = 400;
}

function clearPreviousSelection(object) {
  if (object) {
    var c = object.previousColor;

    // handle default material
    object.material.color && object.material.color.set(new THREE.Color(c.r, c.g, c.b));

    // handle custom material
    object.parent.unhighlight && object.parent.unhighlight();
  }
}

function highlightSelectedObject(object) {
   // handle default material
  object.previousColor = Object.assign({}, object.material.color);
  object.material.color && object.material.color.set( 0xff0000);

  // handle custom material
  object.parent.highlight && object.parent.highlight();
}

function getIntersectedObject(objects) {
  mouse.x = ( (event.clientX + sceneOffset) / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );

  return raycaster.intersectObjects(objects)[0] && raycaster.intersectObjects(objects)[0].object;
};

function onMouseClick( event ) {
  let newSelectedObject, objectsInScene = [];

  if (event.srcElement.classList.contains ("btn-close")) {
    return;
  }

  clearPreviousSelection(selectedObject);

  scene.traverse(function(object){
     objectsInScene.push(object);
  });
  newSelectedObject = getIntersectedObject(objectsInScene);

  if (!newSelectedObject) {
    return;
  }

  // save the newly selected object in a global variable
  selectedObject = newSelectedObject; 
  highlightSelectedObject(newSelectedObject);

  updateInfoBoardState(newSelectedObject.name);   
}

window.addEventListener( 'click', onMouseClick, false );


this.plant = new THREE.Mesh();
scene.add(this.plant);


this.roots = new THREE.PlantSkeleton({
  parent: this.plant
});

this.stem = new THREE.Stem({
      scene: this.scene,
      strawberryCount: 3
});


window.stem = this.stem;

var controls = new THREE.OrbitControls( camera );
controls.update();

requestAnimationFrame(render);

function render() {

  this.roots.updateAlphaMask();
  this.stem.updateAlphaMask();

  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();

  this.stem.mesh.rotateY(0.005);
  this.roots.mesh.rotateY(-0.005);

}

setTimeout(initLeafs, 1000);
setTimeout(initPetals, 1000);

function initPetals () {
  new THREE.FruitsGenerator({
     scene: this.scene,
     parent: this.stem,
     count: fruitsCount
  })
}

function initLeafs () {
  let leaf;

  for (let i = 0; i < leafCount; i++) {
    leaf = new THREE.LeafGroup({
      scene: this.scene,
      parent: this.stem,
      number: i
    });

    leaf.animate();
    leafs.push(leaf);
  }
}