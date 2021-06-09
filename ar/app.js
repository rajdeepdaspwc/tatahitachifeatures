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

      // document.getElementById("rotate-right").addEventListener("click", this.onRotateRight);

      document.getElementById("zoom-in").addEventListener("click", this.onZoomIn);
      document.getElementById("zoom-out").addEventListener("click", this.onZoomOut);

      //this.xrSession.addEventListener("select", this.onRotateLeft);
    }

    sessionEnd = () => {
      location.reload();
    	document.getElementById("place-button").style.display = "none";
        document.getElementById("rotate-left").style.display = "none";
       // document.getElementById("rotate-right").style.display = "none";
        document.getElementById("zoom-out").style.display = "none";
        document.getElementById("zoom-in").style.display = "none";
        $("#stabilization").hide();
     //    $(".instructions-overlay").fadeIn();
     //    $("footer").fadeIn();
     //    $("header").fadeIn();
    };

    rotation;
    scale = .7;

    onRotateRight = () => {
    	this.rotation = this.rotation + .1;
      current_object.rotation.y = this.rotation;
    }

    onRotateLeft = () => {
    	this.rotation = this.rotation - .1;
      current_object.rotation.y = this.rotation;
    }

    onZoomIn = () => {
      this.scale = this.scale + this.scale / 10;
    	current_object.scale.set(this.scale, this.scale, this.scale);
    }

    onZoomOut = () => {
    	this.scale = this.scale - this.scale / 10;
    	current_object.scale.set(this.scale, this.scale, this.scale);
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
	// this.renderer.outputEncoding = THREE.sRGBEncoding;
	// this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
	this.renderer.toneMappingExposure = 0.85;

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
       // document.getElementById("rotate-right").style.display = "block";
        document.getElementById("zoom-out").style.display = "block";
        document.getElementById("zoom-in").style.display = "block";

        
      }

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