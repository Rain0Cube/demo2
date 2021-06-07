/*
This is a demo, code is not fully refactored yet.
*/

/*
p5.js function implementation
*/

class VectorClass {
  constructor() {
  }
  add(vector1,vector2) {
    let vector = vector1.copy()
    vector.x += vector2.x
    vector.y += vector2.y
    vector.z += vector2.z

    return createVector(vector.x,vector.y,vector.z)
  }
  div(vector1,factor) {
    let vector = vector1.copy()
    vector.x = vector.x/factor
    vector.y = vector.y/factor
    vector.z = vector.z/factor

    return createVector(vector.x,vector.y,vector.z)
  }
  mult(vector1,factor) {
    let vector = vector1.copy()
    vector.x = vector.x * factor
    vector.y = vector.y * factor
    vector.z = vector.z * factor

    return createVector(vector.x,vector.y,vector.z)
  }
  copy(vector1) {
    vector = {}
    vector.x = vector1.x
    vector.y = vector1.y
    vector.z = vector1.z
    return createVector(vector.x,vector.y,vector.z)
  }
}
const Vector = new VectorClass()

function cos(angle) {
  return Math.cos(angle)
}

function sin(angle) {
  return Math.sin(angle)
}

var system = {}

var frameCount = performance.now()/18;
function draw() {
  //Dummy
}

function color(color,color2,color3) {
  if(typeof color != 'string') { //Hex
    return parseInt ( color.replace("#","0x"), 16 );
  } else if(typeof color == 'string') { //Hex
    return color;
  } else {
    return new THREE.Color(`rgb(${color}, ${color2}, ${color3})`);
  }
}

function noFill() {
  system.fill = ''
}

function fill(color) {
  system.fill = color
}

function push() {
  for(let i = 0;i<state.length;i++) {
    system.prevState[state[i]] = system[state[i]];
  }
}

function pop() {
  for(let i = 0;i<state.length;i++) {
    system[state[i]] = system.prevState[state[i]];
  }
}

function stroke(color) {
  system.stroke = color;
}

