document.addEventListener('DOMContentLoaded', () => {
    // Close all modals when the close button is clicked
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(closeButton => {
      closeButton.onclick = function () {
        const modal = closeButton.closest('.modal');
        modal.style.display = 'none';
      };
    });
  
    // Close modal when clicking outside of the modal content
    window.onclick = function (event) {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    };
  
    // Fetch standings, roster, schedule, and team stats on load
    fetchAndDisplayStandings();
    fetchSchedule();
    fetchRoster();
    fetchTeamStats();
  });
  
  // Show loading spinner in the modal
  function showLoadingSpinner() {
    const modalContent = document.getElementById('modal-player-details');
    modalContent.innerHTML = '<p>Loading...</p>';
  }
  
  // Fetch and display player stats in a modal
  async function openModal(playerId) {
    const modal = document.getElementById('playerModal');
    const modalContent = document.getElementById('modal-player-details');
    showLoadingSpinner();
  
    try {
      const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
      const player = await response.json();
  
      modalContent.innerHTML = ''; // Clear previous content
      modal.style.backgroundImage = `url(${player.heroImage || ''})`;
      modal.style.backgroundSize = 'cover';
      modal.style.backgroundPosition = 'center';
      modal.style.color = 'white'; // For visibility
  
      const firstName = player.firstName?.default || 'Unknown';
      const lastName = player.lastName?.default || 'Unknown';
      const teamName = player.teamCommonName?.default || 'Unknown Team';
      const isGoalie = player.position === 'G';
  
      // Modal content
      modalContent.innerHTML = `
        <div class="trading-card">
          <h2>${firstName} ${lastName}</h2>
          <img src="${player.headshot}" alt="${firstName} ${lastName} headshot" class="headshot">
          <p>Position: ${player.position}</p>
          <p>Team: ${teamName}</p>
          <div class="tab">
            <button class="tablinks active" onclick="openStats(event, 'CareerStats')">Career Stats</button>
            <button class="tablinks" onclick="openStats(event, 'SeasonStats')">Current Season</button>
          </div>
          <div id="CareerStats" class="tabcontent active">
            ${isGoalie ? getGoalieStats(player.careerTotals.regularSeason) : getSkaterStats(player.careerTotals.regularSeason)}
          </div>
          <div id="SeasonStats" class="tabcontent">
            ${isGoalie ? getGoalieStats(player.featuredStats.regularSeason.subSeason) : getSkaterStats(player.featuredStats.regularSeason.subSeason)}
          </div>
        </div>
      `;
  
      modal.style.display = 'block'; // Show modal
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
  
  // Helper function to format skater stats
  function getSkaterStats(stats) {
    return `
      <div class="stat-tile-container">
        <div class="stat-tile">GP: ${stats.gamesPlayed || 0}</div>
        <div class="stat-tile">G: ${stats.goals || 0}</div>
        <div class="stat-tile">A: ${stats.assists || 0}</div>
        <div class="stat-tile">P: ${stats.points || 0}</div>
        <div class="stat-tile">+/-: ${stats.plusMinus || 0}</div>
        <div class="stat-tile">PIM: ${stats.pim || 0}</div>
        <div class="stat-tile">S: ${stats.shots || 0}</div>
        <div class="stat-tile">SP: ${(stats.shootingPctg || 0).toFixed(2)}%</div>
      </div>
    `;
  }
  
  // Helper function to format goalie stats
  function getGoalieStats(stats) {
    return `
      <div class="stat-tile-container">
        <div class="stat-tile">GP: ${stats.gamesPlayed || 0}</div>
        <div class="stat-tile">W: ${stats.wins || 0}</div>
        <div class="stat-tile">L: ${stats.losses || 0}</div>
        <div class="stat-tile">GA: ${stats.goalsAgainst || 0}</div>
        <div class="stat-tile">GAA: ${(stats.goalsAgainstAvg || 0).toFixed(2)}</div>
        <div class="stat-tile">SV%: ${(stats.savePctg || 0).toFixed(2)}%</div>
        <div class="stat-tile">SO: ${stats.shutouts || 0}</div>
      </div>
    `;
  }
  
  // Fetch and display standings
  async function fetchAndDisplayStandings() {
    const date = new Date().toISOString().slice(0, 10);
    const standingsUrl = `https://api-web.nhle.com/v1/standings/${date}`;
  
    try {
      const response = await fetch(standingsUrl);
      const data = await response.json();
      const teams = data.standings;
      const conferences = { 'Eastern': {}, 'Western': {} };
  
      teams.forEach(team => {
        const conference = team.conferenceName;
        const division = team.divisionName;
        if (!conferences[conference][division]) {
          conferences[conference][division] = [];
        }
        conferences[conference][division].push(team);
      });
  
      const standingsContainer = document.querySelector('#standings-container');
      standingsContainer.innerHTML = ''; // Clear previous standings
  
      Object.keys(conferences).forEach(conferenceName => {
        const conferenceDiv = document.createElement('div');
        conferenceDiv.classList.add('conference');
        conferenceDiv.innerHTML = `<h2>${conferenceName} Conference</h2>`;
        
        const divisions = conferences[conferenceName];
        Object.keys(divisions).forEach(divisionName => {
          const divisionDiv = document.createElement('div');
          divisionDiv.classList.add('division');
          divisionDiv.innerHTML = `<h3>${divisionName} Division</h3>`;
  
          const teamGrid = document.createElement('div');
          teamGrid.classList.add('team-grid');
  
          divisions[divisionName].forEach((team, index) => {
            const teamTile = document.createElement('div');
            teamTile.classList.add('team-tile');
            teamTile.setAttribute('data-team-code', team.teamAbbrev); // Store team code
            teamTile.style.backgroundImage = `url(${team.teamLogo})`;
  
            teamTile.innerHTML = `
              <div class="team-rank">#${index + 1}</div>
              <div class="team-info">
                <p>${team.teamName.default}</p>
                <p>Points: ${team.points}</p>
                <p>Wins: ${team.wins}</p>
              </div>
            `;
            
            teamGrid.appendChild(teamTile);
          });
  
          divisionDiv.appendChild(teamGrid);
          conferenceDiv.appendChild(divisionDiv);
        });
  
        standingsContainer.appendChild(conferenceDiv);
      });
  
      // Add event listener for team tile clicks to open modal
      document.querySelectorAll('.team-tile').forEach(tile => {
        tile.addEventListener('click', event => {
          const teamCode = tile.getAttribute('data-team-code');
          const teamName = tile.querySelector('.team-info p').textContent;
          handleTeamTileClick(teamCode, teamName);
        });
      });
  
    } catch (error) {
      console.error('Error fetching standings:', error);
    }
  }
  
  // Function to handle team tile clicks and display team stats in a modal
  async function handleTeamTileClick(teamCode, teamName) {
    const modal = document.getElementById('teamStatsModal');
    const teamStatsDiv = document.getElementById('teamStats');
    teamStatsDiv.innerHTML = '<p>Loading team stats...</p>'; // Show loading message
  
    try {
      const response = await fetch(`https://api-web.nhle.com/v1/club-stats/${teamCode}/20242025/2`);
      const data = await response.json();
  
      displayTeamStats(teamName, data);
    } catch (error) {
      console.error(`Error fetching stats for team ${teamCode}:`, error);
    }
  }
  
  // Function to display team stats (both skaters and goalies)
  function displayTeamStats(teamName, statsData) {
    const modal = document.getElementById('teamStatsModal');
    const teamStatsDiv = document.getElementById('teamStats');
    teamStatsDiv.innerHTML = ''; // Clear previous stats
  
    const skaters = statsData.skaters;
    const goalies = statsData.goalies;
  
    teamStatsDiv.innerHTML += `<h2>${teamName}</h2>`;
  
    if (skaters && skaters.length > 0) {
      teamStatsDiv.innerHTML += `<h3>Skater Stats</h3>`;
      skaters.forEach(skater => {
        teamStatsDiv.innerHTML += `
          <div class="player-stat">
            <img src="${skater.headshot}" alt="${skater.firstName.default} ${skater.lastName.default}" class="player-headshot">
            <p>${skater.firstName.default} ${skater.lastName.default} (${skater.positionCode})</p>
            <p>GP: ${skater.gamesPlayed}</p>
            <p>Points: ${skater.points}</p>
            <p>Goals: ${skater.goals}</p>
            <p>Assists: ${skater.assists}</p>
          </div>
        `;
      });
    }
  
    if (goalies && goalies.length > 0) {
      teamStatsDiv.innerHTML += `<h3>Goalie Stats</h3>`;
      goalies.forEach(goalie => {
        teamStatsDiv.innerHTML += `
          <div class="player-stat">
            <img src="${goalie.headshot}" alt="${goalie.firstName.default} ${goalie.lastName.default}" class="player-headshot">
            <p>${goalie.firstName.default} ${goalie.lastName.default} (Goalie)</p>
            <p>GP: ${goalie.gamesPlayed}</p>
            <p>Wins: ${goalie.wins}</p>
            <p>GAA: ${goalie.goalsAgainstAverage.toFixed(2)}</p>
            <p>Save Percentage: ${(goalie.savePercentage * 100).toFixed(2)}%</p>
          </div>
        `;
      });
    }
  
    modal.style.display = 'block'; // Show modal
  }
  
  // Fetch schedule
  async function fetchSchedule() {
    try {
      const response = await fetch('https://api-web.nhle.com/v1/club-schedule-season/uta/20242025');
      const data = await response.json();
      displaySchedule(data.games);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  }
  
  // Fetch roster
  async function fetchRoster() {
    try {
      const response = await fetch('https://api-web.nhle.com/v1/roster/uta/20242025');
      const data = await response.json();
      displayPlayers([...data.forwards, ...data.defensemen, ...data.goalies]);
    } catch (error) {
      console.error("Error fetching roster data:", error);
    }
  }
  
  // Display schedule
  function displaySchedule(games) {
    const scheduleContainer = document.getElementById('schedule-container');
    scheduleContainer.innerHTML = ''; // Clear previous schedule
  
    games.forEach(game => {
      const gameDiv = document.createElement('div');
      gameDiv.classList.add('game');
      const gameDate = new Date(game.gameDate).toLocaleDateString();
      const startTime = new Date(game.startTimeUTC).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
      gameDiv.innerHTML = `
        <p>${game.awayTeam.placeName.default} vs ${game.homeTeam.placeName.default}</p>
        <p>Date: ${gameDate}</p>
        <p>Time: ${startTime}</p>
      `;
  
      scheduleContainer.appendChild(gameDiv);
    });
  }
  
  // Fetch and display team stats
  async function fetchTeamStats() {
    try {
      const response = await fetch('https://api-web.nhle.com/v1/club-stats/uta/20242025/2');
      const data = await response.json();
      displaySkaters(data.skaters);
      displayGoalies(data.goalies);
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  }
  
  // Display skaters in roster
  function displaySkaters(skaters) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '<h3>Skater Stats</h3>'; // Clear previous content
  
    skaters.forEach(skater => {
      const skaterDiv = document.createElement('div');
      skaterDiv.classList.add('player-stat');
  
      skaterDiv.innerHTML = `
        <img src="${skater.headshot}" alt="${skater.firstName.default}" class="player-headshot">
        <p>${skater.firstName.default} ${skater.lastName.default} (${skater.positionCode})</p>
        <p>GP: ${skater.gamesPlayed}</p>
        <p>G: ${skater.goals}</p>
        <p>A: ${skater.assists}</p>
      `;
  
      statsContainer.appendChild(skaterDiv);
    });
  }
  
  // Display goalies in roster
  function displayGoalies(goalies) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML += '<h3>Goalie Stats</h3>'; // Add goalie section
  
    goalies.forEach(goalie => {
      const goalieDiv = document.createElement('div');
      goalieDiv.classList.add('player-stat');
  
      goalieDiv.innerHTML = `
        <img src="${goalie.headshot}" alt="${goalie.firstName.default}" class="player-headshot">
        <p>${goalie.firstName.default} ${goalie.lastName.default} (Goalie)</p>
        <p>GP: ${goalie.gamesPlayed}</p>
        <p>W: ${goalie.wins}</p>
        <p>GAA: ${goalie.goalsAgainstAverage.toFixed(2)}</p>
      `;
  
      statsContainer.appendChild(goalieDiv);
    });
  }

  
  fetchAndDisplayStandings();
fetchSchedule();
fetchRoster();
fetchTeamStats();