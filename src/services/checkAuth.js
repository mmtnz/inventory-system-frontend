// import userPool from './cognitoConfig';
// import { CognitoUserSession } from 'amazon-cognito-identity-js';
// import { useContext } from 'react';
// import AuthContext from './AuthContext';

// export const checkAuth = async () => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = userPool.getCurrentUser();
//     const { user } = useContext(AuthContext); // Retrieve cognitoUser from context

//     // Already log-in
//     if (cognitoUser) {
//       cognitoUser.getSession((err, session) => {
//         if (err || !session.isValid()) {
//           reject('Not authenticated');
//         } else {
//           // Verificar el estado NEW_PASSWORD_REQUIRED
//           const idToken = session.getIdToken().payload;

//           if (idToken['cognito:amr'] === 'NEW_PASSWORD_REQUIRED') {
//             resolve({ session, newPasswordRequired: true });
//           } else {
//             resolve({ session, newPasswordRequired: false });
//           }
//         }
//       });
//     // } else if (user) {
//     //     resolve({ session, newPasswordRequired: false });
//     } else {
//         reject('No user found');
//     }
//   });
// };












// import userPool from "./cognitoConfig";

// export const checkAuth = async () => {
//     try {
        
//         const cognitoUser = userPool.getCurrentUser();
        
//         if (cognitoUser) {
//             return new Promise((resolve, reject) => {
//                 cognitoUser.getSession((err, session) => {
//                     if (err || !session.isValid()) {
//                         reject('Not authenticated');
//                     } else {
//                         resolve(session);
//                     }
//                 });
//             });
//         } else {
//             throw new Error('No user found');
//         }
//         } catch (error) {
//             throw new Error('Not authenticated');
//         }
// };
