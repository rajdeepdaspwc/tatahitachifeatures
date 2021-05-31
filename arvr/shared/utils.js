
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
  return false;
};


class Reticle extends THREE.Object3D {
  constructor() {
    super();

    // this.loader = new THREE.GLTFLoader();
    // this.loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", (gltf) => {
    //   this.add(gltf.scene);
    // })

    this.loader = new THREE.Mesh(
      new THREE.RingBufferGeometry( 0.05, 0.055, 32 ).rotateX( - Math.PI / 2 ),
      new THREE.MeshBasicMaterial()
    );

    this.add(this.loader);

    this.visible = false;
  }
}
var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
window.gltfLoader = new THREE.GLTFLoader();

window.gltfLoader.load("../3d/" + getUrlParameter("model") + ".glb", function(glb) {
  //const model = glb.scene.children.find(c => c.name === 'sunflower')
  // const bodyMaterial = new THREE.MeshPhysicalMaterial({
  //   color: 0xff0000, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
  // });
  // const carModel = glb.scene.children.find(c => c.name === 'body')
  // carModel.material = bodyMaterial;
  
  //flower.castShadow = true;

  // const carModel = glb.scene.children[ 0 ];
  // carModel.getObjectByName( 'body' ).material = new THREE.MeshPhysicalMaterial({
  //   color: 0xff00f0, metalness: 1, roughness: 0.2, clearcoat: 0.05, clearcoatRoughness: 0.05
  // });

          //console.log(carModel.getObjectByName( 'body' ).material);
 // console.log(glb.scene.children[0].children);
  window.sunflower = glb.scene;
});

window.gltfLoader.setDRACOLoader(dracoLoader);


window.DemoUtils = {
  /**
   * Creates a THREE.Scene containing lights that case shadows,
   * and a mesh that will receive shadows.
   *
   * @return {THREE.Scene}
   */
  createLitScene() {
    const scene = new THREE.Scene();

        // directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLight1.position.set(-0.371, 4.118, 7.111).normalize();
        

        // directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLight2.position.set(2.007, 8.119, -10.539).normalize();
        

        // ambientLight = new THREE.AmbientLight(0x777777, 1);
        

    // The materials will render as a black mesh
    // without lights in our scenes. Let's add an ambient light
    // so our material can be visible, as well as a directional light
    // for the shadow.
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight1.position.set(-0.371, 4.118, 7.111).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight2.position.set(2.007, 8.119, -10.539).normalize();
    scene.add(directionalLight2);

    // We want this light to cast shadow.
   // directionalLight.castShadow = true;

    // Make a large plane to receive our shadows
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    // Rotate our plane to be parallel to the floor
    planeGeometry.rotateX(-Math.PI / 2);

    // Create a mesh with a shadow material, resulting in a mesh
    // that only renders shadows once we flip the `receiveShadow` property.
    const shadowMesh = new THREE.Mesh(planeGeometry, new THREE.ShadowMaterial({
      color: 0x111111,
      opacity: 0.2,
    }));

    // Give it a name so we can reference it later, and set `receiveShadow`
    // to true so that it can render our model's shadow.
    shadowMesh.name = 'shadowMesh';
    shadowMesh.receiveShadow = true;
    shadowMesh.position.y = 10000;

    // Add lights and shadow material to scene.
    //scene.add(shadowMesh);
    

    return scene;
  },

  /**
   * Creates a THREE.Scene containing cubes all over the scene.
   *
   * @return {THREE.Scene}
   */
  createCubeScene() {
    const scene = new THREE.Scene();

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    ];

    const ROW_COUNT = 4;
    const SPREAD = 1;
    const HALF = ROW_COUNT / 2;
    for (let i = 0; i < ROW_COUNT; i++) {
      for (let j = 0; j < ROW_COUNT; j++) {
        for (let k = 0; k < ROW_COUNT; k++) {
          const box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), materials);
          box.position.set(i - HALF, j - HALF, k - HALF);
          box.position.multiplyScalar(SPREAD);
          scene.add(box);
        }
      }
    }

    return scene;
  },
};

/**
 * Toggle on a class on the page to disable the "Enter AR"
 * button and display the unsupported browser message.
 */
function onNoXRDevice() {
  document.body.classList.add('unsupported');
}