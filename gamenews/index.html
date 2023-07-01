const cardsContainer = document.getElementById("cards-container");

async function fetchDataFromRapidAPI() {
  const url =
    "https://videogames-news2.p.rapidapi.com/videogames_news/search_news?query=GTA";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f97024702bmshb016fffd40e7facp1da35ajsnb56b28aa0bdd",
      "X-RapidAPI-Host": "videogames-news2.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    displayNewsCards(data); // Call the function to display news cards with the fetched data
  } catch (error) {
    console.error(error);
  }
}

function displayNewsCards(newsData) {
  // Clear the existing cards in the container
  cardsContainer.innerHTML = "";

  // Loop through the news data and create a card for each news item
  newsData.forEach((newsItem) => {
    // Clone the template for each news item
    const template = document.getElementById("template-news-card");
    const card = template.content.cloneNode(true);

    // Update the content of the card with the news data
    const cardImage = card.querySelector("#news-img");
    const cardTitle = card.querySelector("#news-title");
    const cardSource = card.querySelector("#news-source");
    const cardDesc = card.querySelector("#news-desc");

    // Redirect news
    card.firstElementChild.addEventListener("click", () => {
      window.open(linkUrl, "_blank"); // Open the link in a new tab when the card is clicked
    });

    // Set the image URL from the API response
    const imageUrl = newsItem.image || "https://via.placeholder.com/400x200"; // Use fallback image if image URL is not provided

    // Set the link URL from the API response
    const linkUrl = newsItem.link || "#"; // Use a placeholder link if link URL is not provided

    cardImage.src = imageUrl;
    cardTitle.textContent = newsItem.title;
    cardSource.textContent = newsItem.date;
    cardDesc.textContent = newsItem.description;

    // Set the link for the entire card
    card.addEventListener("click", () => {
      window.open(linkUrl, "_blank"); // Open the link in a new tab when the card is clicked
    });

    // Append the card to the cards container
    cardsContainer.appendChild(card);
  });
}

// Call the function to fetch data from Rapid API and display news cards when the page loads.
fetchDataFromRapidAPI();
