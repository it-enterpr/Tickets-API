import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { profile } = useUser();

    return (
        <div className="profile-page">
            <div className="profile-card">
                <FaUserCircle className="profile-icon" />
                <h1>{profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}` : t('userProfileTitle')}</h1>
                <div className="profile-details">
                    <p><strong>{t('firstName')}:</strong> {profile.firstName || t('notProvided')}</p>
                    <p><strong>{t('lastName')}:</strong> {profile.lastName || t('notProvided')}</p>
                    <p><strong>{t('phone')}:</strong> {profile.phone || t('notProvided')}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;