import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/AgentDetail.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AgentDetail() {
  const { agent_id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/agent-finder/${agent_id}/`)
      .then((res) => setAgent(res.data))
      .catch(() => toast.error("Error fetching agent details"));
  }, [agent_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContact = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8000/api/users/agent-finder/${agent_id}/contact/`, formData)
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        console.log(err.response?.data);
        toast.error(err.response?.data?.error || "Error sending message.");
      });
  };

  const goHome = () => navigate("/");

  if (!agent) return <p className="loading-text">Loading...</p>;

  return (<>
      <Navbar/>

    <div className="agent-detail-container">
      <div className="agent-detail-card">
        <h2>{agent.name}</h2>
        <img src={agent.profile_image} alt={agent.name} className="agent-image"/>
        <p>Location: {agent.location}</p>
        <p>Experience: {agent.experience_years} years</p>
        <p>Price Range: ₹{agent.price_range}</p>
        <p>Email: {agent.email}</p>
        <p>Phone: {agent.phone}</p>

        <h3>Contact {agent.name}</h3>
        <form onSubmit={handleContact} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="send-btn">Send Message</button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}
