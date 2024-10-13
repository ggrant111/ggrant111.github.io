// Function to fetch current games from the local now.json file
async function fetchCurrentGames() {
    try {
        const response = await fetch('./now.json'); // Fetching the local JSON file
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('Data fetched:', data);  // Log the fetched data

        // Find the games for the focused date (2024-10-13)
        const focusedDate = '2024-10-13';
        const gamesForDate = data.gamesByDate.find(dateObj => dateObj.date === focusedDate);
        
        if (gamesForDate && gamesForDate.games && gamesForDate.games.length > 0) {
            displayCurrentGames(gamesForDate.games);  // Pass the list of games to the display function
        } else {
            console.error('No games found for the date:', focusedDate);
            document.querySelector('.games-list').innerHTML = '<p>No games available for the selected date.</p>';
        }
    } catch (error) {
        console.error('Error fetching current games:', error);
        document.querySelector('.games-list').innerHTML = '<p>Error loading current games.</p>';
    }
}

// Function to dynamically display the current games
function displayCurrentGames(games) {
    const gamesList = document.querySelector('.games-list');
    gamesList.innerHTML = ''; // Clear previous content

    if (games.length > 0) {
        games.forEach(game => {
            console.log('Processing game:', game);  // Log each game

            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            // Fetch the team details
            const awayTeam = game.awayTeam;
            const homeTeam = game.homeTeam;

            // Prepend ESPN to the Game Center link
            const gameCenterLink = `https://www.nhl.com${game.gameCenterLink}`;

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
                  `;

            // Inject the content into the game card
            gameCard.innerHTML = matchupHTML;

            // Append the game card to the games list
            gamesList.appendChild(gameCard);
        });
    } else {
        console.error('No games to display.');
        gamesList.innerHTML = '<p>No games available at the moment.</p>';
    }
}

// Function to fetch and display the top 5 goalies dynamically
async function fetchTopGoalies() {
    try {
        const response = await fetch('./topGoalies.json'); // Replace with your API URL
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayTopGoalies(data.wins);  // Pass the list of goalies to the display function
    } catch (error) {
        console.error('Error fetching top goalies:', error);
        document.querySelector('.goalie-leader-grid').innerHTML = '<p>Error loading goalie data.</p>';
    }
}

// Function to dynamically display the top goalies
function displayTopGoalies(goalies) {
    const goalieGrid = document.querySelector('.goalie-leader-grid');
    goalieGrid.innerHTML = ''; // Clear previous content

    goalies.forEach(goalie => {
        const goalieTile = document.createElement('div');
        goalieTile.classList.add('goalie-tile');
        
        // Set the team logo as the background image
        goalieTile.style.backgroundImage = `url(${goalie.teamLogo})`;

        // Headshot and player info structure
        const headshotContainer = document.createElement('div');
        headshotContainer.classList.add('headshot-container');
        headshotContainer.innerHTML = `<img src="${goalie.headshot}" alt="${goalie.firstName.default} ${goalie.lastName.default}">`;
        
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');
        playerInfo.innerHTML = `
            <div class="player-name">
                <div class="first-name">${goalie.firstName.default}</div>  <!-- Accessing the 'default' property of firstName -->
                <div class="last-name">${goalie.lastName.default}</div>    <!-- Accessing the 'default' property of lastName -->
            </div>
            <div class="player-position">#${goalie.sweaterNumber} • ${goalie.position}</div>
        `;

        const playerWins = document.createElement('div');
        playerWins.classList.add('player-wins');
        playerWins.textContent = goalie.value;

        // Append elements
        goalieTile.appendChild(headshotContainer);
        goalieTile.appendChild(playerInfo);
        goalieTile.appendChild(playerWins);

        goalieGrid.appendChild(goalieTile);
    });
}


// Function to fetch top skaters
async function fetchTopSkaters() {
    try {
        const response = await fetch('./topSkaters.json'); // Replace with your API URL
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        displayTopSkaters(data.goals);  // Pass the list of skaters to the display function
    } catch (error) {
        console.error('Error fetching top skaters:', error);
        document.querySelector('.skater-leader-grid').innerHTML = '<p>Error loading skater data.</p>';
    }
}

// Function to dynamically display the top skaters
function displayTopSkaters(skaters) {
    const skaterGrid = document.querySelector('.skater-leader-grid');
    skaterGrid.innerHTML = ''; // Clear previous content

    skaters.forEach(skater => {
        const skaterTile = document.createElement('div');
        skaterTile.classList.add('skater-tile');
        
        // Set the team logo as the background image
        skaterTile.style.backgroundImage = `url(${skater.teamLogo})`;

        // Headshot and player info structure
        const headshotContainer = document.createElement('div');
        headshotContainer.classList.add('headshot-container');
        headshotContainer.innerHTML = `<img src="${skater.headshot}" alt="${skater.firstName} ${skater.lastName}">`;

        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');
        playerInfo.innerHTML = `
            <div class="player-name">
                <div class="first-name">${skater.firstName.default}</div>
                <div class="last-name">${skater.lastName.default}</div>
            </div>
            <div class="player-position">#${skater.sweaterNumber} • ${skater.position}</div>
        `;

        const playerGoals = document.createElement('div');
        playerGoals.classList.add('player-goals');
        playerGoals.textContent = skater.value;

        // Append elements
        skaterTile.appendChild(headshotContainer);
        skaterTile.appendChild(playerInfo);
        skaterTile.appendChild(playerGoals);

        skaterGrid.appendChild(skaterTile);
    });
}

// Function to fetch and display the top 5 teams dynamically
async function fetchAndDisplayTeams() {
    try {
        const response = await fetch('./standings.json'); // Fetching the standings data from the JSON file
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        
        const teams = data.standings;

        // Clear previous content
        const easternConferenceGrid = document.querySelector('#eastern-conference .team-grid');
        const westernConferenceGrid = document.querySelector('#western-conference .team-grid');
        easternConferenceGrid.innerHTML = '';
        westernConferenceGrid.innerHTML = '';

        // Filter and limit to top 5 teams for Eastern and Western conferences
        const easternTeams = teams.filter(team => team.conferenceName === 'Eastern').slice(0, 5);
        const westernTeams = teams.filter(team => team.conferenceName === 'Western').slice(0, 5);

        // Helper function to create team tile
        function createTeamTile(team) {
            const teamTile = document.createElement('div');
            teamTile.classList.add('team-tile'); // Add class for styling

            // Set team logo as background image
            teamTile.style.backgroundImage = `url(${team.teamLogo})`;

            teamTile.innerHTML = `
                <div class="team-info">
                    <div class="team-name">
                        <p>${team.teamName.default}</p>
                    </div>
                    <div class="team-stats">
                        <p>GP: ${team.gamesPlayed}</p>
                        <p>W: ${team.wins}</p>
                        <p>Pts: ${team.points}</p>
                    </div>
                </div>
            `;
            return teamTile;
        }

        // Add top 5 Eastern teams
        easternTeams.forEach(team => {
            const teamTile = createTeamTile(team);
            easternConferenceGrid.appendChild(teamTile);
        });

        // Add top 5 Western teams
        westernTeams.forEach(team => {
            const teamTile = createTeamTile(team);
            westernConferenceGrid.appendChild(teamTile);
        });

    } catch (error) {
        console.error('Error fetching teams:', error);
        document.querySelector('.team-grid').innerHTML = '<p>Error loading team data.</p>';
    }
}



// Call the function when the page loads
window.onload = () => {
    fetchCurrentGames();
    fetchTopGoalies();
    fetchTopSkaters();
    fetchAndDisplayTeams();  // Fetch and display teams
};