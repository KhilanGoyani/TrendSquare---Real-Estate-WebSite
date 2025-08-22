
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import home from '../images/Home.png';
import buy from '../images/deal.png';
import sell from '../images/Sell.jpg';
import rent from '../images/Rent.jpg';
import Navbar from './Navbar';
import Footer from "./Footer";

function Home() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const scrollRowRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
  console.log("Listings fetched:", listings);
}, [listings]);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
  }, []);

  // Fetch property listings from backend API
    useEffect(() => {
      const fetchListings = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/users/listings/');
          if (!response.ok) {
            throw new Error('Failed to fetch listings');
          }
          const data = await response.json();
          console.log("Fetched data:", data);
          setListings(data);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchListings();
    }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info("You’ve been signed out.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 3);
    if (scrollRowRef.current) {
      scrollRowRef.current.scrollBy({ left: 1000, behavior: "smooth" });
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
        toast.error("Please enter a location");
        return;
    }
    navigate(`/search?location=${encodeURIComponent(searchInput)}`);
  };

  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const handlePredictionClick = () => {
    if (!loggedInUser) {
      toast.error("You must be logged in to get predictions.");
      return;
    }
    navigate("/prediction");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() !== "") {
      // Filter listings by input value
      const filtered = listings.filter(
        prop => prop.location && prop.location.toLowerCase().includes(value.toLowerCase())
      );

      // Extract unique locations
      const uniqueLocations = Array.from(
        new Set(filtered.map(prop => prop.location))
      ).slice(0, 5); // Limit to top 5 suggestions

      setSuggestions(uniqueLocations);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (prop) => {
    setSearchInput(prop.location); // or prop.title
    setSuggestions([]);
  };

  return (
    <>
      <Navbar/>

      {/* Hero Section with Background */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Home!!!</h1>
          <p>Buy, Rent or Sell properties across the country.</p>
          <div className="hero-search" >
            <input
              type="text"
              placeholder="Search address or ZIP"
              value={searchInput}
              onChange={handleInputChange}
            />
            <button
              className='hero-search-button'
              onClick={handleSearch}
            >
              Search
            </button>

            {suggestions.length > 0 && (
              <ul style={{
              }}>
                {suggestions.map((location, index) => (
              <li
                key={index}
                onClick={() => { setSearchInput(location); setSuggestions([]); }}
                style={{
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
              >
                {location}
              </li>
            ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="middle">
        {/* Top Section: Homes for You */}
        <div className="middle-text">
          <h1>Homes for You</h1>
          <p className="p-tag-home">Suggested as per you recently viewed.</p>
        </div>

        {/* Scrollable Property Row */}
        <div className="property-row-block">
          <div className="property-row-header">
            <button className="see-more-link" onClick={handleSeeMore}>
              See More Properties &gt;
            </button>
          </div>

          <div className="property-scroll-row" ref={scrollRowRef}>
            {loading ? (
              <p>Loading properties...</p>
            ) : listings.length === 0 ? (
              <p>No properties found.</p>
            ) : (
              listings.slice(0, visibleCount).map((prop) => (
                <Link to={`/property/${prop._id}`} key={prop._id} className="property-card-link">
                  <div className="property-card" key={prop._id}>
                    <img src={prop.image_url} alt={prop.title} className="card-image" />
                    <h3>{prop.bhk} BHK Apartment in {prop.location}</h3>
                    <p>₹{prop.price ? prop.price.toLocaleString() : 'N/A'} • {prop.bhk} BHK • {prop.area} sqft</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='predict'>
        <h1>Know predicted values for your liked home</h1>
        <p className='p-tag1'>Answer few questions.We'll predict the homes value.</p>
      </div>

      <div className="buyability-section">
        <div className="buyability-scroll">

          {/* Zillow Home Loans Box */}
          <div className="loan-info-card">
            <h1>Calculation</h1>
            <div className="loan-stats">
              <div>
                <strong>$ --</strong>
                <p>Suggested target price</p>
              </div>
              <div>
                <strong>$ --</strong>
                <p>BuyAbility<sup>SM</sup></p>
              </div>
              <div>
                <strong>--%</strong>
                <p>Today's rate</p>
              </div>
            </div>
            <Link to="/prediction">
              <button className="start-btn">Let's Get Predictions</button>
            </Link>

          </div>

          {/* Property Cards */}
          <div className="buyability-card">
            <div className="tag">Within BuyAbility</div>
            <img src="https://agoldbergphoto.com/wp-content/uploads/residential/Residential-13-scaled.jpg" alt="Home 1" />
            <div className="text-lines">
              <div className="line"></div>
              <div className="line short"></div>
            </div>
          </div>

          <div className="buyability-card">
            <div className="tag">Within BuyAbility</div>
            <img src="https://tse4.mm.bing.net/th/id/OIP.7ES3IdysiP-2BW2QL1eM0QHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Home 2" />
            <div className="text-lines">
              <div className="line"></div>
              <div className="line short"></div>
            </div>
          </div>

          <div className="buyability-card">
            <div className="tag">Within BuyAbility</div>
            <img src="https://tse2.mm.bing.net/th/id/OIP.TN5XXLzdjScXWizVct5JxwHaEk?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Home 3" />
            <div className="text-lines">
              <div className="line"></div>
              <div className="line short"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Three Cards Section */}
    <div className="three-cards-section">
      <div className="card">
        <img src={buy} alt="Buying a Home" style={{height: "210px"}} />
        <h3>Buy a Home</h3>
        <p>Explore homes for sale and find your dream property.</p>
        <a href="/buy/homes-for-sale">Explore</a>
      </div>

      <div className="card">
        <img src={rent} alt="Renting" style={{height: "210px"}} />
        <h3>Rent a Home</h3>
        <p>Discover spacious homes and apartments for rent.</p>
        <a href="/rent/spacious">Explore</a>
      </div>

      <div className="card">
        <img src={sell} alt="Selling" style={{height: "210px"}} />
        <h3>Sell a Home</h3>
        <p>Get tips and tools to sell your property effectively.</p>
        <a href="/sell/your-home">Explore</a>
      </div>
    </div>

      
      <Footer />
    </>
  );
}

export default Home;
