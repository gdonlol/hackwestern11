import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogoClick = () => setShowDropdown((prev) => !prev);

  return (
    <div className="header">
      <h1>ArtMentor</h1>
      <div className="auth-controls">
        {!isAuthenticated ? (
          <button className="login-logout-btn btn" onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
        <div className="authenticated">
            <img
              src={user?.picture || "/default-avatar.png"}
              alt="User"
              className="logo"
              onClick={handleLogoClick}
            />
            {showDropdown && (
              <div className="dropdown">
                <button className="btn">View Profile</button>
              </div>
            )}
            <button className="login-logout-btn btn" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;