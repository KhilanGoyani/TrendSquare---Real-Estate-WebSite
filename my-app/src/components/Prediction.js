// src/components/Prediction.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../CSS/Prediction.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

function Prediction() {
  const [formData, setFormData] = useState({
    property_type: "",
    location: "",
    bhk: "",
    baths: "",
    balcony: "",
    total_area: "",  // renamed from sqft to total_area
  });

  const [predictedPrice, setPredictedPrice] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");  // or however you store auth token
    
    if (!user) {
      toast.error("Please sign in to predict the price."+e);
      return;  // stop further execution
    }
    try {
      // Convert numeric inputs to numbers before sending
      const payload = {
        ...formData,
        bhk: Number(formData.bhk),
        baths: Number(formData.baths),
        balcony: Number(formData.balcony),
        total_area: Number(formData.total_area),
      };

      const res = await axios.post(
        "http://localhost:8000/api/users/predict_price/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user}`,   // send token if your backend expects it
          },
        }
      );
      setPredictedPrice(res.data.predicted_price);
      toast.success("Prediction successful!");
    } catch (error) {
      console.error("Prediction API error:", error.response || error.message);
      toast.error("Prediction failed. Check inputs or server.");
    }
  };

  return (<>
    <Navbar/>
    <div>

      {/* Prediction Form */}
      <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
        <h2>Predict Property Price</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="property_type">Property Type</label>
          <select
            id="property_type"
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Property Type --</option>
            <option value="Flat">Flat</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
          </select>



          <label>Location</label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>BHK</label>
          <input
            name="bhk"
            type="number"
            value={formData.bhk}
            onChange={handleChange}
            required
          />

          <label>Bathrooms</label>
          <input
            name="baths"
            type="number"
            value={formData.baths}
            onChange={handleChange}
            required
          />

          <label>Balcony</label>
          <input
            name="balcony"
            type="number"
            value={formData.balcony}
            onChange={handleChange}
            required
          />

          <label>Square Feet</label>
          <input
            name="total_area"   // changed name here
            type="number"
            value={formData.total_area}  // and here
            onChange={handleChange}
            required
          />

          <button type="submit">Predict Price</button>
        </form>

        {predictedPrice && (
          <h3 style={{ marginTop: "20px" }}>
            Predicted Price: ₹{predictedPrice.toLocaleString()}
          </h3>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Prediction;
