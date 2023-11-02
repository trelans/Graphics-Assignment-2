
var canvas;
var gl;
var program;

var projectionMatrix; 
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var colors = [

    vec4( 0.1,  0.1,  0.1, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.2,  0.2,  0.2, 1.0 ),
    vec4( 0.2,  0.2,  0.2, 1.0 ),
    vec4( 0.1,  0.1,  0.1, 1.0 ),
    vec4( 0.3,  0.3,  0.3, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.1,  0.1,  0.1, 1.0 )
];


// Add when new body part

// Head
var torsoId = 0;

// Leg 1
var headId  = 1;
var lowerHeadId  = 11;
var lowerLowerHeadId = 21;

// ??
var head1Id = 1;
var head2Id = 10;

// Leg 2
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var leftLowerLowerArmId = 22;


// Leg 3
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var rightLowerLowerArmId = 23;


// Leg 4
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var leftLowerlowerLegId = 24;


// Leg 5
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var rightLowerLowerLegId = 25;


// Leg 6
var legUpId = 12;
var legLowerArmId = 13;
var legMidArmId = 14;


// Leg 7
var legUpId2 = 15;
var legLowerArmId2 = 16;
var legMidArmId2 = 17;


// Leg 8
var legUpId3 = 18;
var legLowerArmId3 = 19;
var legMidArmId3 = 20;




//Head
var torsoHeight = 5.0;
var torsoWidth = 5.0;



var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;

var headHeight = 3;
var headWidth = 0.5;

var lowerHeadHeight  = 0.5;
var lowerHeadWidth = 2.0;

var midLegHeight = 0.5;
var midLegWidth = 2.0;

var upLegHeight = 0.5;
var upLegWidth = 2.0;


var legHeight = 5.0;
var legWidth = 5.0;


// Increase when new body part
var numNodes = 25;

// Increase when new joint
var numAngles = 25;
var angle = 0;

// Add new when new 
var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0 ,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var colorsArray = [];


// TrackBall

var rotationMatrix;
var rotationMatrixLoc;

var  angle = 0.0;
var  axis = [0, 0, 1];

var trackingMouse = false;
var trackballMove = false;

var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;




//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
    case torsoId:
    
    m = rotate(theta[torsoId], 0, 1, 0 );
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId: 
    case head1Id: 
    case head2Id:
    

    m = translate(0.0, -(torsoHeight+0.5*headHeight), 0.0);
	m = mult(m, rotate(theta[head1Id], 1, 0, 0))
	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, lowerHeadId);
    break;
    
    

    case legUpId:

        m = translate(-(torsoWidth/2.25), 0.9*torsoHeight, 0.0);
        m = mult(m, rotate(theta[legUpId], 1, 0, 0));
    
        figure[legUpId] = createNode( m, legUp, legUpId2, legMidArmId );

    break;

    case legUpId2:
        m = translate(-(torsoWidth/2.25), 0.9*torsoHeight, 0.0);
        m = mult(m, rotate(theta[legUpId2], 1, 0, 0));
    
        figure[legUpId2] = createNode( m, legUp2, legUpId3, legMidArmId2 );
    break;

    case legUpId3:
    
    m = translate(-(torsoWidth/2.25), 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[legUpId3], 1, 0, 0));

    figure[legUpId3] = createNode( m, legUp3, null, legMidArmId3 );
    break;

    case leftUpperArmId:
    
    m = translate(-(torsoWidth/2.25), 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));

    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:
    
    m = translate(torsoWidth/2.25, 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;
    
    case leftUpperLegId:
    
    m = translate(-(torsoWidth/2.25), 0.1*upperLegHeight, 0.0);
	m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
    
    m = translate(torsoWidth/2.25, 0.1*upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, legUpId, rightLowerLegId );
    break;
   //  
    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;
    
    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;
    
    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;
    
    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    // 2TH 
    case lowerHeadId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[lowerHeadId], 1, 0, 0));
        figure[lowerHeadId] = createNode( m, lowerHead, null, lowerLowerHeadId );
    break;

    case legMidArmId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[legMidArmId], 1, 0, 0));
        figure[legMidArmId] = createNode( m, legMid, null, legLowerArmId );
    break;

    
    case legMidArmId2:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[legMidArmId2], 1, 0, 0));
        figure[legMidArmId2] = createNode( m, legMid2, null, legLowerArmId2 );
    break;

    
    case legMidArmId3:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[legMidArmId3], 1, 0, 0));
        figure[legMidArmId3] = createNode( m, legMid3, null, legLowerArmId3 );
    break;
       
    // 3th

    case lowerLowerHeadId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[lowerLowerHeadId], 1, 0, 0));
        figure[lowerLowerHeadId] = createNode( m, lowerLowerHead, null, null );
    break;
    
    case leftLowerLowerArmId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerLowerArmId], 1, 0, 0));
        figure[leftLowerLowerArmId] = createNode( m, leftLowerLowerArm, null, null );
    break;

    case leftLowerlowerLegId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerlowerLegId], 1, 0, 0));
        figure[leftLowerlowerLegId] = createNode( m, leftLowerLowerLeg, null, null );
    break;

    case rightLowerLowerArmId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerLowerArmId], 1, 0, 0));
        figure[rightLowerLowerArmId] = createNode( m, rightLowerLowerArm, null, null );
    break;
    
    case rightLowerLowerLegId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerLowerLegId], 1, 0, 0));
        figure[rightLowerLowerLegId] = createNode( m, rightLowerLowerLeg, null, null );
    break;

    case legLowerArmId:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[legLowerArmId], 1, 0, 0));
        figure[legLowerArmId] = createNode( m, legDown, null, null );

    break;
    
    case legLowerArmId2:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[legLowerArmId2], 1, 0, 0));
        figure[legLowerArmId2] = createNode( m, legDown2, null, null );

    break;

    case legLowerArmId3:
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[legLowerArmId3], 1, 0, 0));
        figure[legLowerArmId3] = createNode( m, legDown3, null, null );
    break;    

    }

   

}

