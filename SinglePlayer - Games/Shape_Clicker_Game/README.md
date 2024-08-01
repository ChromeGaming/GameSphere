# Shape Clicker Game

## Overview

The Shape Clicker Game is a simple and fun web-based game where players click on randomly appearing shapes to score points. The game runs for a fixed duration, and the player's objective is to click on as many shapes as possible within the time limit.

## Features

- Start the game by clicking the "Start Game" button.
- Randomly appearing shapes (circles or squares) within the game container.
- Each click on a shape increases the player's score.
- The game lasts for 30 seconds.
- The player's score is displayed and updated in real-time.
- At the end of the game, an alert displays the player's final score.

## Technologies Used

- HTML for structuring the webpage.
- CSS for styling the game elements.
- JavaScript for game logic and interactivity.

## How to Play

1. Open the game in a web browser.
2. Click the "Start Game" button to begin.
3. Click on the shapes that appear in the game container as quickly as possible to increase your score.
4. The game will automatically end after 30 seconds, and your final score will be displayed.

## Setup Instructions

1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser to start the game.

## File Structure

- `index.html`: The main HTML file that contains the structure of the game.
- `styles.css`: The CSS file for styling the game elements.
- `script.js`: The JavaScript file containing the game logic.

## Customization

You can customize the game by modifying the following:

- The duration of the game by changing the `setTimeout` value in the `endGame` function.
- The interval at which shapes appear by adjusting the `setInterval` value in the `startGame` function.
- The size, color, and types of shapes by modifying the `createShape` and `getRandomColor` functions.

## License

This project is open-source and available under the MIT License. Feel free to fork, modify, and use it in your own projects.

Enjoy playing the Shape Clicker Game!