class Surfer {

	init(gl, pos){

				this.pos = pos;
				this.max_jump = 0.7
        this.rotation = 0
				this.jumping = 0
				this.jump = 0.07;
				this.base = -1.5;
				this.flying = 0;
        this.texture = loadTexture(gl, './textures/surfer.jpg');

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.positions = [
          // Front face
          -0.25, -0.45,  0,
           0.25, -0.45,  0,
           0.25,  0.45,  0,
          -0.25,  0.45,  0,

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

/////////////////////////////
	      this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

        this.textureCoordinates = [

					1.0,  1.0,
					0.0,  1.0,
          0.0,  0.0,
          1.0,  0.0,

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                      gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.indices = [
          0,  1,  2,      0,  2,  3,    // front
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

	draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){

     if(this.flying==0){
			 if(this.jumping == 1){
					this.pos[1] += this.jump;
					if(this.pos[1]>=(this.max_jump+this.base)){
						this.jumping = -1;
					}
				}
				else if(this.jumping == -1){
					this.pos[1] -=this.jump;
					if(this.pos[1]<=this.base){
						this.pos[1]=this.base;
						this.jumping=0;
					}
				}
		}
   if(this.flying==1){
     this.pos[1]=0.5;
		 this.jumping = -1;
	 }




    var modelMatrix = mat4.create();
    // this.pos[2]+=0.1;
    mat4.translate(modelMatrix,modelMatrix,this.pos);

    // this.rotation += Math.PI / (((Math.random()) % 100) + 50)

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
            const vertexCount = 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }

		return gl;
    }
}


class Police {

	init(gl, pos){

				this.pos = pos;
				this.max_jump = 0.7
        this.rotation = 0
				this.jumping = 0
				this.jump = 0.07;
				this.base = -1.5;
        this.texture = loadTexture(gl, './textures/police.jpg');

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.positions = [
          // Front face
          -0.2, -0.4,  0,
           0.2, -0.4,  0,
           0.2,  0.4,  0,
          -0.2,  0.4,  0,

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

/////////////////////////////
	      this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

        this.textureCoordinates = [

					1.0,  1.0,
					0.0,  1.0,
          0.0,  0.0,
          1.0,  0.0,

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                      gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.indices = [
          0,  1,  2,      0,  2,  3,    // front
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

	draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){

		 if(this.jumping == 1){
				this.pos[1] += this.jump;
				if(this.pos[1]>=(this.max_jump+this.base)){
					this.jumping = -1;
				}
			}
			else if(this.jumping == -1){
				this.pos[1] -=this.jump;
				if(this.pos[1]<=this.base){
					this.pos[1]=this.base;
					this.jumping=0;
				}
			}




    var modelMatrix = mat4.create();
    // this.pos[2]+=0.1;
    mat4.translate(modelMatrix,modelMatrix,this.pos);

    // this.rotation += Math.PI / (((Math.random()) % 100) + 50)

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
            const vertexCount = 6;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
          }

		return gl;
    }
}
