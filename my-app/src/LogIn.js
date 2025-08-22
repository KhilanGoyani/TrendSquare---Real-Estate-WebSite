// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Login({ onLogin }) {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     onLogin();              // Mark user as logged in
//     navigate('/');          // Redirect to home page
//   };

//   return (
//     <div className="auth-page">
//       <h1>This is Login Page</h1>
//       <button onClick={handleLogin}>Login</button>
//       <p>Don't have an account? <button onClick={() => navigate('/signup')}>Sign Up</button></p>
//     </div>
//   );
// }

// export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // ⏱ Countdown timer
  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  //  Format timer in MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  //  Send OTP API
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/send-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        alert("OTP sent to your email");
        setOtpSent(true);
        setTimeLeft(120);  // Start 2 min timer
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  //  Verify OTP API
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Login successful");
        onLogin();  // update login state in parent
        navigate('/');
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during OTP verification");
    }
  };

  return (
    <div className="auth-page">
      <h2>Login with OTP</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSendOtp}
        disabled={otpSent && timeLeft > 0}
      >
        {otpSent ? 'Resend OTP' : 'Send OTP'}
      </button>

      {/* Timer Display */}
      {otpSent && timeLeft > 0 && (
        <p>OTP valid for: {formatTime(timeLeft)}</p>
      )}

      {/* OTP Input & Verify */}
      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </p>
    </div>
  );
}

export default Login;
