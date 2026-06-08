import React, { useState } from 'react';

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId === '9696249510' && password === '9696') {
      onLogin();
    } else {
      setError('Invalid UserID or Password');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="card-body">
          <h2 className="text-center mb-4">Accuprobe Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="userId">UserID</label>
              <input
                type="text"
                id="userId"
                className="form-control"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter UserID"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
