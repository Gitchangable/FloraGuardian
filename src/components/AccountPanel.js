// src/components/AccountPanel.js
import React, { useState, useEffect } from 'react';
import dataService from './DataService';
import { useNotification } from './NotificationContext';

export default function AccountPanel() {
  const { addNotification } = useNotification();
  const uid = dataService.currentUserId;
  const isGuest = dataService.isGuestMode();

  // This holds the user's Firestore profile (email, randomNumber, etc.)
  const [accountInfo, setAccountInfo] = useState(null);

  // These track form values for changing email/password
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Use the same ngrok URL as in DataService
  const BASE_URL = 'https://supreme-tomcat-heartily.ngrok-free.app';

  // -----------------------------
  // Fetch the user’s profile info
  // -----------------------------
  useEffect(() => {
    if (!uid || isGuest) return; // No need to fetch if no user or in guest mode

    const fetchAccountInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/account/${uid}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const result = await response.json();
        if (result.success) {
          setAccountInfo(result.profile);
        } else {
          addNotification({ type: 'error', message: result.message || 'Failed to fetch account info.' });
        }
      } catch (err) {
        addNotification({ type: 'error', message: 'Error fetching account info.' });
      }
    };

    fetchAccountInfo();
  }, [uid, isGuest, addNotification, BASE_URL]);

  // -----------------------------
  // Change Email
  // -----------------------------
  const handleChangeEmail = async () => {
    if (!newEmail) {
      addNotification({ type: 'warning', message: 'Please enter a new email address.' });
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/account/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ uid, newEmail }),
      });
      const result = await response.json();
      if (result.success) {
        addNotification({ type: 'success', message: 'Email updated successfully.' });
        setNewEmail('');
      } else {
        addNotification({ type: 'error', message: result.message });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error updating email.' });
    }
  };

  // -----------------------------
  // Change Password
  // -----------------------------
  const handleChangePassword = async () => {
    if (!newPassword) {
      addNotification({ type: 'warning', message: 'Please enter a new password.' });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/account/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ uid, newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        addNotification({ type: 'success', message: 'Password updated successfully.' });
        setNewPassword('');
      } else {
        addNotification({ type: 'error', message: result.message });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error updating password.' });
    }
  };

  // -----------------------------
  // Delete Account
  // -----------------------------
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action is irreversible.'
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/api/account/${uid}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const result = await response.json();
      if (result.success) {
        addNotification({ type: 'success', message: 'Account deleted successfully.' });
        // Possibly trigger a logout or redirect here
      } else {
        addNotification({ type: 'error', message: result.message });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error deleting account.' });
    }
  };

  return (
    <div className="account-container">
      <h2 className="section-title">Account Settings</h2>

      {/* If Guest Mode, disable everything */}
      {isGuest && (
        <div style={{ marginBottom: '20px', color: '#555' }}>
          You are in guest mode. Account modifications are disabled.
        </div>
      )}

      {/* Show Current Account Info */}
      {accountInfo && (
        <div className="account-info">
          <p><strong>Current Email:</strong> {accountInfo.email}</p>
          <p><strong>Example Data:</strong> {accountInfo.exampleData}</p>
          <p><strong>Random Number:</strong> {accountInfo.randomNumber}</p>
          {accountInfo.createdAt && (
            <p><strong>Joined On:</strong> {new Date(accountInfo.createdAt).toLocaleString()}</p>
          )}
        </div>
      )}

      <div className="account-section">
        <h3>Change Email</h3>
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          disabled={isGuest}
        />
        <button onClick={handleChangeEmail} disabled={isGuest}>
          Update Email
        </button>
      </div>

      <div className="account-section">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isGuest}
        />
        <button onClick={handleChangePassword} disabled={isGuest}>
          Update Password
        </button>
      </div>

      <div className="account-section">
        <h3>Delete Account</h3>
        <button
          onClick={handleDeleteAccount}
          disabled={isGuest}
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: isGuest ? 'not-allowed' : 'pointer',
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
