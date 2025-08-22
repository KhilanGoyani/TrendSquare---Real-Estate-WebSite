import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../CSS/MyListings.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MyListings() {
  const [propertyListings, setPropertyListings] = useState([]);
  const [rentalListings, setRentalListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userEmail = storedUser?.email;

  useEffect(() => {
    if (!storedUser) {
      toast.error("You must be logged in to view listings");
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      try {
        // Property listings
        const propertyRes = await axios.get(
          `http://127.0.0.1:8000/api/users/my-listings/?email=${userEmail}`
        );
        setPropertyListings(propertyRes.data);

        // Rental listings
        const rentalRes = await axios.get(
          `http://127.0.0.1:8000/api/users/my-rental-listings/?email=${userEmail}`
        );
        setRentalListings(rentalRes.data);

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userEmail]);

  // Property payment
  const handlePropertyPayment = async (listingId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/users/my-listings/payment/${listingId}/`
      );
      toast.success("Property payment confirmed!");
      setPropertyListings(prev =>
        prev.map(l =>
          l.listing_id === listingId ? { ...l, payment_status: "paid" } : l
        )
      );
    } catch (err) {
      toast.error("Failed to confirm property payment");
    }
  };

  // Rental payment
  const handleRentalPayment = async (userRentalId) => {
    if (!userRentalId) {
      toast.error("Invalid rental listing ID");
      return;
    }
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/users/my-rental-listings/payment/${userRentalId}/`
      );
      toast.success("Rental payment confirmed!");
      setRentalListings(prev =>
        prev.map(r =>
          r.listing_id === userRentalId ? { ...r, payment_status: "paid" } : r
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Rental payment failed");
    }
  };

  // Remove handlers
  const removePropertyListing = async (listingId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/users/my-listings/remove/${listingId}/`,
        { params: { email: userEmail } }
      );
      setPropertyListings(prev => prev.filter(l => l.listing_id !== listingId));
      toast.success("Property removed!");
    } catch (err) {
      toast.error("Failed to remove property listing");
    }
  };

  const removeRentalListing = async (userRentalId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/users/my-rental-listings/remove/${userRentalId}/`,
        { params: { email: userEmail } }
      );
      setRentalListings(prev => prev.filter(r => r.listing_id !== userRentalId));
      toast.success("Rental removed!");
    } catch (err) {
      toast.error("Failed to remove rental listing");
    }
  };

  if (loading) return <p>Loading your listings...</p>;

  return (
    <>
      <Navbar />
      <div className="my-listings">

        {/* Property Listings */}
        <h1>My Property Listings</h1>
        {propertyListings.length === 0 ? (
          <p>No property listings yet.</p>
        ) : (
          <div className="listings-grid">
            {propertyListings.map((listing) => (
              <div key={listing.listing_id} className="listing-card">
                <img src={listing.image_url} alt={listing.title} style={{ width: "250px", height: "200px", objectFit: "cover",margin: "20px", borderRadius: "10px" }} />
                <h2>{listing.title}</h2>
                <p><strong>Location:</strong> {listing.location}</p>
                <p><strong>Price:</strong> ₹{listing.price}</p>
                <p><strong>BHK:</strong> {listing.bhk}</p>
                <p><strong>Area:</strong> {listing.area} sqft</p>

                {listing.payment_status === "paid" ? (
                  <button disabled style={{ backgroundColor: "green", color: "white" }}>Paid</button>
                ) : (
                  <button onClick={() => handlePropertyPayment(listing.listing_id)} style={{ backgroundColor: "#2b6cb0", color: "white" }}>Payment</button>
                )}

                <button onClick={() => removePropertyListing(listing.listing_id)} style={{ backgroundColor: "red", color: "white" }}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {/* Rental Listings */}
        <h1>My Rental Listings</h1>
        {rentalListings.length === 0 ? (
          <p>No rental listings yet.</p>
        ) : (
          <div className="listings-grid">
            {rentalListings.map((rental) => (
              <div key={rental.listing_id} className="listing-card">
                <img src={rental.image_url} alt={rental.title} style={{ width: "250px", height: "200px", objectFit: "cover",margin: "20px", borderRadius: "10px" }} />
                <h2>{rental.title}</h2>
                <p><strong>Location:</strong> {rental.location}</p>
                <p><strong>Rent:</strong> ₹{rental.rent_price} / month</p>
                <p><strong>BHK:</strong> {rental.bhk}</p>
                <p><strong>Area:</strong> {rental.area} sqft</p>

                {rental.payment_status === "paid" ? (
                  <button disabled style={{ backgroundColor: "green", color: "white" }}>Paid</button>
                ) : (
                  <button onClick={() => handleRentalPayment(rental.listing_id)} style={{ backgroundColor: "#2b6cb0", color: "white" }}>Payment</button>
                )}

                <button onClick={() => removeRentalListing(rental.listing_id)} style={{ backgroundColor: "red", color: "white" }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
