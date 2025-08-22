import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <h1>This is SignUp Page</h1>
      <p>Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>
    </div>
  );
}

export default SignUp;
