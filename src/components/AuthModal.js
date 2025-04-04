import React, { useState } from 'react';
import Modal from './Modal';
import dataService from '../components/DataService';

export default function AuthModal({ onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic field checks
    if (!email || !password || (!isLogin && !confirmPassword)) {
      alert('Please fill in all fields.');
      return;
    }
    // Password match check on Sign Up
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      // Call DataService methods depending on the mode:
      let response;
      if (isLogin) {
        response = await dataService.login({ email, password });
      } else {
        response = await dataService.signup({ email, password });
      }

      // Handle the response returned by DataService
      if (response.success) {
        alert(isLogin ? 'Logged in successfully!' : 'Signed up successfully!');
        onAuth({ email });
        onClose();
      } else {
        alert(response.errorMessage || 'An error occurred. Please try again.');
      }
    } catch (error) {
      // Catch any unexpected error from DataService or fetch
      console.error('Unexpected error:', error);
      alert('Unexpected error, please try again.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="auth-modal">
        <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </label>
          <label className="auth-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </label>
          {!isLogin && (
            <label className="auth-label">
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                required
              />
            </label>
          )}
          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-toggle">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="auth-toggle-btn">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="auth-toggle-btn">
                Log In
              </button>
            </p>
          )}
        </div>
        <button onClick={onClose} className="modal-close-btn">
          Close
        </button>
      </div>
    </Modal>
  );
}
