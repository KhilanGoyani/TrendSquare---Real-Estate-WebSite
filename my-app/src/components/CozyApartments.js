import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import '../CSS/CozyApartments.css'; // Use HomesForSale CSS for styling
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CozyApartments() {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/users/rent_listings/?min_bhk=1&max_bhk=2");
        if (!response.ok) throw new Error("Failed to fetch rent listings");
        const data = await response.json();
        setAllListings(data);
        setFilteredListings(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRentListings();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      const uniqueLocations = Array.from(
        new Set(
          allListings
            .filter(prop => prop.location.toLowerCase().includes(value.toLowerCase()))
            .map(prop => prop.location)
        )
      );
      setSuggestions(uniqueLocations.slice(0, 5));
    } else {
      setSuggestions([]);
      setFilteredListings(allListings);
    }
  };

  const handleSuggestionClick = (location) => {
    const filtered = allListings.filter(
      prop => prop.location.toLowerCase() === location.toLowerCase()
    );
    setFilteredListings(filtered);
    setSearchTerm(location);
    setSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setFilteredListings(allListings);
      return;
    }
    const filtered = allListings.filter(
      prop => prop.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(filtered);
    setSuggestions([]);
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="homes-for-sale">
        <h2>Cozy Apartments</h2>

        {/* Search like HomesForSale */}
        <div className="search-bar" style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button onClick={handleSearch}>Search</button>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((location, index) => (
                <li key={index} onClick={() => handleSuggestionClick(location)}>
                  {location}
                </li>
              ))}
            </ul>
          )}
        </div>


        {/* Properties list */}
        <div className="properties-list">
          {filteredListings.length > 0 ? (
            filteredListings.map((prop) => (
              <div key={prop.id} className="property-card">
                <img src={prop.image_url} alt={prop.title} />
                <h3>{prop.title}</h3>
                <p><strong>Location:</strong> {prop.location}</p>
                <p><strong>Rent:</strong> ₹{prop.rent_price.toLocaleString()}</p>
                <p><strong>BHK:</strong> {prop.bhk}</p>
                <p><strong>Area:</strong> {prop.area} sqft</p>
                <Link to={`/rental-details/${prop.id}`} className="view-details-btn">View Details</Link>
              </div>
            ))
          ) : (
            <p>No listings found.</p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
