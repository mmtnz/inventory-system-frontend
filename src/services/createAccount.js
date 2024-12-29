import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userPool from './cognitoConfig';

const signUp = (email, password, name, lastName) => {
    console.log(`email ${email}`)
    console.log(`password ${password}`)
    console.log(`name ${name}`)
    return new Promise((resolve, reject) => {
        const attributeList = [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: 'name',
                Value: name,
            },
            {
                Name: 'family_name',
                Value: lastName,
            },
        ];
  
        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const confirmUser = (username, confirmationCode) => {
    return new Promise((resolve, reject) => {
        const userData = {
            Username: username,
            Pool: userPool,
        };
  
        const cognitoUser = new CognitoUser(userData);
  
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
  };

  
const resendConfirmationCode = (email) => {
    return new Promise((resolve, reject) => {
        const userData = {
            Username: email,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
        });
    });
};
  
  
export {signUp, confirmUser, resendConfirmationCode};