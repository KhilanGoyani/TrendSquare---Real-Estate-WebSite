// src/components/HomesForSale.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import '../CSS/HomesForSale.css';
import Navbar from "./Navbar";
import LocationSearch from "./LocationSearch";
import Footer from "./Footer";

function HomesForSale() {
  const [allProperties, setAllProperties] = useState([]); // keep original data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users/homes_for_sale/");
      setAllProperties(res.data); // store original
      setProperties(res.data);    // set displayed
    } catch (error) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <>
      <Navbar/>
      <div className="homes-for-sale">
        <h2>Homes For Sale</h2>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <LocationSearch
            data={allProperties} // use original data
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
                <p>{prop.description}</p>
                <p><strong>New Construction:</strong> {prop.is_new_construction ? 'Yes' : 'No'}</p>
                <Link to={`/property/${prop._id}`} className="view-details-btn">View Details</Link>
              </div>
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HomesForSale;
