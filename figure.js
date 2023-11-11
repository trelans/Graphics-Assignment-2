
var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var colors = [

    vec4(0.1, 0.1, 0.1, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.2, 0.2, 0.2, 1.0),
    vec4(0.2, 0.2, 0.2, 1.0),
    vec4(0.1, 0.1, 0.1, 1.0),
    vec4(0.3, 0.3, 0.3, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.1, 0.1, 0.1, 1.0)
];


// Body Parts
let upperLeg;
let middleLeg;
let lowerLeg;


// Head
var torsoId = 0;

// Head
var headId = 1;
var head1Id = 1;
var head2Id = 26;

// Leg 1
let cornerFrontLeftUpperId = 2;
let cornerFrontLeftMiddleId = 3;
let cornerFrontLeftLowerId = 4;

// Leg 2
let cornerFrontRightUpperId = 5;
let cornerFrontRightMiddleId = 6;
let cornerFrontRightLowerId = 7;

// Leg 3
let cornerBackLeftUpperId = 8;
let cornerBackLeftMiddleId = 9;
let cornerBackLeftLowerId = 10;


// Leg 4
let cornerBackRightUpperId = 11;
let cornerBackRightMiddleId = 12;
let cornerBackRightLowerId = 13;


// Leg 5
let middleFrontUpperId = 14;
let middleFrontMiddleId = 15;
let middleFrontLowerId = 16;


// Leg 6
let middleBackUpperId = 17;
let middleBackMiddleId = 18;
let middleBackLowerId = 19;


// Leg 7
let middleLeftUpperId = 20;
let middleLeftMiddleId = 21;
let middleLeftLowerId = 22;

// Leg 8
let middleRightUpperId = 23;
let middleRightMiddleId = 24;
let middleRightLowerId = 25;


// Width and height of body parts
var torsoHeight = 5.0;
var torsoWidth = 5.0;

var upperLegWidth = 0.5;
var middleLegWidth = 0.4;
var lowerLegWidth = 0.3;

var upperLegHeight = 3.0;
var middleLegHeight = 2.0;
var lowerLegHeight = 1.0;

var headHeight = 1.5;
var headWidth = 1.0;

// Increase when new body part
var numNodes = 26;

// Increase when new joint
var numAngles = 27;
var angle = 0;

