class Train {

	init(gl, pos){

				this.pos = pos;
        this.rotation = 0
        this.texture = loadTexture(gl, './textures/train.jpg');

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.positions = [
					// Front face
          -0.8, -0.7,  3.0,
           0.8, -0.7,  3.0,
           0.8,  0.7,  3.0,
          -0.8,  0.7,  3.0,

          // Back face
          -0.8, -0.7, -3.0,
          -0.8,  0.7, -3.0,
           0.8,  0.7, -3.0,
           0.8, -0.7, -3.0,

          // Top face
          -0.8,  0.7, -3.0,
          -0.8,  0.7,  3.0,
           0.8,  0.7,  3.0,
           0.8,  0.7, -3.0,

          // Bottom face
          -0.8, -0.7, -3.0,
           0.8, -0.7, -3.0,
           0.8, -0.7,  3.0,
          -0.8, -0.7,  3.0,

          // Right face
           0.8, -0.7, -3.0,
           0.8,  0.7, -3.0,
           0.8,  0.7,  3.0,
           0.8, -0.7,  3.0,

          // Left face
          -0.8, -0.7, -3.0,
					-0.8,  0.7, -3.0,
          -0.8,  0.7,  3.0,
					-0.8, -0.7,  3.0,

        ];
				const length_rep = 3;

				var extended = this.positions
				for(var i=1;i<length_rep;i++){
					var random = Math.random()
					this.positions = this.positions.concat(extended.map(function(item,key){
						if((key+1)%3==0 ){
							return item-6*i;
						}
						else{
							return item;
						}
					}));
				}

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
///////////////////////////////

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

			extended = this.vertexNormals
			for(i=1;i<length_rep;i++){
				this.vertexNormals = this.vertexNormals.concat(extended);
			}

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals),
			gl.STATIC_DRAW);

/////////////////////////////
	      this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

        this.textureCoordinates = [
//front
					0.0,  1.0,
					0.33,  1.0,
					0.33,  0.0,
          0.0,  0.0,
//back
					0.0,  1.0,
					0.33,  1.0,
					0.33,  0.0,
          0.0,  0.0,
//top bottom

					0.33,  1.0,
					1.0,  1.0,
					1.0,  0.67,
          0.33,  0.67,

					0.33,  1.0,
					1.0,  1.0,
					1.0,  0.67,
          0.33,  0.67,


// left right
					1.0,  1.0,
					1.0,  0.0,
					0.33,  0.0,
					0.33,  1.0,

					1.0,  1.0,
					1.0,  0.0,
					0.33,  0.0,
					0.33,  1.0,

        ];

				extended = this.textureCoordinates
				for(i=1;i<length_rep;i++){
					this.textureCoordinates = this.textureCoordinates.concat(extended);
				}

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                      gl.STATIC_DRAW);
///////////////////////////////////////////
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

				extended = this.indices;
				for(i=1;i<=length_rep;++i){
					 this.indices = this.indices.concat(extended.map(function(item){
						 return item + 24*i;
					 }));
				}
				// console.log(this.indices);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

	draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){


    var modelMatrix = mat4.create();
    // this.pos[2]+=0.15;
    mat4.translate(modelMatrix,modelMatrix,this.pos);

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
					// Tell WebGL how to pull out the normals from
					// the normal buffer into the vertexNormal attribute.
					{
						const numComponents = 3;
						const type = gl.FLOAT;
						const normalize = false;
						const stride = 0;
						const offset = 0;
						gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
						gl.vertexAttribPointer(
								programInfo.attribLocations.vertexNormal,
								numComponents,
								type,
								normalize,
								stride,
								offset);
						gl.enableVertexAttribArray(
								programInfo.attribLocations.vertexNormal);
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


							const normalMatrix = mat4.create();
							mat4.invert(normalMatrix, modelViewMatrix);
							mat4.transpose(normalMatrix, normalMatrix);



          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

          gl.useProgram(programInfo.program);

             gl.uniformMatrix4fv(
              programInfo.uniformLocations.projectionMatrix,
              false,
              projectionMatrix);

							gl.uniformMatrix4fv(
				      programInfo.uniformLocations.normalMatrix,
				      false,
				      normalMatrix);

					    gl.uniformMatrix4fv(
              programInfo.uniformLocations.modelViewMatrix,
              false,
              modelViewMatrix);

          gl.activeTexture(gl.TEXTURE0);

          gl.bindTexture(gl.TEXTURE_2D, this.texture);

          gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

          {
            const vertexCount = 36*3;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }

		return gl;
    }
}