function line(x1,y1,x2,y2,z1,z2) {

  if(!z1) z1 = 0
  if(!z2) z2 = 0

  pos1 = new THREE.Vector3( x1, y1, z1 )
  pos2 = new THREE.Vector3( x2, y2, z2 )

  const curve = new THREE.LineCurve3( pos1, pos2 )

  const points = curve.getPoints( 50 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  const material = new THREE.LineBasicMaterial( { color : color2hex(system.stroke) } );

  const line = new THREE.Line( geometry, material );

  system.scene.add(line)

  return line;
}

function ellipse(aX,aY,weight,height) {

  const curve = new THREE.EllipseCurve(
    aX,  aY,            // ax, aY
    weight/2, height/2,           // xRadius, yRadius
    0,  2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
  );

  const points = curve.getPoints( 50 );
  let ellipse = {};

  // Fill
  if(system.fill!='') {
    const shape = new THREE.Shape( points );
    const geometry = new THREE.ShapeGeometry( shape );
    const material = new THREE.MeshBasicMaterial( { color: color2hex(system.fill) } );
    const fill_ellipse = new THREE.Mesh( geometry, material );
    ellipse.fill = fill_ellipse;
    system.scene.add(fill_ellipse)
  }
  // Outline
  if(system.stroke!='') {
    const outline_geometry = new THREE.BufferGeometry().setFromPoints( points );
    const outline_material = new THREE.LineBasicMaterial( { color : color2hex(system.stroke) } );

    const outline_ellipse = new THREE.Line( outline_geometry, outline_material );
    // ellipse.outline = outline_ellipse;
    ellipse = outline_ellipse;
    system.scene.add(outline_ellipse)
  }


  return ellipse;
}

function createCanvas(x,y,mode) {
  system.width = x;
  system.height = y;
  width = x
  height = y

  system.scene = new THREE.Scene();

  system.renderer = new THREE.WebGLRenderer();
  system.renderer.shadowMap.enabled = true;

  system.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  system.renderer.outputEncoding = THREE.sRGBEncoding;

  if(!mode) {
    system.camera = new THREE.OrthographicCamera( 0, x,0, y, 1, 1000 )
    system.camera.position.z = 100;
    system.renderer.setSize( x, y );
    // system.camera.projectionMatrix.scale
    // (new THREE.Vector3(1, -1, 1));

  } else {
    system.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    system.camera.position.set( 10, 40, 120 );
    system.renderer.setSize( window.innerWidth, window.innerHeight );
    system.renderer.setPixelRatio( window.devicePixelRatio );
    system.renderer.shadowMap.enabled = true;

    system.renderer.gammaInput = true;
    system.renderer.gammaOutput = true;

  }

  document.body.appendChild( system.renderer.domElement );

  // const axesHelper = new THREE.AxesHelper( 50 );
  // system.scene.add( axesHelper );
}

function background(color) {
  system.lightMode.background = color
  if(system.mode == '2D')
  system.renderer.setClearColor( new THREE.Color( `rgb(${color}, ${color}, ${color})`), 1 );
}

function background3D(color) {
  system.darkMode.background = color
  if(system.mode == '3D')
  system.renderer.setClearColor( new THREE.Color( `rgb(${color}, ${color}, ${color})`), 1 );
}

function createVector(x,y,z) {
  if(z==undefined) z=0; //z can be optional

  let frame = 1;
  let vector = {x:x,y:y,z:z}

  vector.add = function(vector2) {
    vector.x += vector2.x/frame
    vector.y += vector2.y/frame
    vector.z += vector2.z/frame
  }

  vector.div = function(factor) {
    vector.x = vector.x/factor
    vector.y = vector.y/factor
    vector.z = vector.z/factor
  }

  vector.copy = function() {
    vectorCopy = {}
    vectorCopy.x = vector.x
    vectorCopy.y = vector.y
    vectorCopy.z = vector.z
    return createVector(vectorCopy.x,vectorCopy.y,vectorCopy.z)
  }
  return vector
}

var controls = false;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

let framerate = false;
function frameRate(fr) {
  framerate = fr*1.5 //p5js frameRate is quite faster than d3js frameRate
}

//replace draw() with animate() and implement setup()
var setupOnce = false;
function animate() {

  if(!setupOnce && typeof setup === "function") {
    setup();
    setupOnce = true;
  }

  frameCount = performance.now()/18;
  draw();

  if(system.renderer)
  system.renderer.render( system.scene, system.camera );
  if(!system.renderer) {
    requestAnimationFrame( animate );
  } else {
    if(framerate) {
      setTimeout( function() {
        requestAnimationFrame( animate );
      }, 1000 / framerate );
    } else {
      requestAnimationFrame( animate );
    }
  }
}

animate();

/*
science-sim.js function implementation
*/
var KineticMass = function(pos,vel,accel,radius,color) {
  const geometry = new THREE.SphereGeometry(radius/2,32,32);
  const material = new THREE.MeshBasicMaterial( {  color: new THREE.Color( color ),
    transparent: true,
    opacity:0.7} ); //, opacity: 0.8, transparent: true, depthWrite: false
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = pos.x
    sphere.position.y = pos.y
    sphere.position.z = pos.z
    system.scene.add( sphere );

    sphere.mass = radius
    sphere.size = radius
    sphere.castShadow = true;


    // Frame
    // const wireframe = new THREE.WireframeGeometry( sphere.geometry ); //This has to be geometry
    //
    // const line = new THREE.LineSegments( wireframe );
    // line.material.depthWrite = false;
    // line.material.opacity = 0.3;
    // line.material.opacity = 0;
    // line.material.transparent = true;
    // // line.material.color = new THREE.Color( sphere.outline )
    // line.material.color = new THREE.Color( 'black' )
    // line.position.x = pos.x
    // line.position.y = pos.y
    // line.position.z = pos.z
    // sphere.outlinevectorCopyframe = line

    // Outline
    var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide,
      transparent: true,
      opacity:1 } );
      outlineMaterial.side = THREE.FrontSide
      var line = new THREE.Mesh( sphere.geometry, outlineMaterial );
      line.position.x = pos.x
      line.position.y = pos.y
      line.position.z = pos.z
      line.scale.multiplyScalar(1.13);
      sphere.outlinevectorCopyframe = line

      system.scene.add( line );

      sphere.outlineMesh = line
      sphere.vel = vel
      sphere.accel = accel
      line.vel = vel
      line.accel = accel

      sphere.trace = []
      sphere.lastTrace = new Date()

      sphere.update = function(surrounding)
      {
        sphere.previousVel = sphere.vel
        sphere.vel.add(sphere.accel);
        sphere.avgXVel = (sphere.previousVel.x+sphere.vel.x)/2;
        sphere.avgYVel = (sphere.previousVel.y+sphere.vel.y)/2;
        sphere.avgZVel = (sphere.previousVel.z+sphere.vel.z)/2;
        if(surrounding) {
          sphere.position.x = sphere.vel.x;
          sphere.position.y = sphere.vel.y;
          sphere.position.z = sphere.vel.z;
        } else {
          sphere.position.x += sphere.avgXVel;
          sphere.position.y += sphere.avgYVel;
          sphere.position.z += sphere.avgZVel;
        }
        line.position.x = sphere.position.x;
        line.position.y = sphere.position.y;
        line.position.z = sphere.position.z;

        if(sphere.tail==true) {
          sphere.trace.forEach((trace, i) => {
            trace.material.opacity = trace.material.opacity - 0.2/60
            if(trace.material.opacity<=0)
            sphere.trace.splice(i, 1);
          });

          if(new Date() - sphere.lastTrace > 100 && sphere.trace.length<100) {
            const traceGeo = new THREE.SphereGeometry(2,32,32);
            const traceMaterial = new THREE.MeshBasicMaterial( { color: new THREE.Color( sphere.tailFill ), opacity: 1, transparent: true, depthWrite: false } );

            const traceSphere = new THREE.Mesh( traceGeo, traceMaterial );
            traceSphere.position.x = sphere.position.x
            traceSphere.position.y = sphere.position.y
            traceSphere.position.z = sphere.position.z
            system.scene.add( traceSphere );
            sphere.trace.push(traceSphere)
            sphere.lastTrace = new Date()
            // console.log(sphere.trace.length)
          }
        }
      }

      sphere.display = function() {
        //Dummy
      }
      sphere.applyForce = function(force){
        f = force.copy()
        f.div(sphere.mass);
        sphere.accel = f;
      };

      sphere.wrapEdgesBounceFloor = function() {

        if (ball.position.x > width) {
          ball.position.x = 0 ;
        }
        else if (ball.position.x < 0) {
          ball.position.x = width ;
        }
        if(ball.position.y > height-ball.size/2){
          overiny = ball.position.y-height+ball.size/2;
          vatheight = Math.sqrt(Math.pow(ball.vel.y,2)-2*ball.accel.y*overiny);
          ball.position.y = height-ball.size/2;
          ball.vel.y = -1*vatheight;
        }
      }

      return sphere
    }

