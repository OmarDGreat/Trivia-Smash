// components/Button.jsx
import PropTypes from 'prop-types';

const Button = ({ children, onClick, variant = 'primary', ...props }) => {
  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
};

export default Button;