// Add new when new 
var theta = [60, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0, 180, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var colorsArray = [];


// TrackBall

var rotationMatrix;
var rotationMatrixLoc;

var angle = 0.0;
var axis = [0, 0, 1];

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


function createNode(transform, render, sibling, child) {
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

    switch (Id) {

        case torsoId:

            m = rotate(theta[torsoId], 0, 1, 0);
            figure[torsoId] = createNode(m, torso, null, headId);
            break;

        case headId:
        case head1Id:
        case head2Id:


            m = translate(0.0, (torsoHeight + 0.5 * headHeight), 0.0);
            m = mult(m, rotate(theta[head1Id], 1, 0, 0))
            m = mult(m, rotate(theta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[headId] = createNode(m, head, cornerFrontLeftUpperId, null);
            break;

        // Corner Front Leg Cases
        case cornerFrontLeftUpperId:
            m = translate(-(torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.5 * torsoWidth - upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerFrontLeftUpperId], 1, 0, 0));
            figure[cornerFrontLeftUpperId] = createNode(m, upperLeg, cornerFrontRightUpperId, cornerFrontLeftMiddleId);
            break;

        case cornerFrontLeftMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerFrontLeftMiddleId], 1, 0, 0));
            figure[cornerFrontLeftMiddleId] = createNode(m, middleLeg, null, cornerFrontLeftLowerId);
            break;
        case cornerFrontLeftLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerFrontLeftLowerId], 1, 0, 0));
            figure[cornerFrontLeftLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Corner Front Right Leg Cases
        case cornerFrontRightUpperId:
            m = translate((torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.5 * torsoWidth - upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerFrontRightUpperId], 1, 0, 0));
            figure[cornerFrontRightUpperId] = createNode(m, upperLeg, cornerBackLeftUpperId, cornerFrontRightMiddleId);
            break;
        case cornerFrontRightMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerFrontRightMiddleId], 1, 0, 0));
            figure[cornerFrontRightMiddleId] = createNode(m, middleLeg, null, cornerFrontRightLowerId);
            break;
        case cornerFrontRightLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerFrontRightLowerId], 1, 0, 0));
            figure[cornerFrontRightLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Corner Back Left Leg Cases
        case cornerBackLeftUpperId:
            m = translate(-(torsoWidth / 2 - upperLegWidth / 2), 0.0, -0.5 * torsoWidth + upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerBackLeftUpperId], 1, 0, 0));
            figure[cornerBackLeftUpperId] = createNode(m, upperLeg, cornerBackRightUpperId, cornerBackLeftMiddleId);
            break;
        case cornerBackLeftMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerBackLeftMiddleId], 1, 0, 0));
            figure[cornerBackLeftMiddleId] = createNode(m, middleLeg, null, cornerBackLeftLowerId);
            break;
        case cornerBackLeftLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerBackLeftLowerId], 1, 0, 0));
            figure[cornerBackLeftLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Corner Back Right Leg Cases
        case cornerBackRightUpperId:
            m = translate((torsoWidth / 2 - upperLegWidth / 2), 0.0, -0.5 * torsoWidth + upperLegWidth / 2);
            m = mult(m, rotate(theta[cornerBackRightUpperId], 1, 0, 0));
            figure[cornerBackRightUpperId] = createNode(m, upperLeg, middleFrontUpperId, cornerBackRightMiddleId);
            break;
        case cornerBackRightMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[cornerBackRightMiddleId], 1, 0, 0));
            figure[cornerBackRightMiddleId] = createNode(m, middleLeg, null, cornerBackRightLowerId);
            break;
        case cornerBackRightLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[cornerBackRightLowerId], 1, 0, 0));
            figure[cornerBackRightLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Front Leg Cases
        case middleFrontUpperId:
            m = translate(0.0, 0.0, 0.5 * torsoWidth - upperLegWidth / 2);
            m = mult(m, rotate(theta[middleFrontUpperId], 1, 0, 0));
            figure[middleFrontUpperId] = createNode(m, upperLeg, middleBackUpperId, middleFrontMiddleId);
            break;
        case middleFrontMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleFrontMiddleId], 1, 0, 0));
            figure[middleFrontMiddleId] = createNode(m, middleLeg, null, middleFrontLowerId);
            break;
        case middleFrontLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleFrontLowerId], 1, 0, 0));
            figure[middleFrontLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Back Leg Cases
        case middleBackUpperId:
            m = translate(0.0, 0.0, -0.5 * torsoWidth + upperLegWidth / 2);
            m = mult(m, rotate(theta[middleBackUpperId], 1, 0, 0));
            figure[middleBackUpperId] = createNode(m, upperLeg, middleLeftUpperId, middleBackMiddleId);
            break;
        case middleBackMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleBackMiddleId], 1, 0, 0));
            figure[middleBackMiddleId] = createNode(m, middleLeg, null, middleBackLowerId);
            break;
        case middleBackLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleBackLowerId], 1, 0, 0));
            figure[middleBackLowerId] = createNode(m, lowerLeg, null, null);
            break;
        
        // Middle Left Leg Cases
        case middleLeftUpperId:
            m = translate(-(torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.0);
            m = mult(m, rotate(theta[middleLeftUpperId], 0, 0, 1));
            figure[middleLeftUpperId] = createNode(m, upperLeg, middleRightUpperId, middleLeftMiddleId);
            break;
        case middleLeftMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleLeftMiddleId], 0, 0, 1));
            figure[middleLeftMiddleId] = createNode(m, middleLeg, null, middleLeftLowerId);
            break;
        case middleLeftLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleLeftLowerId], 0, 0, 1));
            figure[middleLeftLowerId] = createNode(m, lowerLeg, null, null);
            break;

        // Middle Right Leg Cases
        case middleRightUpperId:
            m = translate((torsoWidth / 2 - upperLegWidth / 2), 0.0, 0.0);
            m = mult(m, rotate(theta[middleRightUpperId], 0, 0, 1));
            figure[middleRightUpperId] = createNode(m, upperLeg, null, middleRightMiddleId);
            break;
        case middleRightMiddleId:
            m = translate(0.0, upperLegHeight, 0);
            m = mult(m, rotate(theta[middleRightMiddleId], 0, 0, 1));
            figure[middleRightMiddleId] = createNode(m, middleLeg, null, middleRightLowerId);
            break;
        case middleRightLowerId:
            m = translate(0.0, middleLegHeight, 0.0);
            m = mult(m, rotate(theta[middleRightLowerId], 0, 0, 1));
            figure[middleRightLowerId] = createNode(m, lowerLeg, null, null);
            break;
    }

}

