/* globals makeMadeline, BokehShape, makeBird */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 160;
var h = 160;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 5, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});


var madColor = {
  skin: '#FD9',
  hair: '#D53',
  parkaLight: '#67F',
  parkaDark: '#35D',
  tight: '#742',
  eye: '#333',
};
var badColor = {
  skin: '#EBC',
  hair: '#D4B',
  parkaLight: '#85A',
  parkaDark: '#527',
  tight: '#412',
  eye: '#D02',
};

var glow = 'hsla(60, 100%, 80%, 0.3)';
var featherGold = '#FE5';

var camera = new Anchor({
  rotate: { y: -TAU/4 },
});

// -- illustration shapes --- //

makeMadeline( true, madColor, {
  addTo: camera,
});
makeMadeline( false, badColor, {
  addTo: camera,
  rotate: { y: TAU/2 },
});


// ----- feather ----- //

var feather = new Group({
  addTo: camera,
  rotate: { y: -TAU/4 },
});

( function() {

  var featherPartCount = 8;
  var radius = 12;
  var angleX = (TAU/featherPartCount) / 2;
  var sector = (TAU * radius)/2 / featherPartCount;

  for ( var i=0; i < featherPartCount; i++ ) {
    var curve = Math.cos( (i/featherPartCount) * TAU*3/4 + TAU*1/4 );
    var x = 4 - curve*2;
    var y0 = sector/2;
    // var y2 = -sector/2;
    var isLast = i == featherPartCount - 1;
    var y3 = isLast ? sector * -1 : -y0;
    var z1 = -radius + 2 + curve*-1.5;
    var z2 = isLast ? -radius : -radius;
    var barb = new Shape({
      path: [
        { x: 0, y: y0, z: -radius },
        { x: x, y: -sector/2, z: z1 },
        { x: x, y: -sector*3/4, z: z1 },
        { x: 0, y: y3, z: z2 },
      ],
      addTo: feather,
      rotate: { x: angleX * -i + TAU/8 },
      lineWidth: 1,
      color: featherGold,
      fill: true,
    });
    barb.copy({
      scale: { x: -1 },
    });
  }

  // rachis
  var rachis = new Shape({
    path: [
      { y: -radius },
      { arc: [
        { y: -radius, z: -radius },
        { y: 0, z: -radius },
      ]},
      { arc: [
        { y: radius, z: -radius },
        { y: radius, z: 0 },
      ]},
    ],
    addTo: feather,
    lineWidth: 2,
    color: featherGold,
    closed: false,
  });
  rachis.copy({
    lineWidth: 8,
    color: glow,
    rotate: { x: -0.5 }
  });
})();

// ----- rods ----- //

( function() {

  var rodCount = 14;
  for ( var i=0; i < rodCount; i++ ) {
    var zRotor = new Anchor({
      addTo: camera,
      rotate: { z: TAU/rodCount * i },
    });

    var y0 = 32;
    var y1 = y0 + 2 + Math.random()*24;
    new BokehShape({
      path: [
        { y: y0 },
        { y: y1 },
      ],
      addTo: zRotor,
      rotate: { x: ( Math.random() * 2 - 1 ) * TAU/8 },
      color: madColor.skin,
      lineWidth: 1,
      bokehSize: 6,
      bokehLimit: 70,
    });
  }

})();

// dots

( function() {
  var dotCount = 64;

  for ( var i=0; i < dotCount; i++ ) {
    var yRotor = new Anchor({
      addTo: camera,
      rotate: { y: TAU/dotCount * i },
    });

    new BokehShape({
      path: [
        { z: 40*(1 - Math.random()*Math.random()) + 32 },
      ],
      addTo: yRotor,
      rotate: { x: ( Math.random() * 2 - 1 ) * TAU*3/16 },
      color: badColor.skin,
      lineWidth: 1 + Math.random(),
      bokehSize: 6,
      bokehLimit: 74,
    });
  }

})();

// ----- birds ----- //

var birdRotor = new Anchor({
  addTo: camera,
  rotate: { y: TAU*-1/8 },
});

makeBird({
  addTo: birdRotor,
  color: madColor.parkaLight,
  spin: TAU/2,
});

makeBird({
  addTo: birdRotor,
  color: featherGold,
  spin: -TAU * 3/8,
});

makeBird({
  addTo: birdRotor,
  color: 'white',
  spin: -TAU/4,
});

makeBird({
  addTo: birdRotor,
  color: madColor.hair,
  spin: -TAU/8,
});

makeBird({
  addTo: birdRotor,
  color: madColor.parkaDark,
  spin: TAU/8,
});

// -- animate --- //

var isRotating = true;
var rotateSpeed = -TAU/60;
var xClock = 0;
var then = new Date() - 1/60;

function animate() {
  update();
  illo.render( camera );
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  var now = new Date();
  var delta = now - then;
  // auto rotate
  if ( isRotating ) {
    var theta = rotateSpeed/60 * delta * -1;
    camera.rotate.y += theta;
    xClock += theta/4;
    camera.rotate.x = Math.sin( xClock ) * TAU/12;
  }

  camera.updateGraph();

  then = now;
}

// ----- inputs ----- //

illo.enableDragRotate( camera, function() {
  isRotating = false;
});
