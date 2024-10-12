import userPool from './cognitoConfig'; // Your Cognito configuration

export const logout = async () => {
    const cognitoUser = userPool.getCurrentUser();

    try {
        if (cognitoUser) {
            // Call Cognito's signOut method
            cognitoUser.signOut();
        }
        
        // Clear refresh token from http cookie
        // const accessToken = sessionStorage.getItem('accessToken')
        // await apiDeleteRefreshToken(accessToken);

        // Clear session storage
        sessionStorage.clear();

    } catch (err) {
        console.log(err.response.status);
    }
}