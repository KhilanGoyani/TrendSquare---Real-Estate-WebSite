
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../App.css'; // make sure this file exists and contains CSS

function SignIn() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0); // for resend countdown
  const navigate = useNavigate();

  // Countdown timer logic
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // Send OTP function
  const sendOtp = async () => {
    if (!email) {
      toast.warning('Please enter your email');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/users/send-otp/', { email });
      toast.success('OTP sent to your email!');
      setStep(2);
      setTimer(120); // Set timer to 30 seconds
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  // Resend OTP function
  const resendOtp = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/send-otp/', { email });
      toast.success('OTP resent successfully!');
      setTimer(120);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Resend failed');
    }
  };

  // Verify OTP function
  const verifyOtp = async () => { 
  if (!otp) {
    toast.warning('Please enter OTP');
    return;
  }

  try {
    const res = await axios.post('http://localhost:8000/api/users/verify-otp/', { email, otp });

    // merge email with backend response
    const userData = {
      ...res.data,
      email: email
    };

    localStorage.setItem('user', JSON.stringify(userData));

    toast.success(`Welcome, ${userData.username} (${userData.role})`);
    navigate('/');
  } catch (err) {
    toast.error(err.response?.data?.error || 'OTP verification failed');
  }
};

  return (
    <div className="auth-page">
      <h2>Sign In with Email OTP</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>

          <p>
            Didn't get the OTP?{' '}
            <button onClick={resendOtp} disabled={timer > 0}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </button>
          </p>
        </>
      )}

      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default SignIn;
