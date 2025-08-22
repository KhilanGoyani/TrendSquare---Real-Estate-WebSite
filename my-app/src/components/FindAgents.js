import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../CSS/FindAgents.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function FindAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // for redirect

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/agent-finder/find/")
      .then((res) => {
        setAgents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const goHome = () => {
    navigate("/"); // redirect to home
  };

  if (loading) return <p className="loading-text">Loading agents...</p>;

  return (<>
    <Navbar/>
    <div className="agents-container">
      <h2 className="sub-header">Find Real Estate Agents</h2>
      <div className="agents-list">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <img
              src={agent.profile_image}
              alt={agent.name}
              className="agent-image"
            />
            <div className="agent-info">
              <h3>{agent.name}</h3>
              <p>{agent.location}</p>
              <p>Experience: {agent.experience_years} years</p>
              <p>Price Range: ₹{agent.price_range}</p>
              <Link to={`/agent-finder/${agent.id}`} className="details-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}
