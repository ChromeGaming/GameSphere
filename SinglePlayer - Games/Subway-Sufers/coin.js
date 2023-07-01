class Coin {

	init(gl, pos){

				this.pos = pos;
        this.rotation = 0
        this.texture = loadTexture(gl, './textures/coin.jpg');

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.positions = [
          // Front face
          -0.1, -0.1,  0.1,
           0.1, -0.1,  0.1,
           0.1,  0.1,  0.1,
          -0.1,  0.1,  0.1,

          // Back face
          -0.1, -0.1, -0.1,
          -0.1,  0.1, -0.1,
           0.1,  0.1, -0.1,
           0.1, -0.1, -0.1,

          // Top face
          -0.1,  0.1, -0.1,
          -0.1,  0.1,  0.1,
           0.1,  0.1,  0.1,
           0.1,  0.1, -0.1,

          // Bottom face
          -0.1, -0.1, -0.1,
           0.1, -0.1, -0.1,
           0.1, -0.1,  0.1,
          -0.1, -0.1,  0.1,

          // Right face
           0.1, -0.1, -0.1,
           0.1,  0.1, -0.1,
           0.1,  0.1,  0.1,
           0.1, -0.1,  0.1,

          // Left face
          -0.1, -0.1, -0.1,
          -0.1, -0.1,  0.1,
          -0.1,  0.1,  0.1,
          -0.1,  0.1, -0.1,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
/////////////////////////////

				this.normalBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

				this.vertexNormals = [
					// Front
					0.0,  0.0,  1.0,
					0.0,  0.0,  1.0,
					0.0,  0.0,  1.0,
					0.0,  0.0,  1.0,

					// Back
					0.0,  0.0, -1.0,
					0.0,  0.0, -1.0,
					0.0,  0.0, -1.0,
					0.0,  0.0, -1.0,

					// Top
					0.0,  1.0,  0.0,
					0.0,  1.0,  0.0,
					0.0,  1.0,  0.0,
					0.0,  1.0,  0.0,

					// Bottom
					0.0, -1.0,  0.0,
					0.0, -1.0,  0.0,
					0.0, -1.0,  0.0,
					0.0, -1.0,  0.0,

					// Right
					1.0,  0.0,  0.0,
					1.0,  0.0,  0.0,
					1.0,  0.0,  0.0,
					1.0,  0.0,  0.0,

					// Left
					-1.0,  0.0,  0.0,
					-1.0,  0.0,  0.0,
					-1.0,  0.0,  0.0,
					-1.0,  0.0,  0.0
				];

				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals),
				gl.STATIC_DRAW);

/////////////////////////////
	      this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

        this.textureCoordinates = [
          // Front
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Back
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Top
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Bottom
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Right
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Left
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                      gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.indices = [
          0,  1,  2,      0,  2,  3,    // front
          4,  5,  6,      4,  6,  7,    // back
          8,  9,  10,     8,  10, 11,   // top
          12, 13, 14,     12, 14, 15,   // bottom
          16, 17, 18,     16, 18, 19,   // right
          20, 21, 22,     20, 22, 23,   // left
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

	draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){


    var modelMatrix = mat4.create();
    // this.pos[2]+=0.1;
    mat4.translate(modelMatrix,modelMatrix,this.pos);

    this.rotation += Math.PI / (((Math.random()) % 100) + 50)

	  mat4.rotate(modelMatrix, modelMatrix, this.rotation, [0,0,1]);

    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

	{
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
          }

          {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
          }

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

          gl.useProgram(programInfo.program);

          gl.uniformMatrix4fv(
              programInfo.uniformLocations.projectionMatrix,
              false,
              projectionMatrix);
          gl.uniformMatrix4fv(
              programInfo.uniformLocations.modelViewMatrix,
              false,
              modelViewMatrix);

          gl.activeTexture(gl.TEXTURE0);

          gl.bindTexture(gl.TEXTURE_2D, this.texture);

          gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

          {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }

		return gl;
    }
}
