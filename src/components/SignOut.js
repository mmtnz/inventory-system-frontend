import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../services/AuthContext';  // Assuming you have a context to manage user state
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
import { useTranslation } from 'react-i18next';


const SignOut = () => {

    const { setUser } = useContext(AuthContext); // Assuming AuthContext manages user authentication state
    const { setUserAttributes } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation('login'); // Load translations from the 'login' namespace
    

    const handleLogout = () => {
        const cognitoUser = userPool.getCurrentUser();
        console.log(cognitoUser)

        if (cognitoUser) {
            // Call Cognito's signOut method
            cognitoUser.signOut();

            // Clear any local application state related to user
            setUser(null);  // Clear the user from context or state
            setUserAttributes(null);

            // Redirect to login or home page after logout
            navigate('/login');
        } else {
            console.error('No user is currently signed in.');
        }
    };

    return (
        <div onClick={handleLogout} className='header-icon-container hover-container'>
            <span className="material-symbols-outlined">
                logout
            </span>
            <div className='hover-text'>
                {t('s')}
            </div>
        </div>
    )
}
export default SignOut;