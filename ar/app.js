import * as THREE from '../build/three.module.js';
      //import { ARButton } from './jsm/webxr/ARButton.js';
      //import { VRButton } from './jsm/webxr/VRButton.js';
      import Stats from '../jsm/libs/stats.module.js';
      import { RoomEnvironment } from '../jsm/environments/RoomEnvironment.js';
      import { OrbitControls } from '../jsm/controls/OrbitControls.js';
      import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
      //import { OBJLoader } from './jsm/loaders/OBJLoader.js';
      //import { VRMLLoader } from './jsm/loaders/VRMLLoader.js';
      import { DRACOLoader } from '../jsm/loaders/DRACOLoader.js';
      import { RGBELoader } from '../jsm/loaders/RGBELoader.js';


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
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
window.gltfLoader = new GLTFLoader();

//window.gltfLoader.load("https://api.cegcpapa5m-tatahitac1-d1-public.model-t.cc.commerce.ondemand.com/medias/ferrarired.glb?context=bWFzdGVyfGltYWdlc3wxNTE4NTQ2NHxhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW18aGQ3L2g3NS84ODM2MTcxNDY0NzM0L2ZlcnJhcmlyZWQuZ2xifGQwNzg0MTc4OTQ4MmU1NDZmYmIzNTQwNDE4NjNmMTI4YmM5ZDRhODE4MTk3MTg5YmFmYzFjZTgwNGIyY2IwZDk", function(glb) {

