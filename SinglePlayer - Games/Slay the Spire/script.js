document.addEventListener('DOMContentLoaded', () => {
    const playerHealthElement = document.getElementById('playerHealth');
    const enemyHealthElement = document.getElementById('enemyHealth');
    const playerDeckElement = document.getElementById('playerDeck');
    const drawCardButton = document.getElementById('drawCardButton');

    let playerHealth = 50;
    let enemyHealth = 30;

    const cards = [
        { name: 'Attack', damage: 10 },
        { name: 'Heal', heal: 10 }
    ];

    function updateHealth() {
        playerHealthElement.textContent = `Health: ${playerHealth}`;
        enemyHealthElement.textContent = `Health: ${enemyHealth}`;
    }

    function drawCard() {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = randomCard.name;
        cardElement.addEventListener('click', () => playCard(randomCard, cardElement));
        playerDeckElement.appendChild(cardElement);
    }

    function playCard(card, cardElement) {
        if (card.damage) {
            enemyHealth -= card.damage;
        } else if (card.heal) {
            playerHealth += card.heal;
        }
        updateHealth();
        cardElement.remove();
    }

    drawCardButton.addEventListener('click', drawCard);
    updateHealth();
});
