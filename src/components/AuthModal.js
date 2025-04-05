import React, { useState } from 'react';
import Modal from './Modal';
import dataService from '../components/DataService';
import { useNotification } from './NotificationContext';

export default function AuthModal({ onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !confirmPassword)) {
      addNotification({ type: 'warning', message: 'Please fill in all fields.' });
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      addNotification({ type: 'warning', message: 'Passwords do not match.' });
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await dataService.login({ email, password });
      } else {
        response = await dataService.signup({ email, password });
      }

      if (response.success) {
        addNotification({ type: 'info', message: isLogin ? 'Logged in successfully.' : 'Signed up successfully.' });
        await dataService.fetchUserPlants();
        onAuth({ email, uid: dataService.currentUserId });
        onClose();
      } else {
        addNotification({ type: 'error', message: 'An error occurred. Please try again.'});
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      addNotification({ type: 'error', message: 'Unexpected error, please try again.'});
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
        <div className="guest-login-section">
        <hr />
        <p style={{ textAlign: 'center', margin: '10px 0' }}>or</p>
        <button
          type="button"
          className="guest-login-btn"
          onClick={() => {
            onAuth({ mode: 'guest' });
            onClose();
          }}
        >
          Continue as Guest
        </button>
      </div>
        <button onClick={onClose} className="modal-close-btn">
          Close
        </button>
      </div>
    </Modal>
  );
}