state = ['stroke','fill']
system.stroke = 'black'
system.fill = ''
system.prevState = {}

var Arrow = function(pos,vel) {
  let helper = {arrow:[],cylinder:[]}
  let height = ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2) * 15 *2 ; //15 to make vel longer
  let color = 'white'
  let posvectorCopyv = new THREE.Vector3( pos.x, pos.y, pos.z )
  let velvectorCopyv = new THREE.Vector3( vel.x, vel.y, vel.z )

  let material = new THREE.MeshBasicMaterial( {color: color} );
  let geometry = new THREE.CylinderGeometry( 2, 2, height, 32);

  let cylinder = new THREE.Mesh( geometry, material );

  var axis = new THREE.Vector3(0, 1, 0);
  cylinder.quaternion.setFromUnitVectors(axis, velvectorCopyv.clone().normalize());

  ratiovectorCopyx = Math.abs(vel.x) / ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2)
  ratiovectorCopyy = Math.abs(vel.y) / ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2)
  ratiovectorCopyz = Math.abs(vel.z) / ((vel.x)**2 + (vel.y)**2 + (vel.z)**2)**(1/2)
  cylinder.position.adjX = (vel.x - 0 !=0) ? ratiovectorCopyx*Math.sign(vel.x - 0)*height/2 : 0
  cylinder.position.adjY = (vel.y - 0 !=0) ? ratiovectorCopyy*Math.sign(vel.y - 0)*height/2 : 0
  cylinder.position.adjZ = (vel.z - 0 !=0) ? ratiovectorCopyz*Math.sign(vel.z - 0)*height/2 : 0
  cylinder.position.x = pos.x + cylinder.position.adjX;
  cylinder.position.y = pos.y + cylinder.position.adjY;
  cylinder.position.z = pos.z + cylinder.position.adjZ;

  helper.cylinder.push(cylinder)

  // Lines
  let dir = new THREE.Vector3( vel.x, vel.y, vel.z );
  dir.normalize();


  let origin = new THREE.Vector3( pos.x, pos.y, pos.z );
  let length = height + 15;
  let hex = color;

  let arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex, 15, 10 );

  arrowHelper.attach( cylinder ); //Works!!

  helper.origin = pos
  helper.target = vel
  arrowHelper.originVel = vel
  cylinder.originVel = vel
  cylinder.originHeight = height
  arrowHelper.vel = vel
  cylinder.vel = vel

  helper.arrow.push(arrowHelper)
  system.scene.add( helper.arrow[0] );


  helper.update = function() {

    arrowHelper.position.x = helper.origin.x
    arrowHelper.position.y = helper.origin.y
    arrowHelper.position.z = helper.origin.z

    if(helper.color && cylinder.material.color!=helper.color) {
      cylinder.material.color.setHex( color2hex(helper.color) );
      // cylinder.material.color.setHex( new THREE.Color( helper.color ).getHexString() ); //This doesn't work
      arrowHelper.setColor( new THREE.Color( helper.color ) );
    }

    if(helper.target) {
      //Minus the origin to make it work with target
      // let newDir = new THREE.Vector3( helper.target.x-helper.origin.x,
      //                                 helper.target.y-helper.origin.y,
      //                                 helper.target.z-helper.origin.z )

      let newDir = new THREE.Vector3( helper.target.x, helper.target.y, helper.target.z )
      let normalize = ((helper.target.x)**2 + (helper.target.y)**2 + (helper.target.z)**2)**(1/2)
      let height = normalize ; //15 to make vel longer
      arrowHelper.setDirection(newDir.normalize());
      arrowHelper.setLength(height, 15, 10);
      // 15 for arrow height
      cylinder.scale.y = (height-15)/cylinder.originHeight
      cylinder.position.y =+ (height-15)/2; //Turns out only need to change y.... don't need entire normalization from above
    }
  }

  helper.display = function() {
    //Dummy
  }

  return helper
}

