document.addEventListener('DOMContentLoaded', () => {
  // Close modals when the close button is clicked
  const closeButtons = document.querySelectorAll('.close');
  
  closeButtons.forEach(closeButton => {
    closeButton.onclick = function () {
      const modal = closeButton.closest('.modal');
      modal.style.display = 'none';
    };
  });

  // Close modal when clicking outside the modal content
  window.onclick = function (event) {
    const playerModal = document.getElementById('playerModal');
    const gameModal = document.getElementById('gameModal');
    if (event.target === playerModal) {
      playerModal.style.display = 'none';
    } else if (event.target === gameModal) {
      gameModal.style.display = 'none';
    }
  };
});

const teamAbbreviation = "UTA";

async function fetchRoster() {
  try {
    // Use backticks (`) to enable string interpolation for dynamic teamAbbreviation
    const response = await fetch(`https://api-web.nhle.com/v1/roster/${teamAbbreviation}/20242025`);
    const data = await response.json();

    // Display forwards, defensemen, and goalies in the same container
    displayPlayers([...data.forwards, ...data.defensemen, ...data.goalies]);
  } catch (error) {
    console.error("Error fetching roster data:", error);
  }
}


function displayPlayers(players) {
  const playerContainer = document.getElementById('players-container');
  
  // Clear existing content
  playerContainer.innerHTML = '';

  // Loop through each player in the roster and create their card
  players.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';

    // Add the player ID as a data attribute
    playerDiv.setAttribute('data-player-id', player.id);

    // Safely handle undefined values using optional chaining (?.)
    const firstName = player.firstName?.default || player.firstName || 'Unknown';
    const lastName = player.lastName?.default || player.lastName || 'Unknown';

    // Add headshot
    const playerHeadshot = document.createElement('img');
    playerHeadshot.src = player.headshot;
    playerHeadshot.alt = `${firstName} ${lastName} headshot`;
    playerHeadshot.className = 'headshot';

    // Add name and position
    const playerName = document.createElement('h3');
    playerName.textContent = `${firstName} ${lastName} (#${player.sweaterNumber}, ${player.positionCode})`;

    // Add basic stats
    const playerStats = document.createElement('p');
    playerStats.innerHTML = `
      
    `;

    playerDiv.appendChild(playerHeadshot);
    playerDiv.appendChild(playerName);
    playerDiv.appendChild(playerStats);

    playerContainer.appendChild(playerDiv);
  });

  // Add event listener for player clicks
  playerContainer.addEventListener('click', event => {
    const playerTile = event.target.closest('.player');
    if (playerTile) {
      const playerId = playerTile.getAttribute('data-player-id');
      if (playerId) {
        openModal(playerId);
      }
    }
  });
}

