import { colorSchemes } from "../ColorSchemes";
import PropTypes from "prop-types";
const ColorModal = ({ isOpen, onClose, changeColorScheme }) => {
  if (!isOpen) {
    return null;
  }

  const applyScheme = (colors) => {
    changeColorScheme(colors);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Change Color Scheme</h2>
        <div className="schemes-grid">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.name}
              className="scheme-card"
              style={{ backgroundColor: scheme.colors["--background-color2"] }}
              onClick={() => applyScheme(scheme.colors)}
            >
              <div
                className="color-preview"
                style={{ backgroundColor: scheme.colors["--primary-color"] }}
              />
              <h3>{scheme.name}</h3>
            </div>
          ))}
        </div>
        <button className="boton mt-5" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ColorModal;
ColorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  changeColorScheme: PropTypes.func.isRequired,
};
