
import home from '../images/Home.png';

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar(){
  const [user, setUser] = useState(null);

     useEffect(() => {
        const data = localStorage.getItem('user');
        if (data) setUser(JSON.parse(data));
      }, []);
    return (<>
    <nav className="navbar">
        <div className="navbar-container">
          {/* Left: Nav Links with Dropdowns */}
          <div className="navbar-left">
            <div className="dropdown">
                <a href="/buy" className="dropbtn">Buy</a>
                <div className="dropdown-content">
                  <a href="/buy/homes-for-sale">Homes for Sale</a>
                  <a href="/buy/new-construction">New Construction</a>
                </div>
            </div>
            <div className="dropdown">
              <a href="/rent" className="dropbtn">Rent</a>
              <div className="dropdown-content">
                <a href="/rent/cozy">Cozy Apartments</a>
                <a href="/rent/spacious">Spacious Homes</a>
                <a href="/rent/add">Add Rental Homes</a>
              </div>
            </div>
            <div className="dropdown">
              <a href="/sell" className="dropbtn">Sell</a>
              <div className="dropdown-content">
                <a href="/sell/your-home">Sell Your Home</a>
                <a href="/sell/home-value">See Your Home's Zestimate</a>
              </div>
            </div>
            <div className="dropdown">
              <a href="/agent-finder" className="dropbtn">Agent Finder</a>
              <div className="dropdown-content">
                <a href="/agent-finder/find">Find Agents</a>
                <a href="/agent-finder/join">Join as Agent</a>
              </div>
            </div>
          </div>

          {/* Center: Website Name */}
          <div className="navbar-center-title">
            <a href="/" className="navbar-logo-title"><img src={home} alt="Logo" style={{width: "200px",height: "auto",objectFit: "contain",display: "block",margin: "0 auto" }}></img></a>
          </div>

          <div className="navbar-right">
            <div className="dropdown">
              <a href="/manage-rentlas" className="dropbtn">Manage Rentals</a>
              <div className="dropdown-content">
                <a href="/manage-rentals/listening">My Listening</a>
                <a href="/manage-rentals/payment">Payments</a>
              </div>
            </div>
            <a href="/help">Help</a>
          </div>

          {user ? (
            <Link to="/profile" className="signin-btn">
              <span className="user-icon">&#128100;</span> Profile
            </Link>
          ) : (
            <Link to="/signin" className="signin-btn">
              <span className="user-icon">&#128100;</span> Sign In
            </Link>
          )}

        </div>
      </nav></>)
}
export default Navbar