import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userPool from '../services/cognitoConfig';
import { CognitoUser } from 'amazon-cognito-identity-js';
import AuthContext from '../services/AuthContext';
import SimpleReactValidator from 'simple-react-validator'

const ChangePasswordPage = () => {

    const { user } = useContext(AuthContext); // Retrieve cognitoUser from context
    const { userAttributes } = useContext(AuthContext); // Retrieve user attributes from context
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState(null);
    const [cognitoUser, setCognitoUser] = useState(null);  // State to store CognitoUser
    
    // Initialize simple-react-validator
    const [validator] = useState(new SimpleReactValidator({
        validators: {
            passwordMatch: {  // Custom validator for matching passwords
                message: 'Passwords do not match.',
                rule: (val, params, validator) => {
                    return val === params[0]; // params[0] is newPassword passed in the validation rule
                },
                required: true,
            },
            passwordStrength: {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                rule: (val) => {
                    // Ensure at least: one lowercase letter, one uppercase leater, one number and one special character
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=-])/;
                    return regex.test(val);
                },
                required: true,
            },
        },
    }));

    // Force component to re-render after validation messages
    const [, forceUpdate] = useState();

    const navigate = useNavigate();

    useEffect(() => {
   
        if (user) {
            // Here you can use the cognitoUser object to complete the password change
            setCognitoUser(new CognitoUser({
                Username: user.username,
                Pool: userPool,
            }));
        } else {
            // Handle the case where there's no CognitoUser data (e.g., redirect back to login)
            navigate('/login');
        }
      }, []);


      const handleChangePassword = (event) => {
        event.preventDefault();
        console.log('entro aqui')

        if (validator.allValid()) {

            console.log('entro')
            console.log(user)
            console.log(user.Session)
            console.log(userAttributes)

            user.completeNewPasswordChallenge(newPassword, userAttributes, {

                onSuccess: (result) => {
                    console.log('Password changed successfully!', result);
                    navigate('/home'); // Redirect to home after success
                },
                onFailure: (err) => {
                    console.log('Problem changing password!', err);
                    setError(err.message || JSON.stringify(err));
                },
            });
        } else {
            console.log('entro al else')
            console.log(validator.allValid())
            console.log(validator.getErrorMessages())
            console.log(newPassword)
            console.log(confirmPassword)
            validator.showMessages(); // Show validation error messages
            forceUpdate(); // Force re-render to show validation messages
        }
    };

    const togglePassword = () => {
        setVisible(!visible);
    }
    
    return (
        <div id="search-page" className="center">
            <section className="content">
                <h1>Create password</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            
                <form onSubmit={handleChangePassword} className='repeat-password-form'>
                    <div className='formGroup'>
                        <label htmlFor="new-password">New Password</label>
                        
                        <input
                            type={visible ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onBlur={() => validator.showMessageFor('newPassword')}
                        />

                        <div className='show-password-container'>
                            <input type='checkbox' onChange={togglePassword}/>
                            <div>Show password</div>
                        </div>

                        {validator.message('newPassword', newPassword, 'required|passwordStrength|min:8')}
                    </div>
        
                    <div className='formGroup'>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            type={visible ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => validator.showMessageFor('confirmPassword')}
                        />
                        {validator.message('confirmPassword', confirmPassword, `required|passwordMatch:${newPassword}`)}
                    </div>
                    <button type="submit">Create password</button>
                </form>
            </section>
        </div>
    );
};
export default ChangePasswordPage;