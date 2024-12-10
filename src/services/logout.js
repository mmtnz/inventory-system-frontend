import userPool from './cognitoConfig'; // Your Cognito configuration
import { apiDeleteRefreshToken } from './api';

export const logout = async () => {
    const cognitoUser = userPool.getCurrentUser();

    try {
        if (cognitoUser) {
            // Call Cognito's signOut method
            cognitoUser.signOut();
        }
        
        // Clear refresh token from http cookie
        await apiDeleteRefreshToken();

        // Clear session storage
        sessionStorage.clear();

    } catch (err) {
        console.log(err.response.status);
    }
}