// Function to open modal with detailed player or goalie stats by playerId
// Function to open modal with detailed player or goalie stats by playerId
async function openModal(playerId) {
  const modal = document.getElementById('playerModal');
  const modalContent = document.getElementById('modal-player-details');

  // Fetch player details using playerId from the endpoint
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
    const player = await response.json();

    console.log(player); // Debug to check player data

    // Clear previous content
    modalContent.innerHTML = '';

    // Set modal background to the player's hero image
    modal.style.backgroundImage = `url(${player.heroImage || ''})`;
    modal.style.backgroundSize = 'cover';
    modal.style.backgroundPosition = 'center';
    modal.style.color = 'white'; // Make text white for better visibility

    // Safely access player data using optional chaining and fallback values
    const firstName = player.firstName?.default || player.firstName || 'Unknown';
    const lastName = player.lastName?.default || player.lastName || 'Unknown';
    const teamName = player.teamCommonName?.default || 'Unknown Team';
    const birthCity = player.birthCity?.default || 'Unknown City';
    const birthState = player.birthStateProvince?.default || '';
    const birthCountry = player.birthCountry || 'Unknown Country';
    const careerStats = player.careerTotals?.regularSeason || {};
    const seasonStats = player.featuredStats?.regularSeason?.subSeason || {};

    // Check if the player is a goalie (position 'G')
    const isGoalie = player.position === 'G';

    // Add tab buttons to toggle between career and season stats
    const playerDetailHTML = `
      <div class="trading-card">
        <h2>${firstName} ${lastName}</h2>
        <img src="${player.headshot}" alt="${firstName} ${lastName} headshot" class="headshot">
        <p>Position: ${player.position}</p>
        <p>Team: ${teamName}</p>
        <p>Height: ${player.heightInInches} inches (${player.heightInCentimeters} cm)</p>
        <p>Weight: ${player.weightInPounds} lbs (${player.weightInKilograms} kg)</p>
        <p>Birthdate: ${player.birthDate}</p>
        <p>Birthplace: ${birthCity}, ${birthState} ${birthCountry}</p>

        <!-- Tabs for Career and Current Season -->
        <div class="tab">
          <button class="tablinks active" onclick="openStats(event, 'CareerStats')">Career Stats</button>
          <button class="tablinks" onclick="openStats(event, 'SeasonStats')">Current Season</button>
        </div>

        <!-- Career Stats as tiles -->
        <div id="CareerStats" class="tabcontent active">
          <div class="stat-tile-container">
            ${isGoalie ? getGoalieStats(careerStats) : getSkaterStats(careerStats)}
          </div>
        </div>

        <!-- Current Season Stats as tiles -->
        <div id="SeasonStats" class="tabcontent">
          <div class="stat-tile-container">
            ${isGoalie ? getGoalieStats(seasonStats) : getSkaterStats(seasonStats)}
          </div>
        </div>
      </div>
    `;

    modalContent.innerHTML = playerDetailHTML;

    // Display the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks the "X" or outside the modal
    const span = document.getElementsByClassName('close')[0];
    span.onclick = function () {
      modal.style.display = 'none';
      modal.style.backgroundImage = ''; // Reset the background
    };
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        modal.style.backgroundImage = ''; // Reset the background
      }
    };
  } catch (error) {
    console.error("Error fetching player details:", error);
  }
}


// Function to toggle between career and season stats
function openStats(evt, statsType) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  document.getElementById(statsType).style.display = 'block';
  evt.currentTarget.className += ' active';
}

// Helper function to display skater stats
// Helper function to display skater stats
function getSkaterStats(stats) {
  return `
    <div class="stat-tile">
      <p class="stat-abbr">GP</p>
      <hr>
      <p class="stat-number">${stats.gamesPlayed || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">G</p>
      <hr>
      <p class="stat-number">${stats.goals || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">A</p>
      <hr>
      <p class="stat-number">${stats.assists || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">P</p>
      <hr>
      <p class="stat-number">${stats.points || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">+/-</p>
      <hr>
      <p class="stat-number">${stats.plusMinus || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">PIM</p>
      <hr>
      <p class="stat-number">${stats.pim || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">S%</p>
      <hr>
      <p class="stat-number">${(stats.shootingPctg * 100 || 0).toFixed(2)}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">PPG</p>
      <hr>
      <p class="stat-number">${stats.powerPlayGoals || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">PPP</p>
      <hr>
      <p class="stat-number">${stats.powerPlayPoints || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">SHG</p>
      <hr>
      <p class="stat-number">${stats.shorthandedGoals || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">SHP</p>
      <hr>
      <p class="stat-number">${stats.shorthandedPoints || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">FO%</p>
      <hr>
      <p class="stat-number">${(stats.faceoffWinningPctg * 100 || 0).toFixed(2)}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">TOI</p>
      <hr>
      <p class="stat-number">${stats.avgToi || '0:00'}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">GWG</p>
      <hr>
      <p class="stat-number">${stats.gameWinningGoals || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">S</p>
      <hr>
      <p class="stat-number">${stats.shots || 0}</p>
    </div>
  `;
}