function traverse(Id) {

    if (Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function lowerHead() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

// Make one function which takes params to create below functions belows are too much duplicated
function createBodyPart(height, width) {
    return function () {
        instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * height, 0.0));
        instanceMatrix = mult(instanceMatrix, scale4(width, height, width));
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
        for (let i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    }
}


function lowerLowerHead() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerHeadHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerHeadWidth, lowerHeadHeight, lowerHeadWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
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


function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function trackballView(x, y) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0] * v[0] + v[1] * v[1];
    if (d < 1.0)
        v[2] = Math.sqrt(1.0 - d);
    else {
        v[2] = 0.0;
        a = 1.0 / Math.sqrt(d);
        v[0] *= a;
        v[1] *= a;
    }
    return v;
}


function mouseMotion(x, y) {
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if (trackingMouse) {
        dx = curPos[0] - lastPos[0];
        dy = curPos[1] - lastPos[1];
        dz = curPos[2] - lastPos[2];

        if (dx || dy || dz) {
            angle = -0.1 * Math.sqrt(dx * dx + dy * dy + dz * dz);


            axis[0] = lastPos[1] * curPos[2] - lastPos[2] * curPos[1];
            axis[1] = lastPos[2] * curPos[0] - lastPos[0] * curPos[2];
            axis[2] = lastPos[0] * curPos[1] - lastPos[1] * curPos[0];

            lastPos[0] = curPos[0];
            lastPos[1] = curPos[1];
            lastPos[2] = curPos[2];
        }
    }
    render();
}

function startMotion(x, y) {
    trackingMouse = true;
    startX = x;
    startY = y;
    curx = x;
    cury = y;

    lastPos = trackballView(x, y);
    trackballMove = true;
}

