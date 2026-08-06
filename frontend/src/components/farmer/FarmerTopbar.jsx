import {
  FaBell,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";

import "./FarmerTopbar.css";

function FarmerTopbar() {
  return (
    <>
      {/* Top White Bar */}
      <header className="farmer-topbar">

        <button
          className="farmer-menu-button"
          type="button"
          aria-label="Open Menu"
        >
          <FaBars />
        </button>

        <div className="farmer-topbar-right">

          <button
            className="farmer-notification"
            type="button"
          >
            <FaBell />

            <span className="notification-badge">
              1
            </span>
          </button>

          <div className="farmer-user">

            <div className="farmer-avatar">
              R
            </div>

            <div className="farmer-user-info">
              <strong>Rahim</strong>

              <span>ID: FAR1234</span>
            </div>

            <FaChevronDown className="farmer-arrow" />

          </div>

        </div>

      </header>
    </>
  );
}

export default FarmerTopbar;