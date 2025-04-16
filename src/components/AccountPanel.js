import React, { useState, useEffect } from 'react';
import dataService from './DataService';
import { useNotification } from './NotificationContext';

const BASE_URL = "https://supreme-tomcat-heartily.ngrok-free.app";

export default function AccountPanel() {
  const { addNotification } = useNotification();
  
  const uid = dataService.currentUserId;
  const isGuest = dataService.isGuestMode();

  const [userData, setUserData] = useState(null);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!uid || isGuest) return;
    fetchAccountInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, isGuest]);

  async function fetchAccountInfo() {
    try {
      const response = await fetch(`${BASE_URL}/api/account/${uid}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (!response.ok) {
        throw new Error('Failed to load user account info');
      }
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
      } else {
        addNotification({ type: 'error', message: data.message || 'Could not fetch account data.' });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error fetching account info.' });
    }
  }

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
        fetchAccountInfo();
      } else {
        addNotification({ type: 'error', message: result.message || 'Failed to update email.' });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error updating email.' });
    }
  };

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
      } else {
        addNotification({ type: 'error', message: result.message || 'Failed to update password.' });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error updating password.' });
    }
  };

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
        // TODO: logout
        // window.location.reload() or dataService.reset()
      } else {
        addNotification({ type: 'error', message: result.message || 'Failed to delete account.' });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error deleting account.' });
    }
  };

  function formatCreationDate(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString();
  }

  return (
    <div className="account-container">
      <h2 className="section-title">Account Settings</h2>

      {isGuest && (
        <div style={{ marginBottom: '20px', color: '#555' }}>
          You are in guest mode. Account modifications are disabled.
        </div>
      )}

      {!isGuest && userData && (
        <div className="account-info">
          <p><strong>Current Email:</strong> {userData.email}</p>
          <p><strong>Account Created:</strong> {formatCreationDate(userData.createdAt)}</p>
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
          className="account-input"
        />
        <button onClick={handleChangeEmail} disabled={isGuest} className="account-btn">
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
          className="account-input"
        />
        <button onClick={handleChangePassword} disabled={isGuest} className="account-btn">
          Update Password
        </button>
      </div>

      <div className="account-section">
        <h3>Delete Account</h3>
        <button
          onClick={handleDeleteAccount}
          disabled={isGuest}
          className="account-delete-btn"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