function stopMotion(x, y) {
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
        angle = 0.0;
        trackballMove = false;
    }
}

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    
    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
    modelViewMatrix = mat4();

    upperLeg = createBodyPart(upperLegHeight, upperLegWidth);
    middleLeg = createBodyPart(middleLegHeight, middleLegWidth);
    lowerLeg = createBodyPart(lowerLegHeight, lowerLegWidth);


    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLocation = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);

    const sliderIds = ["torsoId", "cornerFrontLeftUpperLegId", "cornerFrontLeftMiddleLegId",
        "cornerFrontLeftLowerLegId", "cornerFrontRightUpperLegId", "cornerFrontRightMiddleLegId",
        "cornerFrontRightLowerLegId", "cornerBackLeftUpperLegId", "cornerBackLeftMiddleLegId",
        "cornerBackLeftLowerLegId", "cornerBackRightUpperLegId", "cornerBackRightMiddleLegId",
        "cornerBackRightLowerLegId", "middleFrontUpperLegId", "middleFrontMiddleLegId",
        "middleFrontLowerLegId", "middleBackUpperLegId", "middleBackMiddleLegId",
        "middleBackLowerLegId", "middleLeftUpperLegId", "middleLeftMiddleLegId",
        "middleLeftLowerLegId", "middleRightUpperLegId", "middleRightMiddleLegId",
        "middleRightLowerLegId"]

    const sliderVariables = {
        "torsoId": torsoId,
        "cornerFrontLeftUpperLegId": cornerFrontLeftUpperId,
        "cornerFrontLeftMiddleLegId": cornerFrontLeftMiddleId,
        "cornerFrontLeftLowerLegId": cornerFrontLeftLowerId,
        "cornerFrontRightUpperLegId": cornerFrontRightUpperId,
        "cornerFrontRightMiddleLegId": cornerFrontRightMiddleId,
        "cornerFrontRightLowerLegId": cornerFrontRightLowerId,
        "cornerBackLeftUpperLegId": cornerBackLeftUpperId,
        "cornerBackLeftMiddleLegId": cornerBackLeftMiddleId,
        "cornerBackLeftLowerLegId": cornerBackLeftLowerId,
        "cornerBackRightUpperLegId": cornerBackRightUpperId,
        "cornerBackRightMiddleLegId": cornerBackRightMiddleId,
        "cornerBackRightLowerLegId": cornerBackRightLowerId,
        "middleFrontUpperLegId": middleFrontUpperId,
        "middleFrontMiddleLegId": middleFrontMiddleId,
        "middleFrontLowerLegId": middleFrontLowerId,
        "middleBackUpperLegId": middleBackUpperId,
        "middleBackMiddleLegId": middleBackMiddleId,
        "middleBackLowerLegId": middleBackLowerId,
        "middleLeftUpperLegId": middleLeftUpperId,
        "middleLeftMiddleLegId": middleLeftMiddleId,
        "middleLeftLowerLegId": middleLeftLowerId,
        "middleRightUpperLegId": middleRightUpperId,
        "middleRightMiddleLegId": middleRightMiddleId,
        "middleRightLowerLegId": middleRightLowerId
    }

    const sliderOptions = {
        "torsoId": {
            notReversed: true
        },
        "cornerFrontLeftUpperLegId": {
            offsetAngle: -180
        },
        "cornerFrontRightUpperLegId": {
            offsetAngle: -180
        },
        "middleFrontUpperLegId": {
            offsetAngle: -180
        },
        "cornerBackLeftUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "cornerBackLeftMiddleLegId": {
            notReversed: true,
        },
        "cornerBackLeftLowerLegId": {
            notReversed: true,
        },
        "cornerBackRightUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "cornerBackRightMiddleLegId": {
            notReversed: true,
        },
        "cornerBackRightLowerLegId": {
            notReversed: true,
        },
        "middleBackUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "middleBackMiddleLegId": {
            notReversed: true,
        },
        "middleBackLowerLegId": {
            notReversed: true,
        },

        "middleLeftUpperLegId": {
            offsetAngle: -180
        },
        "middleRightUpperLegId": {
            notReversed: true,
            offsetAngle: -180
        },
        "middleRightMiddleLegId": {
            notReversed: true,
        },
        "middleRightLowerLegId": {
            notReversed: true,
        },
    }

    sliderIds.forEach(id => {
        document.getElementById(id).onchange = function () {
            let value = parseInt(event.srcElement.value);
            if (sliderOptions[id] && sliderOptions[id].offsetAngle) {
                // convert to int
                value = value + sliderOptions[id].offsetAngle;
            }
            if (sliderOptions[id] && sliderOptions[id].notReversed) {
                value = -value;
            }
            value = -value;
            console.log(sliderVariables[id], value)
            theta[sliderVariables[id]] = value;
            initNodes(sliderVariables[id]);
        }
    });

    for (i = 0; i < numNodes; i++) initNodes(i);


    rotationMatrix = mat4();
    rotationMatrixLoc = gl.getUniformLocation(program, "r");
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));

    /*
    canvas.addEventListener("mousedown", function (event) {
        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        startMotion(x, y);
    });

    canvas.addEventListener("mouseup", function (event) {
        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        stopMotion(x, y);
    });

    
    canvas.addEventListener("mousemove", function (event) {

        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        mouseMotion(x, y);
    });
    */

    render();
}


var render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (trackballMove) {
        axis = normalize(axis);
        rotationMatrix = mult(rotationMatrix, rotate(angle, axis));
        gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
    }

    traverse(torsoId);
    requestAnimFrame(render);
}
