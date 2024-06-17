let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let questionsTaken = 0;
let answers = [];

document.addEventListener("DOMContentLoaded", function() {
    fetch('questions2.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            shuffle(questions);
            showQuestion();
        });
});

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById('quiz-container').innerHTML = 'Quiz completed!';
        document.getElementById('next-button').disabled = true;
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionText = document.createElement('p');
    questionText.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
    questionDiv.appendChild(questionText);

    const options = Object.entries(questionData.options);
    shuffle(options);

    options.forEach(([key, value]) => {
        const optionLabel = document.createElement('label');
        optionLabel.textContent = ` ${value}`;

        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.value = key;

        optionLabel.prepend(optionInput);
        questionDiv.appendChild(optionLabel);
        questionDiv.appendChild(document.createElement('br'));
    });

    quizContainer.appendChild(questionDiv);
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const answer = selectedOption.value;
        const questionData = questions[currentQuestionIndex];
        if (answer === questionData.answer) {
            score++;
        }
        answers.push({
            question: questionData.question,
            selected: answer,
            correct: questionData.answer
        });
        questionsTaken++;
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert('Please select an option!');
    }
    updateResult();
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    questionsTaken = 0;
    answers = [];
    shuffle(questions);
    showQuestion();
    document.getElementById('next-button').disabled = false;
    updateResult();
}

function reviewAnswers() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    answers.forEach((answer, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${answer.question}`;
        questionDiv.appendChild(questionText);

        for (const [key, value] of Object.entries(questions[index].options)) {
            const optionText = document.createElement('p');
            optionText.textContent = `   ${value}`;
            if (key === answer.correct) {
                optionText.classList.add('correct-answer');
            }
            if (key === answer.selected && key !== answer.correct) {
                optionText.classList.add('incorrect-answer');
            }
            questionDiv.appendChild(optionText);
        }

        quizContainer.appendChild(questionDiv);
    });
}

function updateResult() {
    const result = document.getElementById('result');
    result.innerHTML = `Questions Taken: ${questionsTaken}, Correct Answers: ${score}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
