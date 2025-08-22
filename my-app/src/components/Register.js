import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Add this at the top
import { useNavigate } from 'react-router-dom';

const allowedRoles = ['buyer', 'seller', 'agent'];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allowedRoles.includes(form.role)) {
      toast.error('Invalid role selected');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/users/register/', form);
      toast.success(res.data.message);
      setTimeout(() => {
        navigate('/SignIn');
      }, 2000); // wait 1 second before redirecting

    } catch (err) {
      toast.error(err.response.data.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register as Buyer / Seller / Agent</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="agent">Agent</option>
        </select>
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/signin">Back to Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
