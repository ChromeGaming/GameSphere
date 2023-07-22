$(document).ready(function() {
	var bakcgroundImageArray = ["slide-7.jpg", 
	"slide-12.jpg", "slide-15.jpg"];
	var bakcgroundImageIndex = 0;
	function changeBackground() {
		if (bakcgroundImageIndex >= bakcgroundImageArray.length) {
			bakcgroundImageIndex = 0;
		}
		$('#body').css("background-image", "url(assets/images/" + bakcgroundImageArray[bakcgroundImageIndex] + ")");
		bakcgroundImageIndex++;
	}
	setInterval(changeBackground, 10000);

	var characters = [];
	var playerCharacterId = -1;
	var enemyCharacterId = -1;

	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Iron Man",
		"Image": "Iron_Man.png",});
	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Ant Man",
		"Image": "Ant_Man.png"});
	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Black Panther",
		"Image": "Black_Panther.png"});
	characters.push({"Health Points": 0,
		"Base Attack Power": 0,
		"Attack Power": 0, 
		"Counter Attack Power": 0,
		"Name": "Captain America",
		"Image": "Captain_America.png"});

	$.each(characters, function (index, character){
		generateCharacterAttributeValues(character) ;
		$("#characters").append(generateCharacterHtml(index, character));
	});

	// generate the html content for each of the characters on the webpage
	function generateCharacterHtml(index, character) {
		/*
		<div class="character col-md-2" id="0">
			<button type="button" class="btn btn-default m-3 p-2">
	    		<p>Iron Man</p>
	    		<img src="assets/images/Iron_Man.png" class="character-image">
	    		<p>141</p>
		    </button>
		</div>
		*/
		var div = $("<div>");
		if (index !== 0) {
			div.attr("class", "character col-md-2 offset-md-1");
		} else {
			div.attr("class", "character col-md-2");
		}
		div.attr("id", index);
		var buttonContainer = $("<button>");
		buttonContainer.attr("type", "button");
		buttonContainer.attr("class", "btn btn-default m-3 p-2");
		var name = $("<p>");
		name.text(character["Name"]);
		var image = $("<img>");
		image.attr("src", "assets/images/" + character["Image"]);
		image.attr("class", "character-image");
		var healthPoints = $("<p>");
		healthPoints.text(character["Health Points"]);
		buttonContainer.append(name).append(image).append(healthPoints);
		div.append(buttonContainer);
		return div;
	}

	// generate the attribute values for each of the characters
	function generateCharacterAttributeValues(character) {
		character["Health Points"] = Math.floor(Math.random() * 200) + 75;
		character["Base Attack Power"] = Math.floor(Math.random() * 15) + 5;
		character["Attack Power"] = character["Base Attack Power"];
		character["Counter Attack Power"] = Math.floor(Math.random() * 30) + 10;
	}

	// generate the html content for the characters selected for the gameplay
	function generateSelectedCharacterHtml(parentHtmlId, characterHtml) {
		$(parentHtmlId).html(characterHtml);
	}

	function updateHtmlText(htmlElement, value) {
		$(htmlElement).text(value);
	}

	function gameFeedback(feedback) {
		if (feedback) {
			$("#game-feedback").append("<br>" + feedback);
		} else {
			$("#game-feedback").text("");
		}
	}

	function restartGame() {
		updateHtmlText($("#attack-button"), "Restart Game");
		$("#attack-button").on("click", function(){
			location.reload();
		});
	}

	$("#attack-button").on("click", function(){
		if (playerCharacterId !== -1 && enemyCharacterId !== -1) {
			var playerCharacter = characters[playerCharacterId];
			var enemyCharacter = characters[enemyCharacterId];
			// the player character attacks first
			var playerOnEnemyDamage = playerCharacter["Attack Power"];
			enemyCharacter["Health Points"] -=  playerOnEnemyDamage;
			playerCharacter["Attack Power"] +=playerCharacter["Base Attack Power"];
			updateHtmlText($("#enemy-character button").children().last(), enemyCharacter["Health Points"]);
			gameFeedback();
			gameFeedback("<h5>You attacked " + enemyCharacter["Name"] + " for " + playerOnEnemyDamage + " damage.</h5>");

			// if the enemy is out of health points, the enemy is defeated
			if (enemyCharacter["Health Points"] <= 0) {
				enemyCharacterId = -1;
				// check if there is anymore character left in the #characters div for the player to fight
				if ($("#characters").text().length !== 0){
					generateSelectedCharacterHtml("#enemy-character", "ENEMY CHARACTER");
					gameFeedback("You defeated " + enemyCharacter["Name"] + "! Pick another enemy to fight.");
				} else {
					gameFeedback("You Won! Please press the \"Restart Game\" button to play again.");
					restartGame();
				}
			}

			// if the enemy character is still alive (i.e., has >0 health points),
			// the enemy character counter attacks
			if (enemyCharacterId !== -1) {
				playerCharacter["Health Points"] -=  enemyCharacter["Counter Attack Power"];
				updateHtmlText($("#player-character button").children().last(), playerCharacter["Health Points"]);
				gameFeedback(enemyCharacter["Name"] + " attacked " + "you back for " + enemyCharacter["Counter Attack Power"] + " damage.");
			}

			// if the player is out of health points, he is defeated and will have to restart the game
			if (playerCharacter["Health Points"] <= 0) {
				gameFeedback("Game Over! Please press the \"Restart Game\" button to play again.");
				restartGame();
			}
		}
	});

	$(".character").on("click", function(){
		if ($("#player-character").text().length === "YOUR CHARACTER".length) {
			generateSelectedCharacterHtml("#player-character", $(this).html());
			playerCharacterId = $(this).attr("id");
			generateSelectedCharacterHtml($("#" + playerCharacterId), "");
		} else if ( $("#player-character").text().length !== "YOUR CHARACTER".length && $("#enemy-character").text().length === "ENEMY CHARACTER".length ) {
			generateSelectedCharacterHtml("#enemy-character", $(this).html());
			enemyCharacterId = $(this).attr("id");
			generateSelectedCharacterHtml($("#" + enemyCharacterId), "");
			gameFeedback();
		} else if ($("#enemy-character").text().length === 0) {
			generateSelectedCharacterHtml("#enemy-character", "ENEMY CHARACTER");
		}

	});

});

