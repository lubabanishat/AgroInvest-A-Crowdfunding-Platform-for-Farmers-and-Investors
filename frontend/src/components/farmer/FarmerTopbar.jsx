import {
  FaBell,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";

import "./FarmerTopbar.css";

function FarmerTopbar({ farmer }) {
  const farmerName =
    farmer?.full_name || "Farmer";

  const farmerId =
    farmer?.id
      ? `FAR${String(farmer.id).padStart(4, "0")}`
      : "FAR0000";

  const firstLetter =
    farmerName.charAt(0).toUpperCase();

  return (
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
          aria-label="Notifications"
        >
          <FaBell />

          <span className="notification-badge">
            1
          </span>
        </button>

        <div className="farmer-user">

          <div className="farmer-avatar">
            {firstLetter}
          </div>

          <div className="farmer-user-info">
            <strong>
              {farmerName}
            </strong>

            <span>
              ID: {farmerId}
            </span>
          </div>

          <FaChevronDown className="farmer-arrow" />

        </div>

      </div>

    </header>
  );
}

export default FarmerTopbar;