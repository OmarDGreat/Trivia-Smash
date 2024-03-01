import PropTypes from "prop-types";

function QuestionDisplay({ question, onAnswer }) {
  if (!question) return null; // or some loading indicator

  return (
    <div>
      <h2>{question.title}</h2>
      <div>
        {question.choices.map((choice, index) => (
          <button key={index} onClick={() => onAnswer(choice)}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

QuestionDisplay.propTypes = {
  question: PropTypes.shape({
    title: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  onAnswer: PropTypes.func.isRequired,
};

export default QuestionDisplay;
