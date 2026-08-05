import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";

import "./InvestorTopbar.css";

function InvestorTopbar() {
  return (
    <header className="investor-topbar">
      <button
        type="button"
        className="investor-menu-button"
        aria-label="Open dashboard menu"
      >
        <FaBars />
      </button>

      <div className="investor-topbar-right">
        <button
          type="button"
          className="investor-notification-button"
          aria-label="Notifications"
        >
          <FaBell />
          <span>1</span>
        </button>

        <button
          type="button"
          className="investor-profile-button"
          aria-label="Open investor profile menu"
        >
          <FaUserCircle className="investor-profile-avatar" />

          <div className="investor-profile-text">
            <strong>Akash</strong>
            <span>ID: INV1234</span>
          </div>

          <FaChevronDown className="investor-profile-arrow" />
        </button>
      </div>
    </header>
  );
}

export default InvestorTopbar;