var spotLight;
/*
Helper function
*/
function color2hex(htmlColor) {
  let color ={}
  color.white = 0xFFFFFF
  color.sliver = 0xC0C0C0
  color.gray = 0x808080
  color.black = 0x000000
  color.red = 0xFF0000
  color.maroon = 0x800000
  color.yellow = 0xFFFF00
  color.olive = 0x808000
  color.lime = 0x00FF00
  color.green = 0x008000
  color.aqua = 0x00FFFF
  color.teal = 0x008080
  color.blue = 0x0000FF
  color.navy = 0x000080
  color.fuchsia = 0xFF00FF
  color.purple = 0x800080

  if(htmlColor.includes('#')) return parseInt ( htmlColor.replace("#","0x"), 16 ) //Already is Hex

  return color[htmlColor.toLowerCase()]
}

/*
3D related
*/
system.mode = '2D'
let lightOnce = false;
system.lightMode = {}
system.darkMode = {}
system.lightMode.background = 250
system.darkMode.background = 11

function pointLight(x,y,z) {
  z = (z) ? z : 0;
  var color = (system.fill) ? color2hex(system.fill) : '0xffffff'

  var pointLight = new THREE.PointLight( color, 1 );
  pointLight.position.set(x,y,0);
  pointLight.castShadow = true; // default false
  system.scene.add( pointLight );

  return pointLight
}

