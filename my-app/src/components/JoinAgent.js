import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../CSS/JoinAgent.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function JoinAgent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "agent",        
    experience_years: "",
    price_range: "",
    profile_image: "",    
  });

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.experience_years || isNaN(form.experience_years)) {
      toast.error({ experience_years: ["Experience must be a number."] });
      toast.error("Error joining. Check below for details.");
      return;
    }

    axios.post(
      "http://localhost:8000/api/users/agent-finder/join/",
      { 
        ...form,
        experience_years: Number(form.experience_years)
      }
    )
    .then(() => {
      toast.success("Successfully joined as an agent!");
      setErrors({});
      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        role: "agent",
        experience_years: "",
        price_range: "",
        profile_image: "",
      });
    })
    .catch((err) => {
      console.log("Backend errors:", err.response?.data);
      setStatus("Error joining. Check below for details.");
      setErrors(err.response?.data || {});
    });
  };

  const goHome = () => navigate("/");

  return (
    <>
      <Navbar/>
      <div className="join-agent-container">
        <h2>Join as an Agent</h2>
        <form onSubmit={handleSubmit} className="join-agent-form">
          {["name","email","phone","location","experience_years","price_range","profile_image"].map(field => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace("_", " ").toUpperCase()}</label>
              <input
                id={field}
                name={field}
                placeholder={field.replace("_", " ").toUpperCase()}
                onChange={handleChange}
                value={form[field]}
                required
              />
              {errors[field] && <p className="error">{errors[field]}</p>}
            </div>
          ))}

          <button type="submit" className="submit-btn">Join</button>
        </form>

        {status && <p className={`status-message ${status.includes("Successfully") ? "success" : "error-status"}`}>{status}</p>}
      </div>
      <Footer/>
    </>
  );
}
