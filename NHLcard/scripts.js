document.addEventListener("DOMContentLoaded", function () {
    const playerCardsContainer = document.getElementById("player-cards-container");
    const modal = document.getElementById("player-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    const modalBody = document.getElementById("modal-body");
    const seasonSelect = document.getElementById("playerSeasonSelect");
    const backBtn = document.getElementById("back-btn");
    const teamCardsContainer = document.getElementById("team-cards-container");
    let selectedPlayerId = null;
    let selectedTeamPrimaryColor = "";
    let selectedTeamSecondaryColor = "";
  
    // Fetch the colors data
    fetch("colors.json")
      .then((response) => response.json())
      .then((colorsData) => {
        // Store colors in an object for easy retrieval
        const teamColors = {};
        colorsData.forEach((colorData) => {
          teamColors[colorData.name] = colorData.colors.hex;
        });
  
        // Fetch NHL teams using the new API URL
        fetch("https://api-web.nhle.com/v1/teams") // UPDATED URL
          .then((response) => response.json())
          .then((data) => {
            data.teams.forEach((team) => {
              const teamCard = document.createElement("div");
              teamCard.className = "team-card";
              teamCard.setAttribute("data-team-id", team.id);
  
              // Use team name to get the colors
              const primaryColor = teamColors[team.name]
                ? `#${teamColors[team.name][0]}`
                : "#ffffff"; // Default to white if no color
              const secondaryColor =
                teamColors[team.name] && teamColors[team.name][1]
                  ? `#${teamColors[team.name][1]}`
                  : primaryColor;
              teamCard.style.backgroundColor = primaryColor;
              teamCard.style.borderColor = secondaryColor;
              teamCard.style.color = secondaryColor;
  
              // Create and append team logo
              const teamLogo = document.createElement("img");
              let teamId = team.id;
              const LogoUrl = `https://assets.nhle.com/logos/nhl/svg/${team.abbreviation}_light.svg`; // UPDATED URL
              teamLogo.src = LogoUrl;
              teamCard.appendChild(teamLogo);
  
              // Append the card to a container
              teamCardsContainer.appendChild(teamCard);
  
              teamCard.addEventListener("click", function () {
                const teamId = this.getAttribute("data-team-id");
  
                // Fetch roster for selected team using the new API
                fetch(`https://api-web.nhle.com/v1/roster/${team.abbreviation}/now`) // UPDATED URL
                  .then((response) => response.json())
                  .then((data) => {
                    // Clear previous player cards
                    playerCardsContainer.innerHTML = "";
  
                    // Generate a card for each player
                    data.roster.forEach((playerDetails) => {
                      const player = playerDetails.person;
                      const teamLogoUrl = `https://assets.nhle.com/logos/nhl/svg/${team.abbreviation}_light.svg`; // UPDATED URL
  
                      const playerCardContent = `
                        <div class="card" data-player-id="${player.id}">
                            <img src="https://assets.nhle.com/images/headshots/current/168x168/${player.id}.png" 
                                alt="${player.fullName}" 
                                onerror="this.onerror=null; this.src='assets/images/noheadshot.png';">
                            <div id="playerInfo">
                                <h2>${player.fullName}</h2>
                                <img src="${teamLogoUrl}" alt="Team Logo" width="115">
                                <p>${playerDetails.position.name}</p>
                                <p>#${playerDetails.jerseyNumber}</p>
                            </div>
                        </div>
                      `;
  
                      // Create an actual DOM element from the string
                      const tempDiv = document.createElement("div");
                      tempDiv.innerHTML = playerCardContent.trim();
                      const actualPlayerCard = tempDiv.firstChild;
                      const bodyElement = document.body;
  
                      // Style the player card
                      actualPlayerCard.style.backgroundColor = primaryColor;
                      actualPlayerCard.style.borderColor = secondaryColor;
                      actualPlayerCard.style.color = secondaryColor;
                      bodyElement.style.backgroundColor = selectedTeamSecondaryColor;
                      selectedTeamPrimaryColor = primaryColor;
                      selectedTeamSecondaryColor = secondaryColor;
  
                      // Find the player's image element inside the card
                      const playerImage = actualPlayerCard.querySelector("img");
  
                      // Apply the primaryColor as the border color to the image
                      playerImage.style.border = `10px solid ${secondaryColor}`;
  
                      // Append the styled card to the container
                      playerCardsContainer.appendChild(actualPlayerCard);
                    });
                  });
              });
            });
          });
      });
  
    backBtn.addEventListener("click", function () {
      // Hide player cards
      playerCardsContainer.innerHTML = "";
  
      // Show teams
      Array.from(document.querySelectorAll(".team-card")).forEach(
        (el) => (el.style.display = "block")
      );
  
      // Hide the back button
      backBtn.style.display = "none";
    });
  
    //Creates Player Modal when a player is clicked
    playerCardsContainer.addEventListener("click", function (event) {
      if (event.target.closest(".card")) {
        selectedPlayerId = event.target.closest(".card").getAttribute("data-player-id");
        const playerId = selectedPlayerId;
  
        console.log("Selected Player ID:", playerId, selectedPlayerId);
  
        // Fetch player details using the new API
        fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`) // UPDATED URL
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const player = data.people[0];
            const teamId = player.currentTeam.id;
  
            // Extract the teamLogoUrl
            const teamLogoUrl = `https://assets.nhle.com/logos/nhl/svg/${player.currentTeam.abbreviation}_light.svg`; // UPDATED URL
  
            // Set the teamLogoUrl as the background of the modal-header
            const modalHeader = document.querySelector("#modal-header");
            modalHeader.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${teamLogoUrl})`;
            modalHeader.style.backgroundRepeat = "no-repeat";
            modalHeader.style.backgroundSize = "cover";
            modalHeader.style.backgroundPosition = "center";
            modalHeader.style.backgroundOpacity = "0.5";
  
            // Get current season
            const currentYear = new Date().getFullYear();
            const lastYear = currentYear - 1;
            const season = `${lastYear}${currentYear}`;
  
            // Fetch initial season stats for the current season
            fetchStatsForSeason(playerId, season);
  
            // Populate the season dropdown based on the years the player has played
            populatePlayerSeasonsDropdown(playerId);
  
            // Set player details in the modal header
            const playerImage = document.getElementById("player-image");
            playerImage.src = `https://assets.nhle.com/images/headshots/current/168x168/${playerId}.png`; // UPDATED URL
            playerImage.onerror = function () {
              this.src = "assets/images/noheadshot.png";
            };
  
            const playerName = document.getElementById("modal-player-name");
            playerName.textContent = `${player.fullName} #${player.primaryNumber} - ${player.primaryPosition.name}`;
  
            const playerAge = document.getElementById("player-age");
            playerAge.textContent = player.currentAge;
  
            const playerHeight = document.getElementById("player-height");
            playerHeight.textContent = player.height;
  
            const playerWeight = document.getElementById("player-weight");
            playerWeight.textContent = player.weight;
  
            const playerHometown = document.getElementById("player-hometown");
            playerHometown.textContent = `${player.birthCity}, ${player.birthStateProvince}, ${player.birthCountry}`;
  
            const playerHanded = document.getElementById("player-handed");
            playerHanded.textContent =
              (player.primaryPosition.name === "Goalie" ? " Catches: " : " Shoots: ") +
              (player.shootsCatches === "L" ? " Left" : " Right");
  
            // Set background color for modal header
            modalHeader.style.backgroundColor = selectedTeamSecondaryColor;
            modalHeader.style.color = selectedTeamPrimaryColor;
  
            // Show the modal
            modal.style.display = "block";
          });
      }
    });
  
    function fetchStatsForSeason(playerId, selectedSeason) {
      fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`) // UPDATED URL
        .then((response) => response.json())
        .then((data) => {
          const splits = data.stats[0].splits;
          console.log(playerId);
  
          // Fetch stats for the selected season
          const seasonStats = splits.find((split) => split.season === selectedSeason);
  
          // Construct and display the player stats
          const playerStats = `
            <h3>Season ${selectedSeason.substring(0, 4)}-${selectedSeason.substring(4)} Stats</h3>
            <div class="player-stats" id="display-player-stats">
              ${createStatString("goals", "G")}
              ${createStatString("assists", "A")}
              ${createStatString("points", "P")}
            </div>
          `;
  
          modalBody.innerHTML = playerStats;
        });
    }
  
    function populatePlayerSeasonsDropdown(playerId) {
      fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`) // UPDATED URL
        .then((response) => response.json())
        .then((data) => {
          const seasons = new Set();
          const splits = data.stats[0].splits;
  
          splits.forEach((split) => {
            const season = split.season;
            if (split.stat && (split.stat.points || split.stat.points === 0)) {
              seasons.add(season);
            }
          });
  
          const seasonSelect = document.getElementById("playerSeasonSelect");
          seasonSelect.innerHTML = ""; // clear previous options
  
          // Convert the Set to an array and sort it in descending order
          const sortedSeasons = Array.from(seasons).sort((a, b) => b - a);
  
          sortedSeasons.forEach((season) => {
            const option = document.createElement("option");
            option.value = season;
            option.textContent = `${season.substring(0, 4)}-${season.substring(4, 8)}`;
            seasonSelect.appendChild(option);
          });
  
          // Activate the dropdown now that it's populated
          seasonSelect.removeAttribute("disabled");
        })
        .catch((error) => {
          console.error("Error fetching player seasons:", error);
        });
    }
  
    // Event listener for the season dropdown change
    seasonSelect.addEventListener("change", function () {
      if (selectedPlayerId) {
        fetchStatsForSeason(selectedPlayerId, this.value);
      }
    });
  
    // Close the modal when the close button is clicked
    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Close the modal when the user clicks outside of it
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  