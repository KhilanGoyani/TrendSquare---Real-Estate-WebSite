import '../CSS/PropertyDetails.css';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from "./Navbar";
import Footer from "./Footer";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [landlordNumber, setLandlordNumber] = useState(null); 
  const [agents, setAgents] = useState([]);
  const [showAgents, setShowAgents] = useState(false); 
  const agentsRef = useRef(null); // ref for scrolling

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/properties/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch property details');
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Add property to My Listings
  const handleAddToListings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.error("You must be logged in to add listings.");
        return;
      }
      const response = await fetch("http://127.0.0.1:8000/api/users/my-listings/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, property_id: property._id }),
      });
      const data = await response.json();
      if (response.ok) toast.success("Added to My Listings!");
      else toast.error(data.error || "Something went wrong");
    } catch (err) {
      toast.error("Error adding to listings");
    }
  };

  // Show landlord number
  const handleShowLandlord = () => {
    const randomNumber = `+91-${Math.floor(6000000000 + Math.random() * 3999999999)}`;
    setLandlordNumber(randomNumber);
  };

  // Fetch agents by property location
  const handleHireAgent = async () => {
    try {
      if (!property?.location) return;
      const location = encodeURIComponent(property.location);
      const response = await fetch(`http://127.0.0.1:8000/api/users/agent-finder/find/?location=${location}`);
      if (!response.ok) throw new Error("Failed to fetch agents");

      const data = await response.json();
      const filteredAgents = data.filter(agent => agent.location.toLowerCase() === property.location.toLowerCase());

      if (filteredAgents.length === 0) {
        toast.info("No Agents Found in this location!");
        setShowAgents(false);
      } else {
        setAgents(filteredAgents);
        setShowAgents(true);

        // Scroll to agents section
        setTimeout(() => {
          agentsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Loading property details...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <>
      <Navbar/>
      <div className="property-details">
        <img 
          src={property.image_url} 
          alt={property.title} 
          style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} 
        />
        <h1>{property.title}</h1>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Price:</strong> ₹{property.price}</p>
        <p><strong>BHK:</strong> {property.bhk}</p>
        <p><strong>Area:</strong> {property.area} sqft</p>
        <p><strong>Description:</strong> {property.description}</p>

        <button className="add-button-listings" onClick={handleAddToListings}>
          Add to My Listings
        </button>
        <br /><br />

        <button className="landlord" onClick={handleShowLandlord}>
          LandLord
        </button>
        {landlordNumber && <p><strong>Contact:</strong> {landlordNumber}</p>}
        <br /><br />

        <button className="hire-agent-btn" onClick={handleHireAgent}>
          Hire an Agent
        </button>
      </div>

      {/* Agents Section */}
      {showAgents && agents.length > 0 && (
        <div className="agents-container" ref={agentsRef}>
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card">
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
              <button onClick={() => window.location.href=`/agent-finder/${agent.id}`}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      <Footer/>
    </>
  );
}

export default PropertyDetails;
