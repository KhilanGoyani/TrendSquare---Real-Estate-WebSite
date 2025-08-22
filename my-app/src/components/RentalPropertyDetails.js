import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import '../CSS/RentalPropertyDetails.css';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RentalPropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [landlordNumber, setLandlordNumber] = useState(null);
  const [agents, setAgents] = useState([]);
  const [showAgents, setShowAgents] = useState(false);
  const agentsRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/users/rent_listings/${id}/`);
        setProperty(res.data);
      } catch (err) {
        toast.error("Failed to fetch property details");
      }
    };
    fetchProperty();
  }, [id]);

  const addRentalListing = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return toast.error("You must be logged in");

    try {
      await axios.post(`http://127.0.0.1:8000/api/users/my-rental-listings/add/`, {
        email: storedUser.email,
        rental_id: property.id
      });
      toast.success("Rental added to your listings!");
    } catch (err) {
      toast.error("Failed to add listing");
    }
  };

  const handleLandlord = () => {
    const randomNumber = `+91-${Math.floor(6000000000 + Math.random() * 3999999999)}`;
    setLandlordNumber(randomNumber);
  };

  const handleHireAgent = async () => {
    try {
      if (!property?.location) return;

      const res = await axios.get(`http://127.0.0.1:8000/api/users/agent-finder/find/?location=${property.location}`);
      const filteredAgents = res.data.filter(
        agent => agent.location.toLowerCase() === property.location.toLowerCase()
      );

      if (filteredAgents.length === 0) {
        toast.info("No Agents Found in this location!");
        setShowAgents(false);
      } else {
        setAgents(filteredAgents);
        setShowAgents(true);
        setTimeout(() => agentsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (err) {
      toast.error("Failed to fetch agents");
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="property-details">
        <img src={property.image_url} alt={property.title} />
        <h1>{property.title}</h1>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>BHK:</strong> {property.bhk}</p>
        <p><strong>Rent:</strong> ₹{property.rent_price}</p>
        <p><strong>Area:</strong> {property.area} sqft</p>
        <p><strong>Description:</strong> {property.description || "No description"}</p>
        <button className="add-button-listings" onClick={addRentalListing}>Add to Listings</button><br /><br />
        <button className="landlord" onClick={handleLandlord}>LandLord</button>
        {landlordNumber && <p><strong>Contact:</strong> {landlordNumber}</p>}<br /><br />
        <button className="hire-agent-btn" onClick={handleHireAgent}>Hire an Agent</button>
      </div>

      {showAgents && agents.length > 0 && (
        <div className="agents-container" ref={agentsRef}>
          {agents.map(agent => (
            <div key={agent.id} className="agent-card">
              <img
                src={agent.profile_image || (agent.gender === 'male'
                  ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
                  : 'https://cdn-icons-png.flaticon.com/512/194/194938.png')}
                alt={agent.name}
              />
              <h3>{agent.name}</h3>
              <p><strong>Location:</strong> {agent.location}</p>
              <p><strong>Experience:</strong> {agent.experience_years} years</p>
              <p><strong>Price Range:</strong> ₹{agent.price_range}</p>
              <button onClick={() => window.location.href = `/agent-finder/${agent.id}`}>View Details</button>
            </div>
          ))}
        </div>
      )}
      <Footer/>
    </>
  );
}
