import React, { createContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user or cognitoUser
    const [userAttributes, setUserAttributes] = useState(null);
    const [passwordChangeRequired, setPasswordChangeRequired] = useState(false); // Track if password change is required

    return (
        <AuthContext.Provider value={
            {
                user, setUser,
                userAttributes, setUserAttributes,
                passwordChangeRequired, setPasswordChangeRequired
            }
        }>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
