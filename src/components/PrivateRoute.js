import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../services/AuthContext";
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
// import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { user, passwordChangeRequired } = useContext(AuthContext); // Access user and password change flag from AuthContext
    const cognitoUser = userPool.getCurrentUser();
    console.log(cognitoUser)

    // If password change is required, redirect to the password change page
    if (user && passwordChangeRequired) {
        return <Navigate to="/new-password" />;
    }

    // If not authenticated, redirect to login
    if (!cognitoUser) {
        return <Navigate to="/login" />;
    }

    // Otherwise, allow access to the requested page
    return <Element {...rest}/>;
};

export default PrivateRoute;


// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { checkAuth } from '../services/checkAuth'; // Importa la función de autenticación

// const PrivateRoute = ({ element: Element, ...rest }) => {
//   const [authStatus, setAuthStatus] = React.useState({
//     loading: true,
//     isAuthenticated: false,
//     newPasswordRequired: false,
//   });

//   React.useEffect(() => {
//     const verifyAuth = async () => {
//       try {
//         const result = await checkAuth();
//         console.log(result)
//         setAuthStatus({
//           loading: false,
//           isAuthenticated: true,
//           newPasswordRequired: result.newPasswordRequired,
//         });
//       } catch (error) {
//         console.log(error)
//         setAuthStatus({
//           loading: false,
//           isAuthenticated: false,
//           newPasswordRequired: false,
//         });
//       }
//     };

//     verifyAuth();
//   }, []);

//   if (authStatus.loading) {
//     return <div>Loading...</div>;
//   }

//   if (authStatus.isAuthenticated && authStatus.newPasswordRequired) {
//     return <Navigate to="/new-password" />;
//   }

//   if (!authStatus.isAuthenticated) {
//     return <Navigate to="/login"  />;
//   }

//   return <Element {...rest}/>;
// };

// // export default PrivateRoute;

// //   return (
// //     isAuthenticated ? <Component {...rest}/> : <Navigate to="/login" state={{ from: location }} />

// //   );
// // };

// export default PrivateRoute;
