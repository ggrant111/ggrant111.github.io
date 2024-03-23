document.addEventListener('DOMContentLoaded', (event) => {
    const refreshButton = document.querySelector('.refresh-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => fetchScores(getSelectedgender()));
    }

    initiateCountdown();
});

async function fetchScores(gender) {
    const baseApiUrl = 'https://site.api.espn.com/apis/site/v2/sports/';
    let urls = [];
    let combinedEvents = [];

    // Set up URLs based on the gender selection
    switch (gender) {
        case 'mens-college-basketball':
            urls.push(`${baseApiUrl}basketball/mens-college-basketball/scoreboard`);
            break;
        case 'womens-college-basketball':
            urls.push(`${baseApiUrl}basketball/womens-college-basketball/scoreboard`);
            break;
        case 'nfl':
            urls.push(`${baseApiUrl}football/nfl/scoreboard`);
            break;
        case 'nhl':
            urls.push(`${baseApiUrl}hockey/nhl/scoreboard`);
            break;
        case 'mlb':
            urls.push(`${baseApiUrl}baseball/mlb/scoreboard`);
            break;
        case 'ncaaf':
            urls.push(`${baseApiUrl}footbal/college-football/scoreboard`);
            break;
        case 'nba':
            urls.push(`${baseApiUrl}basketball/nba/scoreboard`);
            break;
        case 'wnba':
            urls.push(`${baseApiUrl}basketball/wnba/scoreboard`);
            break;
        case 'mls':
            urls.push(`${baseApiUrl}soccer/usa.1/scoreboard`);
            break;
        case 'both':
            urls.push(`${baseApiUrl}basketball/mens-college-basketball/scoreboard`, `${baseApiUrl}womens-college-basketball/scoreboard`);
            break;
        default:
            console.error('Unexpected gender value:', gender);
            return;
    }

    document.getElementById('scores').innerHTML = '<p>Refreshing scores...</p>';

    try {
        // Fetch scores for all selected categories
        const responses = await Promise.all(urls.map(url => fetch(url)));
        for (const response of responses) {
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            combinedEvents = combinedEvents.concat(data.events); // Combine events from both genders
        }

        // Sort combined events before processing
        combinedEvents.sort((a, b) => {
            const statusA = a.competitions[0].status.type.state;
            const statusB = b.competitions[0].status.type.state;
            const startTimeA = new Date(a.date).getTime();
            const startTimeB = new Date(b.date).getTime();

            if (statusA === 'in' && statusB !== 'in') return -1;
            if (statusA !== 'in' && statusB === 'in') return 1;
            if (statusA === 'pre' && statusB !== 'pre') return -1;
            if (statusA !== 'pre' && statusB === 'pre') return 1;

            return startTimeA - startTimeB; // Earlier games first
        });

        // Process the sorted, combined events
        const scoresHtml = processScoresData({events: combinedEvents});
        document.getElementById('scores').innerHTML = scoresHtml;
    } catch (error) {
        console.error('Failed to fetch scores:', error);
        document.getElementById('scores').innerHTML = '<p>Failed to load scores.</p>';
    }
}

function processScoresData(data) {
    // Get the selected score difference from the number input
    const selectedScoreDiff = parseInt(document.getElementById('scoreDifferenceInput').value, 10);

    if (data.events && data.events.length > 0) {
        // First, sort the games: live games first, then upcoming, and finalized games last
        const sortedEvents = data.events.sort((a, b) => {
            const statusA = a.competitions[0].status.type.state;
            const statusB = b.competitions[0].status.type.state;
            const startTimeA = new Date(a.date).getTime();
            const startTimeB = new Date(b.date).getTime();

            if (statusA === 'in' && statusB !== 'in') return -1;
            if (statusA !== 'in' && statusB === 'in') return 1;
            if (statusA === 'pre' && statusB !== 'pre') return -1;
            if (statusA !== 'pre' && statusB === 'pre') return 1;

            return startTimeA - startTimeB; // Earlier games first
        });

        // Then, process and return HTML string for each sorted event
        return sortedEvents.map((event) => {
            const game = event.competitions[0];
            const homeTeam = game.competitors.find(team => team.homeAway === 'home');
            const awayTeam = game.competitors.find(team => team.homeAway === 'away');
            const status = game.status.type.detail;
            const network = game.broadcasts ? game.broadcasts.map(broadcast => broadcast.names.join(', ')).join(', ') : 'Not available';
            const stadium = game.venue.fullName || 'Not available';
            const city = game.venue.address.city || 'Not available';
            const state = game.venue.address.state || '';
            const scoreDiff = Math.abs(parseInt(homeTeam.score, 10) - parseInt(awayTeam.score, 10));
            
            // Now, correctly use the dynamically selected score difference for determining "close games"
            const isCloseGame = homeTeam.score > 0 && awayTeam.score > 0 && scoreDiff <= selectedScoreDiff ? 'close-game' : '';
            const liveIndicator = game.status.type.state === 'in' ? `<span class="text-red-500"><span class="live-indicator-dot"></span>Live</span>` : '';

            return `<div class="p-4 border border-gray-200 rounded-lg ${isCloseGame}">
                    <div class="flex justify-between items-center">
                        <div>
                        <h3><img src="${homeTeam.team.logo}" alt="${homeTeam.team.abbreviation} Logo" style="width:20px;"> ${homeTeam.team.abbreviation} - ${homeTeam.score}</h3>
                        <h3><img src="${awayTeam.team.logo}" alt="${awayTeam.team.abbreviation} Logo" style="width:20px;"> ${awayTeam.team.abbreviation} - ${awayTeam.score}</h3>
                        <p>${status}</p>
                        <p>${network} - ${stadium} - ${city}, ${state}</p>
                        </div>
                        <div>${liveIndicator}</div>
                    </div>
                </div>`;
        }).join('');
    } else {
        return '<p>No games currently.</p>';
    }
}

function initiateCountdown() {
    clearInterval(window.countdownInterval); // Clear any existing interval to avoid multiple intervals running

    let countdown = 30; // Set countdown duration (in seconds)

    // Function to update countdown display and manage countdown logic
    const countdownFunction = () => {
        if (countdown > 0) {
            // If countdown is not yet 0, decrement and update display
            countdown -= 1;
            updateCountdown(countdown);
        } else {
            // When countdown reaches 0, fetch scores and reset countdown
            clearInterval(window.countdownInterval); // Clear interval to stop the countdown
            fetchScores(getSelectedgender()); // Fetch new scores based on the current gender selection
            
            // Instead of setting countdown to 30 again here, we restart the initiateCountdown function to reset everything
            initiateCountdown(); // This ensures the countdown restarts properly after each cycle
        }
    };

    // Update countdown display immediately before starting the interval
    updateCountdown(countdown);

    // Start the countdown interval
    window.countdownInterval = setInterval(countdownFunction, 1000); // Update every second
}

function updateCountdown(seconds) {
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = `Refreshing in ${seconds}s`;
    }
}


// Function to get the currently selected gender value
function getSelectedgender() {
    return document.querySelector('input[name="gender"]:checked').value;
  }
  
  // Listen for changes on each radio button
  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('click', function() {
      fetchScores(getSelectedgender());
    });
  });
  
  document.getElementById('scoreDifferenceInput').addEventListener('input', function() {
    fetchScores(getSelectedgender()); // Re-fetch or refresh the display using the new score difference
});

  // Initial fetch for the default selection (men's scores in this example)
  fetchScores(getSelectedgender());