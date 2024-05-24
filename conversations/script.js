document.addEventListener('DOMContentLoaded', function() {
    let questionsAsked = {};
    let questionHistory = [];
    let favoriteQuestions = [];
    let timerInterval;
  
    fetch('questions.json')
      .then(response => response.json())
      .then(data => {
        const categories = data.categories;
        const categoryTiles = document.getElementById('categoryTiles');
        const modal = document.getElementById('questionModal');
        const closeModal = document.getElementsByClassName('close')[0];
        const questionDiv = document.getElementById('question');
        const nextQuestionButton = document.getElementById('nextQuestion');
        const addFavoriteButton = document.getElementById('addFavorite');
        let currentCategory = '';
  
        const historyModal = document.getElementById('questionHistory');
        const closeHistoryModal = document.getElementsByClassName('close-history')[0];
        const historyList = document.getElementById('historyList');
        const viewHistoryButton = document.getElementById('viewHistory');
  
        const favoritesModal = document.getElementById('favoritesModal');
        const closeFavoritesModal = document.getElementsByClassName('close-favorites')[0];
        const favoritesList = document.getElementById('favoritesList');
        const viewFavoritesButton = document.getElementById('viewFavorites');
  
        const timerDisplay = document.getElementById('timerDisplay');
        const timerSpan = document.getElementById('timer');
        const startTimerButton = document.getElementById('startTimer');
  
        for (const category in categories) {
          const tile = document.createElement('div');
          tile.className = 'category-tile';
          tile.textContent = category;
          tile.addEventListener('click', () => openModal(category));
          categoryTiles.appendChild(tile);
        }
  
        // Add a tile for random category and question
        const randomTile = document.createElement('div');
        randomTile.className = 'category-tile';
        randomTile.textContent = 'Random Category';
        randomTile.addEventListener('click', () => openRandomModal());
        categoryTiles.appendChild(randomTile);
  
        closeModal.addEventListener('click', () => {
          modal.style.display = 'none';
          currentCategory = '';
        });
  
        nextQuestionButton.addEventListener('click', () => displayQuestion(currentCategory));
  
        viewHistoryButton.addEventListener('click', () => {
          historyModal.style.display = 'flex';
          updateHistoryList();
        });
  
        closeHistoryModal.addEventListener('click', () => {
          historyModal.style.display = 'none';
        });
  
        viewFavoritesButton.addEventListener('click', () => {
          favoritesModal.style.display = 'flex';
          updateFavoritesList();
        });
  
        closeFavoritesModal.addEventListener('click', () => {
          favoritesModal.style.display = 'none';
        });
  
        startTimerButton.addEventListener('click', () => startTimer());
  
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
            currentCategory = '';
          } else if (event.target == historyModal) {
            historyModal.style.display = 'none';
          } else if (event.target == favoritesModal) {
            favoritesModal.style.display = 'none';
          }
        };
  
        function openModal(category) {
          currentCategory = category;
          modal.style.display = 'flex';
          if (!questionsAsked[category]) {
            questionsAsked[category] = [];
          }
          displayQuestion(category);
        }
  
        function openRandomModal() {
          const categoriesArray = Object.keys(categories);
          const randomCategory = categoriesArray[Math.floor(Math.random() * categoriesArray.length)];
          openModal(randomCategory);
        }
  
        function displayQuestion(category) {
          const questions = categories[category];
          const askedQuestions = questionsAsked[category];
          const remainingQuestions = questions.filter(q => !askedQuestions.includes(q));
  
          if (remainingQuestions.length === 0) {
            questionDiv.textContent = 'No more questions in this category.';
          } else {
            const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
            const question = remainingQuestions[randomIndex];
            questionDiv.textContent = question;
            questionsAsked[category].push(question);
            questionHistory.push({ category, question });
          }
        }
  
        function updateHistoryList() {
          historyList.innerHTML = '';
          questionHistory.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. [${item.category}] ${item.question}`;
            historyList.appendChild(listItem);
          });
        }
  
        function addToFavorites() {
          const currentQuestion = questionDiv.textContent;
          if (currentQuestion && !favoriteQuestions.includes(currentQuestion)) {
            favoriteQuestions.push(currentQuestion);
          }
        }
  
        function updateFavoritesList() {
          favoritesList.innerHTML = '';
          favoriteQuestions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${question}`;
            favoritesList.appendChild(listItem);
          });
        }
  
        function startTimer() {
          let timeLeft = 30;
          timerSpan.textContent = timeLeft;
  
          clearInterval(timerInterval);
          timerInterval = setInterval(() => {
            timeLeft -= 1;
            timerSpan.textContent = timeLeft;
  
            if (timeLeft <= 0) {
              clearInterval(timerInterval);
              openRandomModal();
            }
          }, 1000);
        }
      });
  });
  