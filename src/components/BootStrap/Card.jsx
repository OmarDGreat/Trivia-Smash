// components/Card.jsx
import PropTypes from 'prop-types';

const Card = ({ title, text, children }) => {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {text && <p className="card-text">{text}</p>}
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
