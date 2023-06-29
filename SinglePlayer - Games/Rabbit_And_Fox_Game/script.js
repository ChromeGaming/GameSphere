var gameOver = 0, points = 0, rabbitSound = document.getElementById("rabbit"), foxSound = document.getElementById("fox"), loses=0;
			function rabbit() {
				rabbitSound.autoplay = true;
				rabbitSound.load();
				points++;
				document.getElementById("points").innerHTML = `Points: <span>${points}</span>`;
			}
			function fox() {
				foxSound.autoplay = true;
				foxSound.load();
				gameOver = 1;
				document.getElementById("gameOverContainer").style.display = 'block';
				document.getElementById("pointer").innerHTML = `Your total points ${points}`;

				
			}

		var deviceHeight = window.innerHeight;
			
		document.getElementById("theGame").style.height = `${(deviceHeight-50)}px`;
		function startGame() {
			var pickingArray = ["rabbit", "rabbit", "rabbit", "rabbit", "rabbit", "rabbit", "fox", "rabbit", "rabbit", "rabbit", "rabbit"], pickingLength = pickingArray.length;
			var positionArray = [15, 40, 65], PositionLength = positionArray.length;
			var randomPicker , randomPosition, timeSpeed, speedUp = 0;
			let i=1 , container = document.getElementById("theGame");
			function randomly() {
				randomPicker = Math.floor(Math.random() * pickingLength);
				randomPosition = Math.floor(Math.random() * PositionLength);
				
				if(pickingArray[randomPicker] === "rabbit") {
					container.innerHTML += `<img src="https://i.ibb.co/8jgthLK/rabbit.jpg" id="noclick" ontouchstart="rabbit(); this.src='https://i.ibb.co/6XRCLCb/rabbit2.jpg'; this.id= 'clicked';" alt="${pickingArray[randomPicker]}" style="left:${positionArray[randomPosition]}%;" />`;	
					
					}
				else {
					container.innerHTML += `<img src="https://i.ibb.co/L9YQqjF/fox.png" id="fox" ontouchstart="fox();" alt="${pickingArray[randomPicker]}" style="left:${positionArray[randomPosition]}%; " />`;
					
					
				}
				if (i < 15) {
					timeSpeed = 1000;
				}

				else if (i < 30) {
					timeSpeed = 900;
				}
				else if (i < 100) {
					timeSpeed = 700;
					speedUp = 1;	
				}
				else {
					timeSpeed = 600;
				}
				
				
				if(gameOver == 0) {
					setTimeout(randomly, timeSpeed);
					i++;
				}
			
				
			}

		randomly();

		let  pos;
		function animated() {
				
				let frameId = setInterval(ChangePos, 1);
				function ChangePos() {
				    let element = document.getElementsByTagName("img");
					let length = element.length;
					if(gameOver === 1) {
						clearInterval(frameId);
					}
					for(let i=0; i < element.length; i++) {
						pos = element[i].style.top;
						pos = pos.replace("px", "");
						pos =  Number(pos);

						if(window.navigator.appVersion.match(/iphone/i)) {
							if(speedUp === 1) {
								element[i].style.top = `${pos+14}px`;
							}
							else {
								element[i].style.top = `${pos+8}px`;
							}
						}
						else {
							if(speedUp === 1) {
								element[i].style.top = `${pos+2}px`;
							}
							else {
								element[i].style.top = `${pos+1}px`;
							}
						}
						
						
						if(pos > deviceHeight+50) {
							
							if (loses >= 3) {
								gameOver = 1;
								document.getElementById("gameOverContainer").style.display = 'block';
								document.getElementById("pointer").innerHTML = `Your total points ${points}`;
								foxSound.autoplay = true;
								foxSound.load();
							}

							if (element[i].id !== "clicked" && element[i].id !== "fox")
								{
							
								loses++;
								document.getElementById("loses").innerHTML = `Loses <span>${loses}/3</span>`;
								
							}

							document.getElementById("theGame").removeChild(element[i]);
							
						}
					
							
				    }
				}
							
				
				
			}
			animated();
			
				
		}