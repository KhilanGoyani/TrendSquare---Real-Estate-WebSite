import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../CSS/SearchResults.css'; // Reuse existing styling
import Navbar from './Navbar';

function SearchResults() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(useLocation().search);
  const locationQuery = query.get('location');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/listings-by-location/?location=${locationQuery}`);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (locationQuery) fetchProperties();
  }, [locationQuery]);

  if (loading) return <p>Loading properties...</p>;
  if (!properties.length) return <p>No properties found in "{locationQuery}"</p>;

  return (<>
    <Navbar/>
    <div className="cozy-apartments">
      {properties.map((prop) => (
        <Link to={`/property/${prop._id}`} key={prop._id} className="property-card-link">
          <div className="property-card">
            <img src={prop.image_url} alt={prop.title} />
            <h3>{prop.bhk} BHK Apartment in {prop.location}</h3>
            <p>₹{prop.price?.toLocaleString() || 'N/A'} • {prop.bhk} BHK • {prop.area} sqft</p>
          </div>
        </Link>
      ))}
    </div>
    </>
  );
}

export default SearchResults;