function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function lowerHead() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leftLowerLowerLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function rightUpperLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function lowerLowerHead() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legUp() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legMid() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legDown() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function legUp2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legMid2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legDown2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function legUp3() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legMid3() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function legDown3() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     pointsArray.push(vertices[b]); 
     pointsArray.push(vertices[c]);     
     pointsArray.push(vertices[d]);    

     colorsArray.push(colors[a]);
     colorsArray.push(colors[b]);
     colorsArray.push(colors[c]);
     colorsArray.push(colors[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function trackballView( x,  y ) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0]*v[0] + v[1]*v[1];
    if (d < 1.0)
      v[2] = Math.sqrt(1.0 - d);
    else {
      v[2] = 0.0;
      a = 1.0 /  Math.sqrt(d);
      v[0] *= a;
      v[1] *= a;
    }
    return v;
}


function mouseMotion( x,  y)
{
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if(trackingMouse) {
      dx = curPos[0] - lastPos[0];
      dy = curPos[1] - lastPos[1];
      dz = curPos[2] - lastPos[2];

      if (dx || dy || dz) {
	       angle = -0.1 * Math.sqrt(dx*dx + dy*dy + dz*dz);


	       axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
	       axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
	       axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];

         lastPos[0] = curPos[0];
	       lastPos[1] = curPos[1];
	       lastPos[2] = curPos[2];
      }
    }
    render();
}

function startMotion( x,  y)
{
    trackingMouse = true;
    startX = x;
    startY = y;
    curx = x;
    cury = y;

    lastPos = trackballView(x, y);
	  trackballMove=true;
}

