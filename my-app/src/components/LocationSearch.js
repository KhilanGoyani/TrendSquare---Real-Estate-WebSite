// src/components/LocationSearch.js
import React, { useState } from "react";

export default function LocationSearch({ data, onSearch }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() !== "") {
      // Filter properties that match search input
      const filtered = data.filter(
        (prop) =>
          prop.location &&
          prop.location.toLowerCase().includes(value.toLowerCase())
      );

      // Deduplicate locations
      const uniqueLocations = Array.from(
        new Set(filtered.map((prop) => prop.location))
      ).slice(0, 5); // max 5 suggestions

      setSuggestions(uniqueLocations);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (location) => {
    setSearchInput(location);
    setSuggestions([]);
    onSearch(location);
  };

  const handleSearchClick = () => {
    setSuggestions([]);
    onSearch(searchInput);
  };

  return (
    <div style={{ position: "relative", display: "flex", width: "400px" }}>
      <input
        type="text"
        placeholder="Search by location..."
        value={searchInput}
        onChange={handleInputChange}
        style={{
          flex: 1,
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={handleSearchClick}
        style={{
          marginLeft: "8px",
          padding: "8px 16px",
          border: "none",
          backgroundColor: "#1a73e8",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
          height: "2.3rem",
        }}
      >
        Search
      </button>

      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            zIndex: 9999,
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {suggestions.map((location) => (
            <li
              key={location}
              onClick={() => handleSuggestionClick(location)}
              style={{
                padding: "8px",
                cursor: "pointer",
                color: "#000",
                borderBottom: "none",
                backgroundColor: "#fff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              {location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
