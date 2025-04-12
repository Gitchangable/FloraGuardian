import React, { useState } from 'react';
import dataService from './DataService';
import { useNotification } from './NotificationContext';

export default function AccountPanel() {
  const { addNotification } = useNotification();
  const uid = dataService.currentUserId;

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // IMPORTANT: adjust the base URL if needed
  const BASE_URL = 'http://localhost:5000';

  const handleChangeEmail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/account/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, newEmail }),
      });
      const result = await response.json();
      if (result.success) {
        addNotification({ type: 'success', message: 'Email updated successfully.' });
      } else {
        addNotification({ type: 'error', message: result.message });
      }
    } catch (err) {
      addNotification({ type: 'error', message: 'Error updating email.' });
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/account/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, newPassword }),
      });
      const result = await response.json();
      if (result.success) {
        addNotification({ type: 'success', message: 'Password updated successfully.' });
      } else {
        addNotification({ type: 'error', message: result.message });
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
      });
      const result = await response.json();
      if (result.success) {
        addNotification({ type: 'success', message: 'Account deleted successfully.' });
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

      <div className="account-section">
        <h3>Change Email</h3>
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleChangeEmail}>Update Email</button>
      </div>

      <div className="account-section">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Update Password</button>
      </div>

      <div className="account-section">
        <h3>Delete Account</h3>
        <button 
          onClick={handleDeleteAccount} 
          style={{ backgroundColor: '#f44336', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
