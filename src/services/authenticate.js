import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userPool from './cognitoConfig';
// import { useNavigate } from "react-router-dom";
import { apiSendRefreshToken } from "./api";


const signIn = async (email, password) => {
  
  const user = new CognitoUser({
    Username: email,
    Name: email,
    Pool: userPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  // const navigate = useNavigate();
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {

        // Store the access token in memory or session storage
        sessionStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
        // Store refresh token in https cookies
        apiSendRefreshToken(session.getRefreshToken().getToken());
        
        resolve({session, cognitoUser: user}); // Return the session on success
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
       
        // Filter out non-writable attributes
        // const writableAttributes = { ...userAttributes };
        userAttributes.name = userAttributes.email;
        delete userAttributes.email;
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;
        delete userAttributes.sub; // Sub is the unique ID and is non-writable
        
        resolve({ userAttributes, requiredAttributes, cognitoUser: user, newPasswordRequired: true });
      },
      onFailure: (err) => {
        console.error('Error signing in:', err);
        reject(err); // Return the error on failure
      },
    });
  });
};

export {signIn};