function spotLight(x,y,z) {
  z = (z) ? z : 0;
  // spotlight
  var color = (system.fill) ? color2hex(system.fill) : '0xffffff'
  spotLight = new THREE.SpotLight( color, 1 );
  spotLight.penumbra = 0.1;
  spotLight.decay = 0.2;

  spotLight.distance = 900;
  spotLight.position.set( x, y, z );
  spotLight.intensity = 1

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 1200;
  spotLight.shadow.focus = 1;
  spotLight.shadowCameraFov = 30;
  system.scene.add( spotLight );
  spotLight.shadow.camera.updateProjectionMatrix()
  spotLight.target.updateMatrixWorld();

  // lightHelper = new THREE.SpotLightHelper( spotLight );
  // system.scene.add( lightHelper );
  //
  // shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
  // system.scene.add( shadowCameraHelper );

  return spotLight
}

function ambientLight() {
  //Create a new ambient light
  var color = (system.fill) ? color2hex(system.fill) : '0xffffff'
  const ambient = new THREE.AmbientLight( color );
  system.scene.add( ambient );

  return ambient
}

function toggleCamera(position) {

  if(system.mode == '2D') {
    system.mode = '3D'
    background3D(system.darkMode.background)
    THREE.Object3D.DefaultUp.set(0, -1, 0); //This inverse without affecting the light system
    system.camera = new THREE.PerspectiveCamera( 45, system.width / system.height, 1, 10000 );
    // system.camera.projectionMatrix.scale
    // (new THREE.Vector3(1, -1, 1));
    system.camera.position.set( 100, 0, -650 );
    system.camera.lookAt(position);
    system.camera.updateProjectionMatrix()

  } else {
    system.mode = '2D'
    background(system.lightMode.background)
    THREE.Object3D.DefaultUp.set(0, 1, 0);
    system.camera = new THREE.OrthographicCamera( 0, system.width,0, system.height, 1, 1000 )
    system.camera.rotation.set( 0, 0, 0 );
    system.camera.position.set( 0, 0, 100 );
    // system.camera.projectionMatrix.scale
    // (new THREE.Vector3(1, -1, 1));
  }

}

function createFloor(x,y,width,height) {
  //Create floor
  var color = (system.fill) ? color2hex(system.fill) : '0xffffff'
  var floorMaterial = new THREE.MeshPhongMaterial( { color: color,opacity: 0.8, transparent: true } );

  var floorGeometry = new THREE.PlaneGeometry(width, height);
  floorMaterial.side = THREE.DoubleSide;
  // floorMaterial.shadowSide = THREE.DoubleSide;

  floorMaterial.needsUpdate = true;
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.position.x = x;
  floor.position.y = y;

  system.scene.add(floor);

  function update() {
  }

  return floor

}


function sphere(x,y,size,setting) {
  var planetGEO = new THREE.SphereGeometry( size, 30, 30 );
  var planetMAT = new THREE.MeshStandardMaterial( {
    // roughness: 1,
  } );

  planet = new THREE.Mesh( planetGEO, planetMAT );
  planet.position.x = x;
  planet.position.y = y;
  // planet.visible = false;
  system.scene.add( planet );

  planet.texture = function(image) {
    var curSphere = this;

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( image, function ( map ) {
      map.anisotropy = 8;
      curSphere.material.map = map;
      curSphere.material.needsUpdate = true;
    } );
  }

  planet.color = function(color) {
    var curSphere = this;
    var planetMAT = new THREE.MeshBasicMaterial( {
      color: color,
    });
    curSphere.material = planetMAT;
    curSphere.material.needsUpdate = true;
  }

  return planet
}

system.control = false;
function orbitControls() {
  system.control = {name:'orbit'}
  return system.control
}

function darkMode() {

  if(system.mode == '2D') {
    toggleCamera({x:-300,y:-100,z:-200})

    if(system.control) {
      system.camera.position.set( system.control.origin.x, system.control.origin.y, system.control.origin.z );
      var control = new THREE.OrbitControls( system.camera, system.renderer.domElement );
      control.target.set( system.control.target.x, system.control.target.y, system.control.target.z );
      control.enabled = true;
      control.update();
    }

  } else {
    toggleCamera({x:0,y:0,z:0})
  }

}