// Helper function to display goalie stats
// Helper function to display goalie stats
function getGoalieStats(stats) {
  return `
    <div class="stat-tile">
      <p class="stat-abbr">GP</p>
      <hr>
      <p class="stat-number">${stats.gamesPlayed || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">GS</p>
      <hr>
      <p class="stat-number">${stats.gamesStarted || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">W</p>
      <hr>
      <p class="stat-number">${stats.wins || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">L</p>
      <hr>
      <p class="stat-number">${stats.losses || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">OTL</p>
      <hr>
      <p class="stat-number">${stats.otLosses || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">GA</p>
      <hr>
      <p class="stat-number">${stats.goalsAgainst || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">GAA</p>
      <hr>
      <p class="stat-number">${stats.goalsAgainstAvg.toFixed(2) || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">SA</p>
      <hr>
      <p class="stat-number">${stats.shotsAgainst || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">SV%</p>
      <hr>
      <p class="stat-number">${(stats.savePctg * 100 || 0).toFixed(2)}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">SO</p>
      <hr>
      <p class="stat-number">${stats.shutouts || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">TOI</p>
      <hr>
      <p class="stat-number">${stats.timeOnIce || '0:00'}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">A</p>
      <hr>
      <p class="stat-number">${stats.assists || 0}</p>
    </div>
    <div class="stat-tile">
      <p class="stat-abbr">PIM</p>
      <hr>
      <p class="stat-number">${stats.pim || 0}</p>
    </div>
  `;
}


