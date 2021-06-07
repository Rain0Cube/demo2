var theta, lengthV;

function setup() {
  createCanvas(800, 500);
  background(250); //
  // the length of the vector is 100!
  lengthV = 100;
  //its startPoint (i.e. origin) is in the center of the canvas
  startPoint = createVector(width / 2, height / 2);
  //it will initially start
  vdisp = createVector(0, -lengthV);
  endPoint = Vector.add(startPoint, vdisp)

  aVector = new Arrow(startPoint, endPoint);
  aVector.color = color('purple');
  aVector.grab = false;
  aVector.draggable = false;
  aVector.showComponents = false;

  //makes an x-y coordinate axis
  stroke('blue');
  line(width/2,0,width/2,height);
  line(0,height/2,width,height/2);

  //just draw some other things
  push();
  noFill();
  stroke('red')
  ellipse(width / 2, height / 2, 4*lengthV, 4*lengthV);
  pop();
  push();
  fill('red')
  ellipse(width / 2, height / 2, 5, 5);
  pop()

  // New for 3D //
  background3D(11)
  //Z axis
  stroke('green');
  line(width/2,height/2,width/2,height/2,-height,height);
  //Light
  fill(color('#F8FF91'))
  pointLight(width/2,height/2);
  noFill()

  //Planet
  earthMESH = sphere(50,0,12)
  earthMESH.texture("jpg/earth-color.jpg")
  earthMESH.receiveShadow = true;

  sunMESH = sphere(width/2,height/2,20)
  sunMESH.texture("jpg/sun-texture-512.jpg")
  sunMESH.color('#e5bc29')

  //Moon Orbit
  push();
  stroke('purple')
  lengthMoon = 45;
  moonOrbit = ellipse(0, 0, lengthMoon, lengthMoon);
  pop()

  //Moon
  moonMESH = sphere(0,0,6)
  moonMESH.texture("jpg/2k_moon.jpg")
  moonMESH.castShadow = true;

  //Controls, only in 3D
  var control = orbitControls()
  control.origin = createVector(363, 650, -216)
  control.target = createVector(width/2, height/2, 0)
  control.enableZoom = false;
}

function draw() {

  // background(250);

  // sets a rotation in the CCW direction
  theta=-frameCount/200;

  //both the origin and the endpoint are moving now, but the length stays the same.
  aVector.origin = Vector.add(startPoint,createVector(2*lengthV*cos(theta),2*lengthV*sin(theta)));
  aVector.target = createVector(-lengthV*cos(theta),-lengthV*sin(theta)); //This is all inversed
  aVector.update();
  aVector.display();

  //Earth
  earthMESH.position.x = aVector.origin.x;
  earthMESH.position.y = aVector.origin.y;
  earthMESH.position.z = aVector.origin.z;

  //Moon
  moonVector = Vector.add(aVector.origin,createVector(2*lengthMoon/4*cos(theta*3),2*lengthMoon/4*sin(theta*3)));
  moonMESH.position.x = moonVector.x;
  moonMESH.position.y = moonVector.y;
  moonMESH.position.z = moonVector.z;

  moonOrbit.position.x = earthMESH.position.x
  moonOrbit.position.y = earthMESH.position.y
  moonOrbit.position.z = earthMESH.position.z
}
