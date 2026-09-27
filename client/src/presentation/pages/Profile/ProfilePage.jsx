import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import InputField from '../../components/InputField/InputField';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  UserCheck
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();

  // Toast / feedback message
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete Account Dialog State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ----------------------------------------------------
  // PROFILE UPDATE HANDLERS
  // ----------------------------------------------------
  const validateProfileField = (name, value) => {
    let err = '';
    if (name === 'name') {
      const trimmed = value.trim();
      if (!trimmed) err = 'Name is required';
      else if (trimmed.length < 2) err = 'Name must be at least 2 characters';
    }
    if (name === 'email') {
      const trimmed = value.trim();
      if (!trimmed) err = 'Email is required';
      else {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(trimmed)) err = 'Please enter a valid email address';
      }
    }
    return err;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileTouched[name]) {
      setProfileErrors((prev) => ({
        ...prev,
        [name]: validateProfileField(name, value)
      }));
    }
  };

  const handleProfileBlur = (e) => {
    const { name, value } = e.target;
    setProfileTouched((prev) => ({ ...prev, [name]: true }));
    setProfileErrors((prev) => ({
      ...prev,
      [name]: validateProfileField(name, value)
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileTouched({ name: true, email: true });
    const nameErr = validateProfileField('name', profileData.name);
    const emailErr = validateProfileField('email', profileData.email);

    setProfileErrors({ name: nameErr, email: emailErr });
    if (nameErr || emailErr) return;

    setProfileLoading(true);
    try {
      await updateProfile({
        name: profileData.name.trim(),
        email: profileData.email.trim()
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // ----------------------------------------------------
  // CHANGE PASSWORD HANDLERS
  // ----------------------------------------------------
  const validatePasswordField = (name, value, currentForm = passwordData) => {
    let err = '';
    if (name === 'currentPassword') {
      if (!value) err = 'Current password is required';
    }
    if (name === 'newPassword') {
      if (!value) err = 'New password is required';
      else if (value.length < 8) err = 'New password must be at least 8 characters';
    }
    if (name === 'confirmPassword') {
      if (!value) err = 'Confirm password is required';
      else if (value !== currentForm.newPassword) err = 'Passwords do not match';
    }
    return err;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...passwordData, [name]: value };
    setPasswordData(updatedForm);

    if (passwordTouched[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: validatePasswordField(name, value, updatedForm)
      }));
    }
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    setPasswordTouched((prev) => ({ ...prev, [name]: true }));
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: validatePasswordField(name, value, passwordData)
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordTouched({ currentPassword: true, newPassword: true, confirmPassword: true });

    const currentErr = validatePasswordField('currentPassword', passwordData.currentPassword, passwordData);
    const newErr = validatePasswordField('newPassword', passwordData.newPassword, passwordData);
    const confirmErr = validatePasswordField('confirmPassword', passwordData.confirmPassword, passwordData);

    setPasswordErrors({ currentPassword: currentErr, newPassword: newErr, confirmPassword: confirmErr });
    if (currentErr || newErr || confirmErr) return;

    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordTouched({});
      setPasswordErrors({});
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  // ----------------------------------------------------
  // DELETE ACCOUNT HANDLERS
  // ----------------------------------------------------
  const handleDeleteAccountConfirm = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete account', 'error');
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Navbar />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold text-white animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* SECTION 1: PROFILE HEADER CARD */}
        <div
          className="p-6 sm:p-8 rounded-[24px] shadow-lg flex flex-col sm:flex-row items-center gap-6"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-black text-3xl sm:text-4xl text-white shadow-md flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {getInitial(user?.name)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {user?.name || 'User Profile'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                <UserCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* SECTION 2: EDIT PROFILE FORM */}
        <div
          className="p-6 sm:p-8 rounded-[24px] shadow-lg"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Account Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Update your personal display name and email address
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="profile-name"
                name="name"
                type="text"
                label="Full Name"
                value={profileData.name}
                onChange={handleProfileChange}
                onBlur={handleProfileBlur}
                error={profileTouched.name ? profileErrors.name : ''}
                leftIcon={User}
                disabled={profileLoading}
                required
              />

              <InputField
                id="profile-email"
                name="email"
                type="email"
                label="Email Address"
                value={profileData.email}
                onChange={handleProfileChange}
                onBlur={handleProfileBlur}
                error={profileTouched.email ? profileErrors.email : ''}
                leftIcon={Mail}
                disabled={profileLoading}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-all flex items-center gap-2 hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 3: CHANGE PASSWORD FORM */}
        <div
          className="p-6 sm:p-8 rounded-[24px] shadow-lg"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Security & Password
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} noValidate className="flex flex-col gap-4.5">
            {/* Current Password */}
            <InputField
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordTouched.currentPassword ? passwordErrors.currentPassword : ''}
              leftIcon={Lock}
              disabled={passwordLoading}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="p-1 rounded-lg hover:bg-purple-50 text-gray-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              }
            />

            {/* New Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="At least 8 characters"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={passwordTouched.newPassword ? passwordErrors.newPassword : ''}
                leftIcon={Lock}
                disabled={passwordLoading}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="p-1 rounded-lg hover:bg-purple-50 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                }
              />

              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={passwordTouched.confirmPassword ? passwordErrors.confirmPassword : ''}
                leftIcon={Lock}
                disabled={passwordLoading}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 rounded-lg hover:bg-purple-50 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                }
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-xs transition-all flex items-center gap-2 hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 4: DANGER ZONE - DELETE ACCOUNT */}
        <div
          className="p-6 sm:p-8 rounded-[24px] shadow-lg border border-red-200"
          style={{ backgroundColor: '#FFFDFD' }}
        >
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-red-100">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Irreversible account lifecycle management actions
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Account</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                This permanently deletes your account and cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </main>

      {/* Account Deletion Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? All your profile data will be removed and you will be logged out immediately."
        confirmText="Yes, Delete My Account"
        isDanger={true}
        isLoading={deleteLoading}
        onConfirm={handleDeleteAccountConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
