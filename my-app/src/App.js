// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/Home';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Help from './components/Help';
import PropertyDetails from './components/PropertyDetails';
import Prediction from './components/Prediction';
import HomesForSale from './components/HomesForSale';
import NewConstruction from './components/NewConstruction';
import CozyApartments from './components/CozyApartments';
import AddRental from './components/AddRental';
import RentalPropertyDetails from './components/RentalPropertyDetails';
import SpaciousHomes from './components/SpaciousHomes';
import SellYourHome from './components/SellYourHome';
import Zestimate from './components/Zestimate';

// Agent Finder Components
import FindAgents from './components/FindAgents';
import JoinAgent from './components/JoinAgent';
import AgentDetail from './components/AgentDetail';
import ContactAgent from './components/ContactAgent';
import MyListings from './components/MyListings';
// import Payments from './components/Payments';
import SearchResults from './components/SearchResults';
import PaymentCalculator from "./components/PaymentCalculator";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/help" element={<Help />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/buy/homes-for-sale" element={<HomesForSale />} />
        <Route path="/buy/new-construction" element={<NewConstruction />} />
        <Route path="/rent/cozy" element={<CozyApartments />} />
        <Route path="/rental-details/:id" element={<RentalPropertyDetails />} />
        <Route path="/rent/spacious" element={<SpaciousHomes />} />
        <Route path="/rent/add" element={<AddRental />} />
        <Route path="/sell/your-home" element={<SellYourHome />} />
        <Route path="/sell/home-value" element={<Zestimate />} />

        {/* Agent Finder Routes */}
        <Route path="/agent-finder/find" element={<FindAgents />} />
        <Route path="/agent-finder/join" element={<JoinAgent />} />
        <Route path="/agent-finder/:agent_id" element={<AgentDetail />} />
        <Route path="/agent-finder/:agent_id/contact" element={<ContactAgent />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/manage-rentals/listening" element={<MyListings />} />
        {/* <Route path="/payments" element={<Payments />} /> */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/manage-rentals/payment" element={<PaymentCalculator />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
