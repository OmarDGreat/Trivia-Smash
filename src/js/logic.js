var currentQuestionIndex = 0;
var time = 0; // Time will be calculated dynamically based on the questions array length
var timerId;

// DOM element references
var questionsEl = $("#questions");
var timerEl = $("#time");
var choicesEl = $("#choices");
var submitBtn = $("#submit");
var startGeo = $("#start-geo");
var startMath = $("#start-math");
var startEng = $("#start-eng");
var startHis = $("#start-his");
var startMusic = $("#start-music");
var initialsEl = $("#initials");
var feedbackEl = $("#feedback");

function startQuiz() {
  // hide start screen
  var startScreenEl = $("#start-screen");
  startScreenEl.attr("hidden", true);

  // un-hide questions section
  questionsEl.removeAttr("hidden");

  // Start timer
  time = geographyQuestions.length * 15; // Adjust time based on the selected category
  timerEl.text(time); // Display initial time

  // Start the timer countdown
  timerId = setInterval(function() {
    time--;
    timerEl.text(time);
    if (time <= 0) {
      clearInterval(timerId);
      // Handle time's up scenario
    }
  }, 1000);

  // Populate questions for the selected category
  populateQuestions('geo'); // Default to geography questions when starting quiz
}

function populateQuestions(category) {
  var questionsArray;
  switch (category) {
    case 'geo':
      questionsArray = geographyQuestions;
      break;
    case 'math':
      questionsArray = mathQuestions;
      break;
    case 'eng':
      questionsArray = englishQuestions;
      break;
    case 'his':
      questionsArray = historyQuestions;
      break;
    case 'music':
      questionsArray = musicQuestions;
      break;
    default:
      questionsArray = [];
  }

  // Randomly select a question from the array
  var randomIndex = Math.floor(Math.random() * questionsArray.length);
  var question = questionsArray[randomIndex];

  // Display the question on the page
  $('#question-title').text(question.title);
  $('#choices').empty(); // Clear previous choices if any

  // Display choices
  question.choices.forEach(function(choice, index) {
    var choiceElement = $('<button>').addClass('choice').attr('value', choice).text(choice);
    $('#choices').append(choiceElement);
  });
}

// Event handlers for category buttons
startGeo.on("click", function() {
  startQuiz();
  populateQuestions('geo');
});

startMath.on("click", function() {
  startQuiz();
  populateQuestions('math');
});

startEng.on("click", function() {
  startQuiz();
  populateQuestions('eng');
});

startHis.on("click", function() {
  startQuiz();
  populateQuestions('his');
});

startMusic.on("click", function() {
  startQuiz();
  populateQuestions('music');
});

// Add event listeners for choice selection, submit button, etc.
