import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HelpPage() {
  return (<>
    <Navbar/>
    <div style={styles.container}>
      <h1 style={styles.heading}>Help Center</h1>

      <p style={styles.description}>
        Find answers to your questions about buying, renting, selling, and more.
      </p>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search help articles"
          style={styles.searchInput}
        />
        <button style={styles.searchBtn}>Search</button>
      </div>

      {/* Categories Section */}
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Popular Topics</h2>
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3>Buying a Home</h3>
            <p>Learn about home buying process, mortgages, and tips.</p>
            <a href="/help/buying" style={styles.link}>Explore</a>
          </div>
          <div style={styles.card}>
            <h3>Renting a Home</h3>
            <p>Learn about rental agreements, deposits, and finding apartments.</p>
            <a href="/help/renting" style={styles.link}>Explore</a>
          </div>
          <div style={styles.card}>
            <h3>Selling a Home</h3>
            <p>Get tips on pricing, listing, and selling your property.</p>
            <a href="/help/selling" style={styles.link}>Explore</a>
          </div>
          <div style={styles.card}>
            <h3>Manage Rentals</h3>
            <p>Understand payments calculations, and viewyour listed properties.</p>
            <a href="/help/mortgages" style={styles.link}>Explore</a>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Quick Links</h2>
        <div style={styles.linksContainer}>
          <a href="/help/faq" style={styles.quickLink}>FAQ</a>
          <a href="/help/contact" style={styles.quickLink}>Contact Us</a>
          <a href="/help/guides" style={styles.quickLink}>Guides & Resources</a>
          <a href="/help/articles" style={styles.quickLink}>Articles & Tips</a>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "50px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  heading: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#2b6cb0",
    textAlign: "center"
  },
  description: {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#555",
    textAlign: "center"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px"
  },
  searchInput: {
    width: "400px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    marginTop: "15px"
  },
  searchBtn: {
    border: "none",
    backgroundColor: "#1a73e8",
    color: "#fff",
    borderRadius: "8 px",
    cursor: "pointer",
    margin: "17px 10px",
    width: "8%"
  },
  section: {
    marginBottom: "50px"
  },
  subHeading: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333"
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "220px",
    textAlign: "center"
  },
  link: {
    marginTop: "10px",
    display: "inline-block",
    color: "#1a73e8",
    textDecoration: "none",
    fontWeight: "bold"
  },
  linksContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center"
  },
  quickLink: {
    backgroundColor: "#fff",
    padding: "15px 25px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#1a73e8",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  }
};