window.gltfLoader.load("../3d/" + getUrlParameter("model") + "/" + getUrlParameter("model") + ".glb", function(glb) {
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
  $("#loading-screen").fadeOut();
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
    // const light = new THREE.AmbientLight(0xffffff, 1);
    // scene.add(light);
    // const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
    // directionalLight1.position.set(-0.371, 4.118, 7.111).normalize();
    // scene.add(directionalLight1);

    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
    // directionalLight2.position.set(2.007, 8.119, -10.539).normalize();
    // scene.add(directionalLight2);

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


/* ################################################## */


/**
 * Query for WebXR support. If there's no support for the `immersive-ar` mode,
 * show an error.
 */
$(".backbutton a").attr("href", $(".backbutton a").attr("href") + getUrlParameter("model"));
 function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
if(iOS()){
  $("#ARButtonIos").show();
  $("#enter-ar").hide();
} else {
  $("#ARButtonIos").hide();
  $("#enter-ar").show();
}

(async function() {
  const isArSessionSupported = navigator.xr && navigator.xr.isSessionSupported && await navigator.xr.isSessionSupported("immersive-ar");
  if (isArSessionSupported) {
    document.getElementById("enter-ar").addEventListener("click", window.app.activateXR)
  } else {
    onNoXRDevice();
  }
})();

$("#unsupported-info .close-popup").click(function(){
  $("body").removeClass("unsupported");
});

/**
 * Container class to manage connecting to the WebXR Device API
 * and handle rendering on every frame.
 */
var current_object ;

var touchDown, touchX, touchY, deltaX, deltaY;

class App {
  /**
   * Run when the Start AR button is pressed.
   */
  activateXR = async () => {
    try {
      // Initialize a WebXR session using "immersive-ar".
      this.xrSession = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      // Create the canvas that will contain our camera's background and our virtual scene.
      this.createXRCanvas();

      // With everything set up, start the app.
      await this.onSessionStarted();
    } catch(e) {
      console.log(e);
      onNoXRDevice();
    }
  }

  /**
   * Add a canvas element and initialize a WebGL context that is compatible with WebXR.
   */
  createXRCanvas() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.gl = this.canvas.getContext("webgl", {xrCompatible: true});

    this.xrSession.updateRenderState({
      baseLayer: new XRWebGLLayer(this.xrSession, this.gl)
    });
  }

  /**
   * Called when the XRSession has begun. Here we set up our three.js
   * renderer, scene, and camera and attach our XRWebGLLayer to the
   * XRSession and kick off the render loop.
   */
  onSessionStarted = async () => {
    // Add the `ar` class to our body, which will hide our 2D components
    $("#stabilization").show();

    // To help with working with 3D on the web, we'll use three.js.
    this.setupThreeJs();
    

    // Setup an XRReferenceSpace using the "local" coordinate system.
    this.localReferenceSpace = await this.xrSession.requestReferenceSpace('local');

    // Create another XRReferenceSpace that has the viewer as the origin.
    this.viewerSpace = await this.xrSession.requestReferenceSpace('viewer');
    // Perform hit testing using the viewer as origin.
    this.hitTestSource = await this.xrSession.requestHitTestSource({ space: this.viewerSpace });

    // Start a rendering loop using this.onXRFrame.
    this.xrSession.requestAnimationFrame(this.onXRFrame);

    this.xrSession.addEventListener('end', this.sessionEnd);

    document.getElementById("place-button").addEventListener("click", this.onPlace);

     document.getElementById("rotate-left").addEventListener("click", this.onRotateLeft);

      document.getElementById("rotate-right").addEventListener("click", this.onRotateRight);

      document.getElementById("zoom-in").addEventListener("click", this.onZoomIn);
      document.getElementById("zoom-out").addEventListener("click", this.onZoomOut);
      document.getElementById("setToOriginal").addEventListener("click", this.setToOriginal);

      //this.xrSession.addEventListener("select", this.onRotateLeft);
    }

    sessionEnd = () => {
      location.reload();
    	document.getElementById("place-button").style.display = "none";
        document.getElementById("rotate-left").style.display = "none";
        document.getElementById("rotate-right").style.display = "none";
        document.getElementById("zoom-out").style.display = "none";
        document.getElementById("zoom-in").style.display = "none";
        document.getElementById("setToOriginal").style.display = "none";
        document.getElementById("currentModelSize").style.display = "none";
        $("#stabilization").hide();
     //    $(".instructions-overlay").fadeIn();
     //    $("footer").fadeIn();
     //    $("header").fadeIn();
    };

    rotation;
    scale = 1;

    onRotateRight = () => {
    	this.rotation = this.rotation + .1;
      current_object.rotation.y = this.rotation;
    }

    onRotateLeft = () => {
    	this.rotation = this.rotation - .1;
      current_object.rotation.y = this.rotation;
    }

    onZoomIn = () => {
      if(Math.round(this.scale * 100) < 100){
        this.scale = this.scale + .1;
    	  current_object.scale.set(this.scale, this.scale, this.scale);
        $("#currentModelSize span").text(Math.round(this.scale * 100));
      }
      
      //alert(this.scale);
    }

    onZoomOut = () => {
      if(Math.round(this.scale * 100) > 10){
        this.scale = this.scale - .1
        current_object.scale.set(this.scale, this.scale, this.scale);
        $("#currentModelSize span").text(Math.round(this.scale * 100));
      }
      //alert(this.scale);
    }

    setToOriginal = () =>{
      this.scale = 1;
    	current_object.scale.set(this.scale, this.scale, this.scale);
      $("#currentModelSize span").text(this.scale * 100);
     // alert(this.scale);
    }

  /** Place a sunflower when the screen is tapped. */
 // rotateObject = () => {
	// 			if(current_object){
	// 				current_object.rotation.y += deltaX / 100;
	// 			}
	// 		};

  onPlace = () => {

   if (window.sunflower) {

    	this.scene.remove(current_object);
       current_object = window.sunflower.clone();
      current_object.position.copy(this.reticle.position);
      
      this.scene.add(current_object);
      current_object.scale.set(this.scale,this.scale,this.scale);
      if(this.rotation !== undefined){
      	current_object.rotation.y = this.rotation;
      } else{
      	this.rotation = current_object.rotation.y;
      }

      // const shadowMesh = this.scene.children.find(c => c.name === 'shadowMesh');
      // shadowMesh.position.y = current_object.position.y;
    }
  }
      

  /**
   * Called on the XRSession's requestAnimationFrame.
   * Called with the time and XRPresentationFrame.
   */
  onXRFrame = (time, frame) => {

      $(".instructions-overlay").fadeOut();
      $("footer").fadeOut();
      $("header").fadeOut();

				

    // Queue up the next draw request.
    this.xrSession.requestAnimationFrame(this.onXRFrame);

    // Bind the graphics framebuffer to the baseLayer's framebuffer.
    const framebuffer = this.xrSession.renderState.baseLayer.framebuffer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
    this.renderer.setFramebuffer(framebuffer);
    

    // Retrieve the pose of the device.
    // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
    const pose = frame.getViewerPose(this.localReferenceSpace);
    if (pose) {
      // In mobile AR, we only have one view.
      const view = pose.views[0];

      const viewport = this.xrSession.renderState.baseLayer.getViewport(view);
       this.renderer.setSize(viewport.width, viewport.height);
 //      this.renderer.setPixelRatio( window.devicePixelRatio );

  this.environment = new RoomEnvironment();
      this.pmremGenerator = new THREE.PMREMGenerator( this.renderer );
      //this.scene.environment = this.pmremGenerator.fromScene( this.environment ).texture;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.6;

      // Use the view's transform matrix and projection matrix to configure the THREE.camera.
      this.camera.matrix.fromArray(view.transform.matrix);
      this.camera.projectionMatrix.fromArray(view.projectionMatrix);
      this.camera.updateMatrixWorld(true);

      // Conduct hit test.
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);

      // If we have results, consider the environment stabilized.
      if (!this.stabilized && hitTestResults.length > 0) {
        this.stabilized = true;
        $("#stabilization").hide();
      }
      if (hitTestResults.length > 0) {
        const hitPose = hitTestResults[0].getPose(this.localReferenceSpace);

        // Update the reticle position
        this.reticle.visible = true;
        this.reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
        this.reticle.updateMatrixWorld(true);
        document.getElementById("place-button").style.display = "block";
        document.getElementById("rotate-left").style.display = "block";
        document.getElementById("rotate-right").style.display = "block";
        document.getElementById("zoom-out").style.display = "block";
        document.getElementById("zoom-in").style.display = "block";
        document.getElementById("setToOriginal").style.display = "block";
        document.getElementById("currentModelSize").style.display = "block";
      }
      this.environment = new RoomEnvironment();
      this.pmremGenerator = new THREE.PMREMGenerator( this.renderer );
      this.scene.environment = this.pmremGenerator.fromScene( this.environment ).texture;
      // Render the scene with THREE.WebGLRenderer.
      this.renderer.render(this.scene, this.camera)
    }
  }

  /**
   * Initialize three.js specific rendering code, including a WebGLRenderer,
   * a demo scene, and a camera for viewing the 3D content.
   */
  setupThreeJs() {
    // To help with working with 3D on the web, we'll use three.js.
    // Set up the WebGLRenderer, which handles rendering to our session's base layer.
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: this.canvas,
      context: this.gl
    });
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize our demo scene.
    this.scene = DemoUtils.createLitScene();
    this.reticle = new Reticle();
    this.scene.add(this.reticle);

    // We'll update the camera matrices directly from API, so
    // disable matrix auto updates so three.js doesn't attempt
    // to handle the matrices independently.
    this.camera = new THREE.PerspectiveCamera();
    this.camera.matrixAutoUpdate = false;
  }
};

window.app = new App();

var qrcode = new QRCode("qrcode", {
  text: "https://65.2.42.1/ar.html?model=zaxis370",
  width: 128,
  height: 128,
  colorDark : "#000000",
  colorLight : "#ffffff",
  correctLevel : QRCode.CorrectLevel.H
});

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if(!isMobileDevice()){
  $(".qrcode-overlay").fadeIn();
  var qrcode2 = new QRCode("qrcode2", {
    text: "https://65.2.42.1/ar.html?model=zaxis370",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
}