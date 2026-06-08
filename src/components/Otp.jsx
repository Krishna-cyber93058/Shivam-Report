import React, { useState } from 'react';

function Otp({ onVerify, onBack }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === '2026') {
      onVerify();
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="card-body">
          <h2 className="text-center mb-4">Enter OTP</h2>
          <p className="text-center text-muted mb-4">
            Please enter the OTP to access the dashboard.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                className="form-control text-center"
                style={{ fontSize: '1.5rem', letterSpacing: '0.25rem' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="••••"
                maxLength="4"
                required
              />
            </div>
            {error && <div className="error-message text-center">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block mt-4">
              Verify OTP
            </button>
            <button 
              type="button" 
              className="btn btn-block mt-3"
              style={{ backgroundColor: 'transparent', color: 'var(--text-muted)' }}
              onClick={onBack}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Otp;
