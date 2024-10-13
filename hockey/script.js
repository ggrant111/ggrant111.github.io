// Function to fetch current games from the NHL API
async function fetchCurrentGames() {
    try {
        const response = await fetch('https://api-web.nhle.com/v1/score/now');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayCurrentGames(data.games);  // Pass the list of games to the display function
    } catch (error) {
        console.error('Error fetching current games:', error);
        document.querySelector('.games-list').innerHTML = '<p>Error loading current games.</p>';
    }
}

// Function to dynamically display the current games
function displayCurrentGames(games) {
    const gamesList = document.querySelector('.games-list');
    gamesList.innerHTML = ''; // Clear previous content

    if (games && games.length > 0) {
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            // Fetch the team details
            const awayTeam = game.awayTeam;
            const homeTeam = game.homeTeam;

            // Display the matchup with logos, records, and game status
            const matchupHTML = `
                <div class="team-container">
                    <div class="team">
                        <img src="${awayTeam.logo}" alt="${awayTeam.name.default} Logo">
                        <p>${awayTeam.name.default} (${awayTeam.record})</p>
                    </div>
                    <span>VS</span>
                    <div class="team">
                        <img src="${homeTeam.logo}" alt="${homeTeam.name.default} Logo">
                        <p>${homeTeam.name.default} (${homeTeam.record})</p>
                    </div>
                </div>
                <p>Venue: ${game.venue.default}</p>
                <p>Start Time (UTC): ${new Date(game.startTimeUTC).toLocaleTimeString()}</p>
                <a href="${game.gameCenterLink}" target="_blank">Game Center</a>
                <a href="${game.ticketsLink}" target="_blank">Get Tickets</a>
            `;

            // Inject the content into the game card
            gameCard.innerHTML = matchupHTML;

            // Append the game card to the games list
            gamesList.appendChild(gameCard);
        });
    } else {
        gamesList.innerHTML = '<p>No games available at the moment.</p>';
    }
}

// Call the function when the page loads
window.onload = () => {
    fetchCurrentGames();
};
