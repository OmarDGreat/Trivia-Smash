import PropTypes from 'prop-types';

function ScoreDisplay({ playerScore, opponentScore, opponentName }) {
  return (
    <div>
      <h3>Your score: {playerScore}</h3>
      <h3>Opponent ({opponentName}) score: {opponentScore}</h3>
    </div>
  );
}

ScoreDisplay.propTypes = {
  playerScore: PropTypes.number.isRequired,
  opponentScore: PropTypes.number.isRequired,
  opponentName: PropTypes.string.isRequired,
};

export default ScoreDisplay;
