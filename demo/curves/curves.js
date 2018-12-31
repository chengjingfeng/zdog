var canvas = document.querySelector('canvas');
var w = 72;
var h = 72;
var zoom = 6;
canvas.width =  w * zoom;
canvas.height = h * zoom;
// colors

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});


var camera = new Anchor();

// -- illustration shapes --- //

// rectangle with curve
new Shape({
  path: [
    { x: -6, y: -8 },
    { bezier: [
      { x:  0, y: -12, z: -5 },
      { x:  0, y: -4 },
      { x:  6, y: -8 },
    ]},
    { x:  6, y:  8 },
    { bezier: [
      { x:  0, y: 8, z: -5 },
      { x:  0, y: 8, z: 5 },
      { x:  -6, y: 8 },
    ]},
    { x: -6, y:  8 },
  ],
  addTo: camera,
  lineWidth: 2,
  color: '#19F',
});

// quarter circle
new Shape({
  path: [
    { x: 10, y: 0 },
    { arc: [
      { x: 20, y: 0 },
      { x: 20, y: 10 }
    ]},
    { x: 10, y: 10 }
  ],
  addTo: camera,
  lineWidth: 2,
  color: '#A00',
});

// -- animate --- //

function animate() {
  camera.updateGraph();
  illo.render( camera );
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

illo.enableDragRotate( camera, function() {
  isRotating = false;
});
