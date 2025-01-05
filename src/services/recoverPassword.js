import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from './cognitoConfig';

const forgotPassword = (username) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

const updatePassword = (username, verificationCode, newPassword) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
  
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve('Password reset successful.');
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };
    

export {forgotPassword, updatePassword};