async function fetchSchedule() {
  try {
    // Use backticks (`) for string interpolation
    const response = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${teamAbbreviation}/20242025`);
    const data = await response.json();
    displaySchedule(data.games);
  } catch (error) {
    console.error("Error fetching schedule data:", error);
  }
}


function displaySchedule(games) {
  const scheduleContainer = document.getElementById('schedule-container');
  scheduleContainer.innerHTML = ''; // Clear existing content

  games.forEach(game => {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.setAttribute('data-game-id', game.id);

    const homeTeam = game.homeTeam.placeName?.default || 'Unknown Home Team';
    const awayTeam = game.awayTeam.placeName?.default || 'Unknown Away Team';
    const gameDate = new Date(game.gameDate).toLocaleDateString('en-US', { timeZone: 'UTC' });

    const startTime = new Date(game.startTimeUTC).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    gameDiv.innerHTML = `
      <img src="${game.awayTeam.logo}" alt="${awayTeam} logo" class="team-logo">
      <h2>${game.awayTeam.score !== undefined ? game.awayTeam.score : ""}</h2>
      <p>${awayTeam} vs ${homeTeam}</p>
      <h2>${game.homeTeam.score !== undefined ? game.homeTeam.score : ""}</h2>
      <img src="${game.homeTeam.logo}" alt="${homeTeam} logo" class="team-logo">
      <p>${gameDate}</p>
      <p>${startTime}</p>
    `;

    scheduleContainer.appendChild(gameDiv);
  });

  scheduleContainer.addEventListener('click', event => {
    const gameTile = event.target.closest('.game');
    if (gameTile) {
      const gameId = gameTile.getAttribute('data-game-id');
      if (gameId) {
        openGameModal(gameId);
      }
    }
  });
}

async function openGameModal(gameId) {
  const modal = document.getElementById('gameModal');
  const modalContent = document.getElementById('modal-game-details');

  try {
    const response = await fetch(`https://api-web.nhle.com/v1/wsc/game-story/${gameId}`);
    const game = await response.json();

    // Clear previous content
    modalContent.innerHTML = '';

    const homeTeam = game.homeTeam.placeName?.default || 'Unknown Home Team';
    const awayTeam = game.awayTeam.placeName?.default || 'Unknown Away Team';
    const gameDate = new Date(game.gameDate).toLocaleDateString();
    const startTime = new Date(game.startTimeUTC).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const venue = game.venue?.default || 'Unknown Venue';
    const broadcasts = game.tvBroadcasts?.map(b => b.network).join(', ') || 'No Broadcast';
    const score = `${game.awayTeam.score || ''} - ${game.homeTeam.score || ''}`;
    
    // Display the team logos
    const homeLogo = game.homeTeam.logo;
    const awayLogo = game.awayTeam.logo;

    // Game links
    const threeMinRecapLink = game?.threeMinRecap ? `https://nhl.com${game.threeMinRecap}` : null;
    const condensedGameLink = game?.condensedGame ? `https://nhl.com${game.condensedGame}` : null;
    const gameCenterLink = game?.gameCenterLink ? `https://nhl.com${game.gameCenterLink}` : null;

    const recapLinksHTML = `
      <h3>Game Links</h3>
      <div class="game-links">
        ${threeMinRecapLink ? `<a href="${threeMinRecapLink}" target="_blank">3-Minute Recap</a>` : ''}
        ${condensedGameLink ? `<a href="${condensedGameLink}" target="_blank">Condensed Game</a>` : ''}
        ${gameCenterLink ? `<a href="${gameCenterLink}" target="_blank">Game Center</a>` : ''}
      </div>
    `;

    // Friendly names mapping
    const statNamesMap = {
      sog: 'SOG',
      faceoffWinningPctg: 'Faceoff %',
      powerPlay: 'Power Play',
      powerPlayPctg: 'Power Play %',
      pim: 'PIM',
      hits: 'Hits',
      blockedShots: 'Blocked Shots',
      giveaways: 'Giveaways',
      takeaways: 'Takeaways'
    };

    // Log teamGameStats to check its structure
    console.log('teamGameStats:', game.teamGameStats);

    // Generate the team stats section if available
    const teamStatsHTML = Array.isArray(game.summary.teamGameStats)
      ? game.summary.teamGameStats.map(stat => `
        <div class="stat-tile">
          <p class="stat-abbr">${statNamesMap[stat.category] || stat.category?.toUpperCase()}</p>
          <hr>
          <p class="stat-number">${stat.awayValue ?? 'N/A'} - ${stat.homeValue ?? 'N/A'}</p>
        </div>
      `).join('')
      : '<p>No team stats available.</p>';

    // Generate scoring information
    const scoringHTML = game.summary?.scoring?.map(period => `
      <div class="period-scoring">
        <h4>Period ${period.periodDescriptor.number}</h4>
        ${period.goals.map(goal => `
          <div class="goal">
            <img src="${goal.headshot}" alt="${goal.name.default} headshot" class="goal-headshot">
            <p><strong>${goal.name.default}</strong> (${goal.teamAbbrev.default}) - ${goal.timeInPeriod}</p>
            <p>Shot Type: ${goal.shotType}, Strength: ${goal.strength}</p>
            <p>Assisted by: ${goal.assists?.map(a => `${a.firstName.default} ${a.lastName.default}`).join(', ') || 'Unassisted'}</p>
          </div>
        `).join('')}
      </div>
    `).join('') || '<p>No scoring information available for this game.</p>';

    modalContent.innerHTML = `
      <div class="game-details">
        <div class="team-info">
          <img src="${awayLogo}" alt="${awayTeam} logo" class="team-logo">
          <div>
          <h2>${game.awayTeam.score} - ${awayTeam} vs ${homeTeam} - ${game.homeTeam.score}</h2>

          </div>
          <img src="${homeLogo}" alt="${homeTeam} logo" class="team-logo">
        </div>
        <div id="gameInfo">
        <p>Date: ${gameDate}</p>
        <p>Time: ${startTime}</p>
        <p>Venue: ${venue}</p>
        <p>Score: ${score}</p>
        <p>Broadcast: ${broadcasts}</p>
</div>
        ${recapLinksHTML}

        <h3>Team Stats (Away Team - left side / Home Team - right side)</h3>
        <div class="team-stats">
          ${teamStatsHTML}
        </div>

        <h3>Scoring Summary</h3>
        <div class="scoring-summary">
          ${scoringHTML}
        </div>
      </div>
    `;

    // Display the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks the "X" or outside the modal
    const span = document.getElementsByClassName('close')[0];
    span.onclick = function () {
      modal.style.display = 'none';
    };
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
  }
}




