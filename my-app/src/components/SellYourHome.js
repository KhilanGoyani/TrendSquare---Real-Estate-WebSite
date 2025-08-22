// src/components/SellYourHome.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/SellYourHome.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SellYourHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    bhk: '',
    area: '',
    image_url: '',
    is_new_construction: false,
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'seller') {
      toast.error("Only sellers can add a property.");
      navigate('/signin'); 
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/listings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to add property.");

      toast.success("Property added successfully!");
      navigate('/'); 
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Navbar/>

      <div className="sell-home-form">
        <h1>Sell Your Home</h1>
        <form onSubmit={handleSubmit}>
          <label>Property Title</label>
          <input type='text' name="title" placeholder="Property Title" value={formData.title} onChange={handleChange} required/>

          <label>Location</label>
          <input type='text' name="location" placeholder="Location" value={formData.location} onChange={handleChange} required/>

          <label>Price</label>
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required/>

          <label>BHK</label>
          <input type="number" name="bhk" placeholder="BHK" value={formData.bhk} onChange={handleChange} required/>

          <label>Total Area (sq.ft)</label>
          <input type="number" name="area" placeholder="Total Area" value={formData.area} onChange={handleChange} required/>

          <label>Image URL</label>
          <input type='text' name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} required/>

          <label className="checkbox-label">
            <input type="checkbox" name="is_new_construction" checked={formData.is_new_construction} onChange={handleChange} />
            New Construction
          </label>

          <button type="submit" className="submit-btn">Add Property</button>
        </form>
      </div>
      <Footer/>
    </>
  );
}