function stopMotion( x,  y)
{
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
	     angle = 0.0;
	     trackballMove = false;
    }
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram( program);

    instanceMatrix = mat4();
    
    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();

        
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
    
    cube();
        
    vBuffer = gl.createBuffer();
        
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLocation = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);


        document.getElementById("slider0").onchange = function() {
        theta[torsoId ] = event.srcElement.value;
        initNodes(torsoId);
    };
        document.getElementById("slider1").onchange = function() {
        theta[head1Id] = event.srcElement.value;
        initNodes(head1Id);
    };

    document.getElementById("slider2").onchange = function() {
         theta[leftUpperArmId] = event.srcElement.value;
         initNodes(leftUpperArmId);
    };
    document.getElementById("slider3").onchange = function() {
         theta[leftLowerArmId] =  event.srcElement.value;
         initNodes(leftLowerArmId);
    };
     
        document.getElementById("slider4").onchange = function() {
        theta[rightUpperArmId] = event.srcElement.value;
        initNodes(rightUpperArmId);
    };
    document.getElementById("slider5").onchange = function() {
         theta[rightLowerArmId] =  event.srcElement.value;
         initNodes(rightLowerArmId);
    };
        document.getElementById("slider6").onchange = function() {
        theta[leftUpperLegId] = event.srcElement.value;
        initNodes(leftUpperLegId);
    };
    document.getElementById("slider7").onchange = function() {
         theta[leftLowerLegId] = event.srcElement.value;
         initNodes(leftLowerLegId);
    };
    document.getElementById("slider8").onchange = function() {
         theta[rightUpperLegId] =  event.srcElement.value;
         initNodes(rightUpperLegId);
    };
        document.getElementById("slider9").onchange = function() {
        theta[rightLowerLegId] = event.srcElement.value;
        initNodes(rightLowerLegId);
    };
    document.getElementById("slider10").onchange = function() {
         theta[head2Id] = event.srcElement.value;
         initNodes(head2Id);
    };
    document.getElementById("slider11").onchange = function() {
         theta[lowerHeadId] = event.srcElement.value;
         initNodes(lowerHeadId);
    };
    document.getElementById("slider12").onchange = function() {
        theta[lowerLowerHeadId] = event.srcElement.value;
        initNodes(lowerLowerHeadId);
   };
    document.getElementById("slider13").onchange = function() {
        theta[legUpId] = event.srcElement.value;
        initNodes(legUpId);
    };
    document.getElementById("slider14").onchange = function() {
        theta[legMidArmId] = event.srcElement.value;
        initNodes(legMidArmId);
    };
    document.getElementById("slider15").onchange = function() {
        theta[legLowerArmId] = event.srcElement.value;
        initNodes(legLowerArmId);
    };
    document.getElementById("slider16").onchange = function() {
        theta[legUpId2] = event.srcElement.value;
        initNodes(legUpId2);
    };
    document.getElementById("slider17").onchange = function() {
        theta[legMidArmId2] = event.srcElement.value;
        initNodes(legMidArmId2);
    };
    document.getElementById("slider18").onchange = function() {
        theta[legLowerArmId2] = event.srcElement.value;
        initNodes(legLowerArmId2);
    };
    document.getElementById("slider19").onchange = function() {
        theta[legUpId3] = event.srcElement.value;
        initNodes(legUpId3);
    };
    document.getElementById("slider20").onchange = function() {
        theta[legMidArmId3] = event.srcElement.value;
        initNodes(legMidArmId3);
    };
    document.getElementById("slider21").onchange = function() {
        theta[legLowerArmId3] = event.srcElement.value;
        initNodes(legLowerArmId3);
    };
    document.getElementById("slider22").onchange = function() {
        theta[leftLowerlowerLegId] = event.srcElement.value;
        initNodes(leftLowerlowerLegId);
    };
    document.getElementById("slider23").onchange = function() {
        theta[rightLowerLowerLegId] = event.srcElement.value;
        initNodes(rightLowerLowerLegId);
    };
    document.getElementById("slider24").onchange = function() {
        theta[leftLowerLowerArmId] = event.srcElement.value;
        initNodes(leftLowerlowerLegId);
    };
    document.getElementById("slider25").onchange = function() {
        theta[rightLowerLowerArmId] = event.srcElement.value;
        initNodes(rightLowerLowerArmId);
    };
    

   

    for(i=0; i<numNodes; i++) initNodes(i);
    

    rotationMatrix = mat4();
    rotationMatrixLoc = gl.getUniformLocation(program, "r");
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));

    canvas.addEventListener("mousedown", function(event){
        var x = 2*event.clientX/canvas.width-1;
        var y = 2*(canvas.height-event.clientY)/canvas.height-1;
        startMotion(x, y);
      });
  
      canvas.addEventListener("mouseup", function(event){
        var x = 2*event.clientX/canvas.width-1;
        var y = 2*(canvas.height-event.clientY)/canvas.height-1;
        stopMotion(x, y);
      });
  
      canvas.addEventListener("mousemove", function(event){
  
        var x = 2*event.clientX/canvas.width-1;
        var y = 2*(canvas.height-event.clientY)/canvas.height-1;
        mouseMotion(x, y);
      } );

    render();
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );
    
        if(trackballMove) {
            axis = normalize(axis);
            rotationMatrix = mult(rotationMatrix, rotate(angle, axis));
            gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
          }

        traverse(torsoId);
        requestAnimFrame(render);
}