async function fetchTeamStats() {
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/club-stats/${teamAbbreviation}/20242025/2`);
    const data = await response.json();

    // Separate skaters and goalies
    displaySkaters(data.skaters);
    displayGoalies(data.goalies);
  } catch (error) {
    console.error("Error fetching team stats:", error);
  }
}

function displaySkaters(skaters) {
  const statsContainer = document.getElementById('stats-container');
  statsContainer.innerHTML = '<h3>Skater Stats</h3>'; // Clear previous content

  skaters.forEach(skater => {
    // Safely handle undefined teamAbbreviation by using a fallback value ('UNKNOWN')
    // const teamAbbreviation = (skater.teamAbbreviation || 'UNKNOWN').toUpperCase();
    
    // Construct the headshot URL with the uppercase team abbreviation
    const headshotUrl = `https://assets.nhle.com/mugs/nhl/20242025/${teamAbbreviation}/${skater.playerId}.png`;

    console.log(headshotUrl); // Log the headshot URL to the console

    const playerName = `${skater.firstName.default} ${skater.lastName.default}`;
    
    const skaterDiv = document.createElement('div');
    skaterDiv.classList.add('player-stat');

    skaterDiv.innerHTML = `
      <img src="${headshotUrl}" alt="${playerName}" class="player-headshot">
      <h4>${playerName} (${skater.positionCode})</h4>
      <p>GP: ${skater.gamesPlayed}</p>
      <p>G: ${skater.goals}</p>
      <p>A: ${skater.assists}</p>
      <p>P: ${skater.points}</p>
      <p>+/-: ${skater.plusMinus}</p>
      <p>PIM: ${skater.penaltyMinutes}</p>
      <p>S: ${skater.shots}</p>
      <p>SP: ${(skater.shootingPctg * 100 || 0).toFixed(2)}%</p>
      <p>Avg TOI: ${formatTimeOnIce(skater.avgTimeOnIcePerGame)}</p>
    `;

    statsContainer.appendChild(skaterDiv);
  });
}



function displayGoalies(goalies) {
  const statsContainer = document.getElementById('stats-container');
  
  // Add a separate section for goalies
  const goalieTitle = document.createElement('h3');
  goalieTitle.textContent = 'Goalie Stats';
  statsContainer.appendChild(goalieTitle);

  goalies.forEach(goalie => {
    const playerName = `${goalie.firstName.default} ${goalie.lastName.default}`;

    const headshotUrl = `https://assets.nhle.com/mugs/nhl/20242025/${teamAbbreviation}/${goalie.playerId}.png`;

    const goalieDiv = document.createElement('div');
    goalieDiv.className = 'player-stat';

    goalieDiv.innerHTML = `
      <img src="${headshotUrl}" alt="${playerName}" class="player-headshot">
      <h4>${playerName} (Goalie)</h4>
      <p>GP: ${goalie.gamesPlayed}</p>
      <p>W: ${goalie.wins}</p>
      <p>L: ${goalie.losses}</p>
      <p>GAA: ${goalie.goalsAgainstAverage.toFixed(2)}</p>
      <p>SP: ${(goalie.savePercentage * 100 || 0).toFixed(2)}%</p>
      <p>SO: ${goalie.shutouts}</p>
      <p>TOI: ${formatTimeOnIce(goalie.timeOnIce)}</p>
    `;

    statsContainer.appendChild(goalieDiv);
  });
}

