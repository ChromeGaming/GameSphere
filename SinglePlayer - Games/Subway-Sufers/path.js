class Path {

    init(gl, pos) {

        this.pos = pos;
        this.rotation = 0;
        this.texture = loadTexture(gl, './textures/tracks.jpg');

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [

          -3.9,-2.0,5.0,//0
           -1.3,-2.0,5.0,//1
          -3.9,-2.0,-20.0,//2
           -1.3,-2.0,-20.0,//3

         -1.3,-2.0,5.0,//4
          1.3,-2.0,5.0,//5
         -1.3,-2.0,-20.0,//6
          1.3,-2.0,-20.0,//7

          1.3,-2.0,5.0,
           3.9,-2.0,5.0,
          1.3,-2.0,-20.0,
           3.9,-2.0,-20.0,

        ];
        const length_rep = 5;

        var extended = this.positions
        for(var i=1;i<length_rep;i++){
          this.positions = this.positions.concat(extended.map(function(item,key){
            if((key+1)%3==0){
              return item-25*i;
            }
            else{
              return item;
            }
          }));
        }



    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

            this.vertexNormals = [

              // Top
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              // Top
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              // Top
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,
              0.0,  1.0,  0.0,


            ];

          extended = this.vertexNormals
          for(i=1;i<length_rep;i++){
            this.vertexNormals = this.vertexNormals.concat(extended);
          }


          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals),
          gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.
        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

        this.textureCoordinates = [
          0.0,  1.0,
          1.0,  1.0,
          0.0,  0.0,
          1.0,  0.0,

          0.0,  1.0,
          1.0,  1.0,
          0.0,  0.0,
          1.0,  0.0,

          0.0,  1.0,
          1.0,  1.0,
          0.0,  0.0,
          1.0,  0.0,


        ];

        extended = this.textureCoordinates
        for(i=1;i<length_rep;i++){
          this.textureCoordinates = this.textureCoordinates.concat(extended);
        }


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                      gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.indices = [
            0, 1, 2,    1, 2, 3, // front
            4, 5, 6,    5, 6, 7,
            8, 9, 10,   9, 10, 11,
        ];


        extended = this.indices;
        for(i=1;i<=length_rep;++i){
           this.indices = this.indices.concat(extended.map(function(item){
             return item + 12*i;
           }));
        }
        console.log(this.indices);

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), gl.STATIC_DRAW);

    }

  draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){

      // this.pos[2]+=0.1;
      var modelMatrix = mat4.create();

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
              const vertexCount = 18*5;
              const type = gl.UNSIGNED_SHORT;
              const offset = 0;
              gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }

  		return gl;
      }
  }


  class Walls {

      init(gl, pos) {

          this.pos = pos;
          this.rotation = 0;
          this.texture = loadTexture(gl, './textures/wall.jpg');

          this.positionBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

          this.positions = [
             //lface
             -3.9,-2.0,5.0,
             -3.9,-2.0,-20.0,
             -3.9,3,-20.0,
             -3.9,3,5.0,
//rface
             3.9,-2.0,5.0,
             3.9,-2.0,-20.0,
             3.9,3,-20.0,
             3.9,3,5.0,
//ltop
             -3.9,3.0,5.0,
             -3.9,3.0,-20.0,
             -10,3.0,-20.0,
             -10,3.0,5.0,
//rtop
             3.9,3.0,5.0,
             3.9,3.0,-20.0,
             10,3.0,-20.0,
             10,3.0,5.0,
//lfronts
             -3.9,-2.0,5.0,
             -10,-2.0,5.0,
             -10,3.0,5.0,
             -3.9,3.0,5.0,
//rfront
             3.9,-2.0,5.0,
             10,-2.0,5.0,
             10,3.0,5.0,
             3.9,3.0,5.0,

             -3.9,-2.0,-20.0,
             -3.9,-2.0,-25.0,
             -10,-2.0,-25.0,
             -10,-2.0,-20.0,

             3.9,-2.0,-20.0,
             3.9,-2.0,-25.0,
             10,-2.0,-25.0,
             10,-2.0,-20.0


          ];
          const length_rep = 4;

          var extended = this.positions
          for(var i=1;i<length_rep;i++){
            var random = Math.random()
            this.positions = this.positions.concat(extended.map(function(item,key){
              if((key+1)%3==0 ){
                return item-30*i;
              }
              else if((key+2)%3==0 && key<72){
                 return item - random*3;
              }
              else{
                return item;
              }
            }));
          }



          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
////////////////////////////

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

        this.vertexNormals = [
          // Right
          1.0,  0.0,  0.0,
          1.0,  0.0,  0.0,
          1.0,  0.0,  0.0,
          1.0,  0.0,  0.0,
          // Left
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          -1.0,  0.0,  0.0,
          // Top
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          // Top
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
        	// Front
        	0.0,  0.0,  1.0,
        	0.0,  0.0,  1.0,
        	0.0,  0.0,  1.0,
        	0.0,  0.0,  1.0,
        	// Front
        	0.0,  0.0,  1.0,
        	0.0,  0.0,  1.0,
        	0.0,  0.0,  1.0,
        	0.0,  0.0,  1.0,
          // Top
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          // Top
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0,
          0.0,  1.0,  0.0

        ];

          extended = this.vertexNormals
          for(i=1;i<length_rep;i++){
            this.vertexNormals = this.vertexNormals.concat(extended);
          }


      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals),
      gl.STATIC_DRAW);


          // Build the element array buffer; this specifies the indices
          // into the vertex arrays for each face's vertices.
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

            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,

            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,

            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,

            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,

            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,

            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,

          ];

          extended = this.textureCoordinates
          for(i=1;i<length_rep;i++){
            this.textureCoordinates = this.textureCoordinates.concat(extended);
          }

          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                        gl.STATIC_DRAW);

          this.indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

          // This array defines each face as two triangles, using the
          // indices into the vertex array to specify each triangle's
          // position.

          this.indices = [
              0, 1, 2,    0, 2, 3, // front
              4, 5, 6,    4, 6, 7,
              8, 9, 10,   8, 10, 11,
              12, 13,14,  12, 14, 15,
              16, 17,18,  16, 18,19,
              20, 21,22,  20, 22,23,
              24, 25,26,  24, 26,27,
              28, 29, 30, 28, 30,31
          ];

          extended = this.indices;
          for(i=1;i<=length_rep;++i){
             this.indices = this.indices.concat(extended.map(function(item){
               return item + 32*i;
             }));
          }

          // Now send the element array to GL

          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
              new Uint16Array(this.indices), gl.STATIC_DRAW);

      }

    draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){

        this.pos[2]+=0.1;
        var modelMatrix = mat4.create();

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
                const vertexCount = 48*4;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
              }

    		return gl;
        }
    }
    class Back {

        init(gl, pos) {

            this.pos = pos;
            this.rotation = 0;
            this.texture = loadTexture(gl, './textures/back.jpg');

            this.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

            this.positions = [

              -90.0,-48,-100.0,//0
               90.0,-48,-100.0,//1
              -90.0,48 ,-100.0,//2
               90.0,48 ,-100.0,//3

            ];

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

            // Build the element array buffer; this specifies the indices
            // into the vertex arrays for each face's vertices.
            this.textureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

            this.textureCoordinates = [
              0.0,  1.0,
              1.0,  1.0,
              0.0,  0.0,
              1.0,  0.0,
            ];

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                          gl.STATIC_DRAW);

            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            this.indices = [
                0, 1, 2,    1, 2, 3, // front
            ];

            // Now send the element array to GL

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(this.indices), gl.STATIC_DRAW);

        }

      draw(gl, deltaTime, projectionMatrix, viewMatrix, programInfo){


          var modelMatrix = mat4.create();

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
