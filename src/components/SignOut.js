import React from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthContext from '../services/AuthContext';  // Assuming you have a context to manage user state
// import { CognitoUserPool } from 'amazon-cognito-identity-js';
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
import { useTranslation } from 'react-i18next';
import { apiDeleteRefreshToken } from '../services/api';


const SignOut = () => {

    const navigate = useNavigate();
    const { t } = useTranslation('login'); // Load translations from the 'login' namespace
    

    const handleLogout = async () => {
        const cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            await logOutAndDeleteCredentials(cognitoUser);
        } else {
            console.error('No user is currently signed in.');
        }

        // Redirect to login or home page after logout
        navigate('/login');
    };

    const logOutAndDeleteCredentials = async (cognitoUser) => {
        try {

            // Call Cognito's signOut method
            cognitoUser.signOut();

            // Clear refresh token from http cookie
            const accessToken = sessionStorage.getItem('accessToken')
            await apiDeleteRefreshToken(accessToken);

            // Clear session storage
            sessionStorage.clear();

        } catch (err) {
            console.log(err.response.status);
        }
    }

    return (
        <div onClick={handleLogout} className='header-icon-container hover-container'>
            <span className="material-symbols-outlined">
                logout
            </span>
            <div className='hover-text'>
                {t('signOut')}
            </div>
        </div>
    )
}
export default SignOut;