// Helper function to format time on ice from seconds to MM:SS
function formatTimeOnIce(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60); // Round the remaining seconds
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function fetchAndDisplayStandings() {
  const date = new Date().toISOString().slice(0, 10);  // Get current date in YYYY-MM-DD format
  const standingsUrl = `https://api-web.nhle.com/v1/standings/${date}`; // Use dynamic date

  try {
    const response = await fetch(standingsUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    
    const teams = data.standings;

    // Group teams by conference and division
    const conferences = {
      'Eastern': {},
      'Western': {}
    };

    teams.forEach(team => {
      const conference = team.conferenceName;
      const division = team.divisionName;

      if (!conferences[conference][division]) {
        conferences[conference][division] = [];
      }

      conferences[conference][division].push(team);
    });

    // Clear previous standings
    const standingsContainer = document.querySelector('#standings-container');
    standingsContainer.innerHTML = '';

    // Generate standings by conference and division
    Object.keys(conferences).forEach(conferenceName => {
      const conferenceDiv = document.createElement('div');
      conferenceDiv.classList.add('conference');

      const conferenceHeader = document.createElement('h2');
      conferenceHeader.textContent = `${conferenceName} Conference`;
      conferenceDiv.appendChild(conferenceHeader);

      const divisions = conferences[conferenceName];

      Object.keys(divisions).forEach(divisionName => {
        const divisionDiv = document.createElement('div');
        divisionDiv.classList.add('division');

        const divisionHeader = document.createElement('h3');
        divisionHeader.textContent = `${divisionName} Division`;
        divisionDiv.appendChild(divisionHeader);

        const teamGrid = document.createElement('div');
        teamGrid.classList.add('team-grid');

        divisions[divisionName].forEach((team, index) => {
          const teamTile = document.createElement('div');
          teamTile.classList.add('team-tile');

          console.log(`Team: ${team.teamName.default}, Abbreviation: ${team.teamAbbrev.default}`); // Debug log

          // Add data attribute for team abbreviation (from teamAbbrev.default)
          teamTile.setAttribute('data-team-abbreviation', team.teamAbbrev.default);

          // Include the rank in the layout (1-based index)
          const teamRank = document.createElement('div');
          teamRank.classList.add('team-rank');
          teamRank.textContent = `#${index + 1}`;

          const teamLogo = document.createElement('img');
          teamLogo.src = team.teamLogo;
          teamLogo.alt = `${team.teamName.default} logo`;
          teamLogo.classList.add('team-logo');

          const teamInfo = document.createElement('div');
          teamInfo.classList.add('team-info');
          teamInfo.innerHTML = `
            <p>${team.teamName.default}</p>
            <p>Games Played: ${team.gamesPlayed}</p>
            <p>Points: ${team.points}</p>
            <p>Wins: ${team.wins}</p>
            <p>Goal Differential: ${team.goalDifferential}</p>
          `;

          // Append the rank, logo, and team info
          teamTile.appendChild(teamRank);
          teamTile.appendChild(teamLogo); // Append logo to the tile
          teamTile.appendChild(teamInfo);

          // Add event listener for each tile to show team stats directly
          teamTile.addEventListener('click', () => {
            const teamCode = team.teamAbbrev.default;
            console.log(`Clicked on team: ${team.teamName.default}, Code: ${teamCode}`); // Debug log
            handleTeamTileClick(teamCode, team); // Pass the team abbreviation to fetch both team and player stats
          });

          teamGrid.appendChild(teamTile);
        });

        divisionDiv.appendChild(teamGrid);
        conferenceDiv.appendChild(divisionDiv);
      });

      standingsContainer.appendChild(conferenceDiv);
    });

  } catch (error) {
    console.error('Error fetching standings:', error);
    const standingsContainer = document.querySelector('#standings-container');
    standingsContainer.innerHTML = '<p>Error loading standings data.</p>';
  }
}

// Function to handle when a team tile is clicked
function handleTeamTileClick(teamCode, teamName) {
  fetchTeamInfo(teamCode).then(data => {
    if (data) {
      console.log("Team data after clicking:", data); // Log the full team data for inspection
      showModal(teamName, data);  // Pass the data to showModal function
    }
  });
}


async function fetchTeamInfo(teamCode) {
  const statsUrl = `https://api-web.nhle.com/v1/club-stats/${teamCode}/20242025/2`;
  const rosterUrl = `https://api-web.nhle.com/v1/roster/${teamCode}/20242025`;

  try {
    // Fetch team stats
    const teamResponse = await fetch(statsUrl);
    if (!teamResponse.ok) {
      throw new Error(`Error fetching stats for team ${teamCode}: ${teamResponse.status}`);
    }
    const teamStatsData = await teamResponse.json();

    // Fetch player stats (roster)
    const rosterResponse = await fetch(rosterUrl);
    if (!rosterResponse.ok) {
      throw new Error(`Error fetching roster for team ${teamCode}: ${rosterResponse.status}`);
    }
    const rosterData = await rosterResponse.json();

    // Return both team and player data
    return {
      teamStats: teamStatsData,  // Ensure this structure matches what you need
      roster: rosterData // Ensure this structure is being used correctly
    };
  } catch (error) {
    console.error('Error fetching team or roster data:', error);
    return null;
  }
}

function showModal(teamName, teamData) {
  const modal = document.getElementById('teamStatsModal');
  const teamStatsDiv = document.getElementById('teamStats');
  const playerStatsDiv = document.getElementById('teamPlayers'); // Add a container for player stats
  
  document.getElementById('teamName').textContent = teamName;
  teamStatsDiv.innerHTML = '';  // Clear previous team stats
  playerStatsDiv.innerHTML = '';  // Clear previous player stats

  // Display team stats directly
  const teamStats = teamData.teamStats;
  const statsHTML = `
    <div class="team-stat">
      <p>Games Played: ${teamStats.skaters?.length || 'N/A'}</p>
      <p>Wins: ${teamStats.goalies?.reduce((sum, goalie) => sum + (goalie.wins || 0), 0) || 'N/A'}</p>
      <p>Losses: ${teamStats.goalies?.reduce((sum, goalie) => sum + (goalie.losses || 0), 0) || 'N/A'}</p>
      <p>Goals For: ${teamStats.skaters?.reduce((sum, skater) => sum + (skater.goals || 0), 0) || 'N/A'}</p>
      <p>Goals Against: ${teamStats.goalies?.reduce((sum, goalie) => sum + (goalie.goalsAgainst || 0), 0) || 'N/A'}</p>
      <p>Points: ${teamStats.skaters?.reduce((sum, skater) => sum + (skater.points || 0), 0) || 'N/A'}</p>
    </div>
  `;
  teamStatsDiv.innerHTML = statsHTML;

  // Display player stats (roster: forwards, defensemen, goalies)
  const players = [...teamData.roster.forwards, ...teamData.roster.defensemen, ...teamData.roster.goalies];
  players.forEach(player => {
    const playerName = `${player.firstName?.default || 'Unknown'} ${player.lastName?.default || 'Unknown'}`;
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-stat');

    // Safely access teamAbbreviation and playerId
    const teamAbbreviation = teamData.roster.teamAbbreviation?.default || 'UNKNOWN';
    const playerId = player.playerId || 'N/A';

    // Construct the headshot URL
    const headshotUrl = `https://assets.nhle.com/mugs/nhl/20242025/${teamAbbreviation}/${playerId}.png`;

    playerDiv.innerHTML = `
      <img src="${headshotUrl}" alt="${playerName}" class="player-headshot">
      <h4>${playerName} (${player.positionCode || 'N/A'})</h4>
      <p>GP: ${player.gamesPlayed || 'N/A'}</p>
      <p>G: ${player.goals || 'N/A'}</p>
      <p>A: ${player.assists || 'N/A'}</p>
      <p>P: ${player.points || 'N/A'}</p>
      <p>+/-: ${player.plusMinus || 'N/A'}</p>
      <p>PIM: ${player.penaltyMinutes || 'N/A'}</p>
      <p>Shots: ${player.shots || 'N/A'}</p>
      <p>Shooting %: ${(player.shootingPctg * 100 || 0).toFixed(2)}%</p>
    `;

    playerStatsDiv.appendChild(playerDiv);
  });

  // Display the modal
  modal.style.display = "block";
}



// Event listener for closing the modal
document.querySelector('.close').onclick = function () {
  document.getElementById('teamStatsModal').style.display = "none";
};

// Async function to fetch and display today's games
// Function to format the game start time
// Function to format the game start time
function formatGameStartTime(utcTime, venueUTCOffset) {
  const gameStartTime = new Date(utcTime);
  const localTimeOffset = parseInt(venueUTCOffset.split(':')[0]);
  gameStartTime.setHours(gameStartTime.getUTCHours() + localTimeOffset); // Convert UTC to venue local time

  const currentDate = new Date();
  const gameDate = gameStartTime.getDate();
  const currentMonth = currentDate.getMonth();
  const gameMonth = gameStartTime.getMonth();

  if (currentDate.getFullYear() === gameStartTime.getFullYear() && currentMonth === gameMonth && currentDate.getDate() === gameDate) {
      // If the game starts today, just show the time
      return gameStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
      // If the game starts in the future, show the month, day, and time
      const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return gameStartTime.toLocaleDateString([], options);
  }
}

// Function to get the TV providers from the game object
function getTVProviders(tvBroadcasts) {
  if (tvBroadcasts && tvBroadcasts.length > 0) {
      // Join all networks by a comma
      return tvBroadcasts.map(broadcast => broadcast.network).join(', ');
  } else {
      return 'No TV broadcast available';
  }
}

// Async function to fetch and display games
async function displayGames() {
  try {
      // Fetch the current day's scoreboard data
      const response = await fetch('https://api-web.nhle.com/v1/scoreboard/now');
      const data = await response.json();

      const scoreboard = document.getElementById('scoreboard');
      scoreboard.innerHTML = ''; // Clear previous content

      if (data.gamesByDate.length > 0) {
          // Loop through all games by date
          data.gamesByDate.forEach(gameDateObj => {
              gameDateObj.games.forEach(game => {
                  const gameElement = document.createElement('div');
                  gameElement.className = 'game';

                  // Add the 'live-game' class if the game is live
                  if (game.gameState === 'LIVE') {
                      gameElement.classList.add('live-game');
                  }

                  // Determine what to display based on game state
                  let gameStatusText = '';
                  let awayTeamScore = '';
                  let homeTeamScore = '';
                  let awayTeamSOG = ''; // SOG for away team
                  let homeTeamSOG = ''; // SOG for home team

                  if (game.gameState === 'FUT') {
                      // Future game, display start time, no score
                      const startTimeFormatted = formatGameStartTime(game.startTimeUTC, game.venueUTCOffset);
                      gameStatusText = `${startTimeFormatted}`;
                  } else if (game.gameState === 'OFF') {
                      // Finished game, display "Final"
                      gameStatusText = 'Final';
                      awayTeamScore = `<span class="score">${game.awayTeam.score}</span>`;
                      homeTeamScore = `<span class="score">${game.homeTeam.score}</span>`;
                  } else if (game.gameState === 'LIVE') {
                      // Ongoing game, display current period and time left
                      const period = game.periodDescriptor.number;
                      const timeRemaining = game.clock.timeRemaining;
                      gameStatusText = `Period: ${period}, Time left: ${timeRemaining}`;
                      awayTeamScore = `<span class="score">${game.awayTeam.score}</span>`;
                      homeTeamScore = `<span class="score">${game.homeTeam.score}</span>`;

                      // Display SOG only for live games
                      awayTeamSOG = `<div>SOG: ${game.awayTeam.sog}</div>`;
                      homeTeamSOG = `<div>SOG: ${game.homeTeam.sog}</div>`;
                  }

                  // Get TV providers
                  const tvProviders = getTVProviders(game.tvBroadcasts);

                  // Create the HTML structure for each game
                  gameElement.innerHTML = `
                      <div class="team">
                          <img src="${game.awayTeam.logo}" alt="${game.awayTeam.abbrev} logo" class="team-logo"/>
                          <span>${game.awayTeam.abbrev}</span>
                          <div class="team-record">Record: ${game.awayTeam.record}</div>
                          ${awayTeamScore} <!-- Show score for ongoing or finished games -->
                          ${awayTeamSOG} <!-- Show SOG for live games -->
                      </div>
                      <span>vs</span>
                      <div class="team">
                          <img src="${game.homeTeam.logo}" alt="${game.homeTeam.abbrev} logo" class="team-logo"/>
                          <span>${game.homeTeam.abbrev}</span>
                          <div class="team-record">${game.homeTeam.record}</div>
                          ${homeTeamScore} <!-- Show score for ongoing or finished games -->
                          ${homeTeamSOG} <!-- Show SOG for live games -->
                      </div>
                      <div class="game-status">${gameStatusText}</div>
                      <div class="tv-providers">${tvProviders}</div> <!-- Display the TV providers -->
                      <div class="game-center-link">
                          <a href="https://nhl.com${game.gameCenterLink}" target="_blank">Game Center</a>
                      </div>
                  `;
                  // Append the game to the scoreboard
                  scoreboard.appendChild(gameElement);
              });
          });
      } else {
          // Display message if no games are found
          scoreboard.innerHTML = '<p>No games found</p>';
      }
  } catch (error) {
      console.error('Error fetching scoreboard data:', error);
  }
}






// Call the function to display games
displayGames();



fetchAndDisplayStandings();
fetchSchedule();
fetchRoster();
fetchTeamStats();
