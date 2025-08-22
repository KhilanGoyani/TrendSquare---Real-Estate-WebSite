// src/components/Prediction.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../CSS/Prediction.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Prediction() {
  const [form, setForm] = useState({
    property_title: '',   // Optional
    location: '',
    total_area: '',       
    baths: '',
    balcony: '',
    bhk: '',
    property_type: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [user, setUser] = useState(null);

  // Check for signed-in user on load
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || savedUser.role !== "seller") {
      toast.error("Only sellers can predict price. Please sign in.");
    } else {
      setUser(savedUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return; // stop if no seller signed in

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/predict_price/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: form.location,
          bhk: parseFloat(form.bhk),
          baths: parseInt(form.baths),
          balcony: parseInt(form.balcony),
          total_area: parseFloat(form.total_area),
          property_type: form.property_type.toLowerCase()
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Prediction failed');

      toast.success("Prediction successful!");
      setPredictedPrice(data.predicted_price);

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (<>
    <Navbar/>
    <div className="prediction-container">


      <div className="prediction-form">
        <h2>Estimate Your Property Price</h2>
        <form onSubmit={handleSubmit}>
          <label>Location</label>
          <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />

          <label>Total Area (sqft)</label>
          <input name="total_area" type="number" placeholder="Total Area" value={form.total_area} onChange={handleChange} required />

          <label>BHK</label>
          <input name="bhk" type="number" placeholder="BHK" value={form.bhk} onChange={handleChange} required />

          <label>Bathrooms</label>
          <input name="baths" type="number" placeholder="Bathrooms" value={form.baths} onChange={handleChange} required />

          <label>Balcony</label>
          <input name="balcony" type="number" placeholder="Balcony" value={form.balcony} onChange={handleChange} required />

          <label>Property Type</label>
          <select name="property_type" value={form.property_type} onChange={handleChange} required>
            <option value="">-- Select Property Type --</option>
            <option value="Flat">Flat</option>
            <option value="Independent House">Independent House</option>
            <option value="Villa">Villa</option>
          </select>

          <button type="submit">Predict Price</button>
        </form>

        {predictedPrice && (
          <h3 className="predicted-price" style={{ marginTop: "20px" }}>
            Predicted Price: ₹{predictedPrice.toLocaleString()}
          </h3>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
