# WebGL Kullanarak İsim Yazdırma Programı

## Giriş
Bu rapor, WebGL kullanarak ismimi yazdıran bir JavaScript programını açıklamaktadır. Program, WebGL'in temel işlevselliğini kullanarak ekranda grafiksel olarak "YUSUF" ismini oluşturur ve bu işlemde çeşitli dönüşüm fonksiyonları (öteleme, döndürme, ölçeklendirme, eğme) kullanır. Kodun amacı, WebGL'in temel prensiplerini göstermek ve basit bir grafiksel uygulama geliştirmektir.

## Programın Yapısı
Program, temel olarak dört ana bölümden oluşmaktadır:
1. **Vertex ve Fragment Shader'ların Tanımlanması**
2. **WebGL Ortamının Başlatılması ve Shader'ların Derlenmesi**
3. **Verteks Verilerinin Oluşturulması ve Bağlanması**
4. **İsim Oluşturma ve Çizdirme İşlemleri**

### 1. Vertex ve Fragment Shader'ların Tanımlanması
Shader'lar, WebGL'de grafikleri çizmek için kullanılan küçük programlardır. Vertex shader, verteks pozisyonlarını ve renkleri alarak fragment shader'a aktarır. Fragment shader ise her pikselin rengini belirler.
```javascript
var vertexShaderText = [
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

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '  gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');
```
### 2. WebGL Ortamının Başlatılması ve Shader'ların Derlenmesi
Bu bölümde, WebGL bağlamı başlatılır ve shader'lar derlenir.
```javascript
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
```
### 3. Verteks Verilerinin Oluşturulması ve Bağlanması
Verteks verileri, çizilecek şekilleri tanımlayan nokta ve renk bilgilerinden oluşur. Ayrıca vertekslerin klonunu oluşturarak orijinal şekli bozmadan dönüşümleri klonlara uygulayabiliriz. 
```javascript
var triangleVertices = [
    // X, Y,       R, G, B
    0.0, 0.4,    1.0, 1.0, 0.0,
    0.0, 0.0,    1.0, 0.0, 0.0,
    0.04, 0.0,   0.0, 0.0, 1.0,
    // Diğer verteksler burada devam eder
];
var transformed = [...triangleVertices]; // Üzerinde dönüşüm yapılan orijinal şeklin bozulmasını önlemek için orijinal verteksleri klonlayıp işlemleri orada uygularız

function draw(vertices) {
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
    transformed = [...triangleVertices]; // Dönüşümler uygulandıktan sonra yeni şekilllere dönüşümlerin uygulanabilmesi için verteksler orijinale döndürülür. 
}
```
### 4. İsim Oluşturma ve Çizdirme İşlemleri
İsim oluşturma işlemi, çeşitli dönüşüm fonksiyonlarının (öteleme, döndürme, ölçeklendirme, eğme) kullanılmasıyla gerçekleştirilir. Harflerin istenilen şekilde dönüştürülmesi için gerekli matris çarpımları yapılır.
```javascript
function translation(dx, dy) {
    // Öteleme işlemi burada yapılır
}

function rotation(angle) {
    // Döndürme işlemi burada yapılır
}

function scale(sX, sY) {
    // Ölçeklendirme işlemi burada yapılır
}

function shear(shX, shY) {
    // Eğme işlemi burada yapılır
}

// Harflerin parçalarının oluşturulması
shear(0.3, 0);
scale(1, 0.3);
rotation(90);
translation(-0.48, 0.28);
draw(transformed); // Dönüştürme işlemleri uygulanmış şekillerin çizdirildiği yer
// Diğer harflerin çizdirilmesi işlemleri burada devam eder
```
### Sonuç
Bu program, WebGL kullanarak basit bir şekilde isim yazdırma işlemini gerçekleştirir. Shader programları, verteks verileri ve dönüşüm fonksiyonları kullanılarak, ekranda isim oluşturulur ve çizdirilir. Bu tür uygulamalar, WebGL'in temel grafik işleme yeteneklerini anlamak ve geliştirmek için iyi bir başlangıç sağlar.
