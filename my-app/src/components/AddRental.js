import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AddRentalProperty() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent_price: "",
    bhk: "",
    area: "",
    image_url: "",
    is_new_construction: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/add-rental-listing/",
        formData
      );

      toast.success(response.data.message);

      setFormData({
        title: "",
        location: "",
        rent_price: "",
        bhk: "",
        area: "",
        image_url: "",
        is_new_construction: false,
      });

    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Error adding rental property";
      toast.error(errorMsg);
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <h1 style={{ textAlign: "center", color: "#2b6cb0" }}>Rent Your Home</h1>
      <form onSubmit={handleSubmit} className="rental-form">
        <label>Property Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        <label>Rent Price (per month)</label>
        <input type="number" name="rent_price" value={formData.rent_price} onChange={handleChange} required />

        <label>BHK</label>
        <input type="number" name="bhk" value={formData.bhk} onChange={handleChange} required />

        <label>Total Area (sq.ft)</label>
        <input type="number" name="area" value={formData.area} onChange={handleChange} required />

        <label>Image URL</label>
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} required />

        <label className="checkbox-label">
          <input type="checkbox" name="is_new_construction" checked={formData.is_new_construction} onChange={handleChange} />
          New Construction
        </label>

        <button type="submit" className="submit-btn">Add Rental Property</button>
      </form>
      <Footer/>
    </>
  );
}
