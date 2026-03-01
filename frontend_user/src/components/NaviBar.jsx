import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/");
  };

  useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${showNav ? "nav-show" : "nav-hide"}`}>
        <div className="nav-left">
          <h2 className="logo">Travel<span>System</span></h2>
        </div>

        <div className="nav-center">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/Packages">Packages</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="profile-trigger" onClick={() => setSidebarOpen(true)}>
              <div className="avatar-circle-navibar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </nav>

      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)}>
        <div className={`side-menu ${sidebarOpen ? "slide" : ""}`} onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>&times;</button>
          
          <div className="user-profile-info">
            <div className="large-avatar">
               {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3>{user?.username || "User Name"}</h3>
            <p>{user?.email || "user@example.com"}</p>
            <span className="badge">{user?.accountType || "Member"}</span>
          </div>

          <hr className="divider" />

          <div className="side-links">
            <Link to="/userprofile" onClick={() => setSidebarOpen(false)}>My Profile</Link>
            <Link to="/tripplan" onClick={() => setSidebarOpen(false)}>AI Trip Planner</Link>
            <Link to="/mytripplans" onClick={() => setSidebarOpen(false)}>My Trip Plans</Link>
            <Link to="/mybooking" onClick={() => setSidebarOpen(false)}>My Bookings</Link>
            {user?.accountType === "business" && (
              <Link to="/businesstools" onClick={() => setSidebarOpen(false)}>Business Tools</Link>
            )}
            <Link to="/settings" onClick={() => setSidebarOpen(false)}>Settings</Link>
          </div>

          <hr className="divider" />

          <button onClick={handleLogout} className="sidebar-logout">Logout</button>
        </div>
      </div>
    </>
  );
}