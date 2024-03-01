import PropTypes from 'prop-types';

function TopicSelector({ onSelectTopic }) {
  const topics = ["geography", "math", "english", "history", "music"];
  return (
    <div>
      {topics.map(topic => (
        <button key={topic} onClick={() => onSelectTopic(topic)}>
          {topic.charAt(0).toUpperCase() + topic.slice(1)}
        </button>
      ))}
    </div>
  );
}

TopicSelector.propTypes = {
  onSelectTopic: PropTypes.func.isRequired,
};

export default TopicSelector;
