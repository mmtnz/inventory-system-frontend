import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import userPool from '../services/cognitoConfig';
// import { CognitoUser } from 'amazon-cognito-identity-js';
import AuthContext from '../services/AuthContext';
import SimpleReactValidator from 'simple-react-validator'
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import {messagesObj} from '../schemas/messages';

const ChangePasswordPage = () => {

    const { user } = useContext(AuthContext); // Retrieve cognitoUser from context
    const { userAttributes } = useContext(AuthContext); // Retrieve user attributes from context
    const { setUser } = useContext(AuthContext);
    const { setUserAttributes } = useContext(AuthContext);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    

    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
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
   
        if(!user){
            navigate('/login');
        }
      }, []);


      const handleChangePassword = async (event) => {
        event.preventDefault();

        if (validator.allValid()) {
            setIsLoading(true);
            try {
                await createPassword();
                console.log('despues change')
                // Clear any local application state related to user (only used for creating new password)
                setUser(null);  
                setUserAttributes(null);
                console.log('antes navigate')
                Swal.fire(messagesObj[t('locale')].passwordUpdated)
                navigate('/home'); // Redirect to home after success
            } catch (err) {
                console.log('Problem changing password!', err);
                setError(err.message || JSON.stringify(err));
                setIsLoading(false)
            }
        } else {
            console.log('problema validator')
            validator.showMessages(); // Show validation error messages
            forceUpdate(); // Force re-render to show validation messages
        }
    };


    const createPassword = async () => {
        return new Promise((resolve, reject) => {
            user.completeNewPasswordChallenge(newPassword, userAttributes, {
                onSuccess: (result) => {
                    console.log('Password changed successfully!', result);
                    resolve();
                    // setConfirmPassword(false);
                },
                onFailure: (err) => {
                    reject(err)
                },
            });
        });
    }


    const togglePassword = () => {
        setVisible(!visible);
    }
    
    return (
        <div id="search-page" className="center">
            <section className="content">
                <h1>{t('createPassword')}</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            
                <form onSubmit={handleChangePassword} className='change-password-form'>
                    <div className='formGroup'>
                        <label htmlFor="new-password">{t('newPassword')}</label>
                        
                        <input
                            type={visible ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onBlur={() => validator.showMessageFor('newPassword')}
                        />

                        

                        {validator.message('newPassword', newPassword, 'required|passwordStrength|min:8')}
                    </div>
        
                    <div className='formGroup'>
                        <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                        <input
                            type={visible ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder={t('confirmPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => validator.showMessageFor('confirmPassword')}
                        />

                        <div className='show-password-container'>
                            <input type='checkbox' onChange={togglePassword}/>
                            <div>{t('showPassword')}</div>
                        </div>

                        {validator.message('confirmPassword', confirmPassword, `required|passwordMatch:${newPassword}`)}
                    </div>

                    <div className='button-container'>
                        <button type="submit" className='custom-button' disabled={isLoading}>
                            {t('Create password')}
                        </button>
                    </div>

                    <div className="loader-clip-container">
                        <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                    </div> 
                </form>
            </section>
        </div>
    );
};
export default ChangePasswordPage;