import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";

import "./InvestorTopbar.css";

function InvestorTopbar() {
  /* =========================
     GET LOGGED-IN USER
  ========================= */

  const getStoredUser = () => {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "InvestorTopbar user parse error:",
        error
      );

      return null;
    }
  };

  const user = getStoredUser();

  const investorName =
    user?.full_name || "Investor";

  const investorId =
    user?.id
      ? `INV${String(user.id).padStart(4, "0")}`
      : "INV0000";

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
            <strong>
              {investorName}
            </strong>

            <span>
              ID: {investorId}
            </span>
          </div>

          <FaChevronDown className="investor-profile-arrow" />
        </button>
      </div>
    </header>
  );
}

export default InvestorTopbar;