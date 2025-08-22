// src/components/NewConstruction.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import LocationSearch from "./LocationSearch";
import '../CSS/HomesForSale.css';
import Footer from "./Footer";

function NewConstruction() {
  const [allProperties, setAllProperties] = useState([]); // original data
  const [properties, setProperties] = useState([]);       // displayed data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/new_construction/");
        if (!res.ok) throw new Error("Failed to load properties");
        const data = await res.json();
        setAllProperties(data);
        setProperties(data);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p>Loading new construction properties...</p>;

  return (
    <>
      <Navbar/>
      <div className="homes-for-sale">
        <h2>New Construction Properties</h2>

        {/* Centered search */}
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <LocationSearch
            data={allProperties} // filter from original
            onSearch={(location) => {
              const filtered = allProperties.filter(prop => prop.location === location);
              setProperties(filtered);
            }}
          />
        </div>

        <div className="properties-list">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <div key={prop._id} className="property-card">
                <img src={prop.image_url} alt={prop.title} />
                <h3>{prop.title}</h3>
                <p><strong>Location:</strong> {prop.location}</p>
                <p><strong>Price:</strong> ₹{prop.price.toLocaleString()}</p>
                <p><strong>BHK:</strong> {prop.bhk}</p>
                <p><strong>Area:</strong> {prop.area} sqft</p>
                <p><strong>New Construction:</strong> {prop.is_new_construction ? 'Yes' : 'No'}</p>
                <p>{prop.description}</p>
                <Link to={`/property/${prop._id}`} className="view-details-btn">View Details</Link>
              </div>
            ))
          ) : (
            <p>No new construction properties found.</p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default NewConstruction;
