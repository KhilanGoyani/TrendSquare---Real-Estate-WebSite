import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSignOut = () => {
    localStorage.removeItem("user");
    toast.info("You’ve been signed out.");
    navigate("/"); // redirect to home
  };

  if (!user) {
    navigate("/signin"); // redirect if not logged in
    return null;
  }

  return (<>
    <Navbar/>
    <div style={styles.container}>
      <h1 style={styles.heading}>My Profile</h1>
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Profile"
        style={styles.profileImage}
      />

      <div style={styles.infoContainer}>
        <p style={styles.info}><strong>User Name:</strong> {user.username}</p>
        <p style={styles.info}><strong>Email:</strong> {user.email}</p>
        <p style={styles.info}><strong>Role:</strong> {user.role}</p>
      </div>

      <button style={styles.signOutBtn} onClick={handleSignOut}>Sign Out</button>
    </div>
    <Footer/>
    </>
  );
}

// Internal CSS
const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  heading: {
    marginBottom: "30px",
    color: "#2b6cb0"
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginBottom: "20px",
    objectFit: "cover",
    border: "3px solid #1a73e8"
  },
  infoContainer: {
    marginBottom: "30px"
  },
  info: {
    fontSize: "18px",
    margin: "8px 0",
    color: "#555"
  },
  signOutBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  }
};
