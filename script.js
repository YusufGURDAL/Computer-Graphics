var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('glcanvas');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	// verteksler
	var triangleVertices = 
	[ // X, Y,       R, G, B
		0.0, 0.4,    1.0, 1.0, 0.0,
		0.0, 0.0,  	 1.0, 0.0, 0.0,
		0.04, 0.0,   0.0, 0.0, 1.0,

        0.0, 0.4,    1.0, 1.0, 0.0,
        0.04, 0.4,   0.0, 1.0, 0.0,
        0.04, 0.0,   0.0, 0.0, 1.0,
	];
	var transformed = [...triangleVertices];
	// verilen vertekslerden şekli çizdirme fonksiyonu
    function draw(vertices){
		var triangleVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
		var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
		gl.vertexAttribPointer(
			positionAttribLocation, // Attribute location
			2, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
		);
		gl.vertexAttribPointer(
			colorAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			gl.FALSE,
			5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
		);
		gl.enableVertexAttribArray(positionAttribLocation);
		gl.enableVertexAttribArray(colorAttribLocation);
		gl.useProgram(program);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		transformed = [...triangleVertices];
	}
	// öteleme fonksiyonu
	function translation(dx,dy){
		for(x = 0, y = 1; x <= 25 && y <= 26; x += 5, y += 5){
			pointX = transformed[x];
			pointY = transformed[y];
			array1 = [1, 0, dx,
					  0, 1, dy,
					  0, 0, 1];
			
			array2 = [pointX, pointY, 1];
			newArray = [0,0,0];
			for(i = 0; i < 9; i++){
				for(j = 0; j < 3; j++){
					newArray[i] = array1[3*i+j] * array2[j] + newArray[i];
				}
			}
			transformed[x] = newArray[0];
			transformed[y] = newArray[1];
		}
	}
	// döndürme fonksiyonu
	function rotation(angle){
		radians = angle * Math.PI/180;
		c = Math.cos(radians);
		s = Math.sin(radians);
		for(x = 0, y = 1; x <= 25 && y <= 26; x += 5, y += 5){
			pointX = transformed[x];
			pointY = transformed[y];
			array1 = [c, -s, 0,
					  s, c, 0,
					  0, 0, 1];
			
			array2 = [pointX, pointY, 1];
			newArray = [0,0,0];
			for(i = 0; i < 9; i++){
				for(j = 0; j < 3; j++){
					newArray[i] = array1[3*i+j] * array2[j] + newArray[i];
				}
			}
			transformed[x] = newArray[0];
			transformed[y] = newArray[1];
		}
	}
	// ölçeklendirme fonksiyonu
	function scale(sX,sY){
		for(x = 0, y = 1; x <= 25 && y <= 26; x += 5, y += 5){
			pointX = transformed[x];
			pointY = transformed[y];
			array1 = [sX, 0, 0,
					  0, sY, 0,
					  0, 0, 1];
			
			array2 = [pointX, pointY, 1];
			newArray = [0,0,0];
			for(i = 0; i < 9; i++){
				for(j = 0; j < 3; j++){
					newArray[i] = array1[3*i+j] * array2[j] + newArray[i];
				}
			}
			transformed[x] = newArray[0];
			transformed[y] = newArray[1];
		}
	}
	// eğme fonksiyonu
	function shear(shX,shY){
		for(x = 0, y = 1; x <= 25 && y <= 26; x += 5, y += 5){
			pointX = transformed[x];
			pointY = transformed[y];
			array1 = [1, shX, 0,
					  shY, 1, 0,
					  0, 0, 1];
			
			array2 = [pointX, pointY, 1];
			newArray = [0,0,0];
			for(i = 0; i < 9; i++){
				for(j = 0; j < 3; j++){
					newArray[i] = array1[3*i+j] * array2[j] + newArray[i];
				}
			}
			transformed[x] = newArray[0];
			transformed[y] = newArray[1];
		}
	}
	// Y harfi
	shear(0.3,0);
	scale(1,0.3);
	rotation(90);
	translation(-0.48,0.28)
	draw(transformed);
	shear(-0.3,0);
	scale(1,0.3);
	rotation(270);
	translation(-0.44,0.32)
	draw(transformed);
	rotation(180);
	scale(1,0.7);
	translation(-0.44,0.32);
	draw(transformed);
	// U harfi
	translation(-0.12,0.04);
	draw(transformed);
	rotation(180);
	translation(-0.24,0.44);
	draw(transformed);
	scale(1,0.3);
	rotation(90);
	translation(-0.12,0.04);
	draw(transformed);
	// S harfi
	shear(-0.3,0);
	scale(1,0.4);
	rotation(270);
	translation(-0.04,0.32);
	draw(transformed);
	shear(-0.3,0);
	scale(1,0.4);
	rotation(270);
	translation(-0.04,0.08);
	draw(transformed);
	shear(-0.3,0.75*10/2.75);
	rotation(180);
	scale(1,0.275);
	translation(0,0.31);
	draw(transformed);
	// U harfi
	translation(0.16,0.04);
	draw(transformed);
	rotation(180);
	translation(0.36,0.44);
	draw(transformed);
	scale(1,0.3);
	rotation(270);
	translation(0.2,0.08);
	draw(transformed);
	// F harfi
	translation(0.4,0.04);
	draw(transformed);
	scale(1,0.4);
	rotation(90);
	translation(0.6,0.4);
	draw(transformed);
	scale(1,0.2);
	rotation(90);
	translation(0.52,0.24);
	draw(transformed);
};