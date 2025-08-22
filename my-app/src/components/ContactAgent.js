import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // import useNavigate
import '../CSS/ContactAgent.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ContactAgent({ agentId }) {
  const navigate = useNavigate(); // initialize navigate

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:8000/api/users/contact-agent/${agentId}/contact/`,
        formData
      );
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (<>
    <Navbar />
    <div className="contact-agent-container">
      <div className="contact-form-wrapper">
        <h2>Contact Agent</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="send-btn">Send</button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}
