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
import {forgotPassword, updatePassword} from '../services/recoverPassword';

const RecoverPasswordPage = () => {

    const { user } = useContext(AuthContext); // Retrieve cognitoUser from context
    const { userAttributes } = useContext(AuthContext); // Retrieve user attributes from context
    const { setUser } = useContext(AuthContext);
    const { setUserAttributes } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isPetitionSent, setIsPetitionSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const { t } = useTranslation('login'); // Load translations from the 'itemForm' namespace
    
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
   
        // if(!user){
        //     navigate('/login');
        // }
      }, []);


    const handleGetCode = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await forgotPassword(email);
            console.log(result)
            setIsPetitionSent(true);
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false);
    }


    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (validator.allValid()) {
            setIsLoading(true);

            try {
                const result = await updatePassword(email, verificationCode, newPassword)
                console.log(result)
                             
                Swal.fire(messagesObj[t('locale')].passwordUpdated)
                navigate('/login');
            } catch (err) {
                console.log('Problem changing password!', err);
                setIsLoading(false)
            }
        } else {
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
                <h1>{t('recoverPassword')}</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isPetitionSent ? (
                    <form onSubmit={handleGetCode} className='change-password-form'>
                        <div className='text-container margin-top-1rem margin-bottom-2rem'>
                            {t('codeWillBeSent')}
                        </div>
                        <div className='formGroup'>
                            <label htmlFor="email">{t('email')}</label>
                            <input
                                type='text'
                                name="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {validator.message('email', email, 'required|email')}
                        </div>

                        <div className='button-container'>
                            <button type="submit" className='custom-button' disabled={isLoading}>
                                {t('sendPetition')}
                            </button>
                        </div>

                        <div className="loader-clip-container">
                            <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleChangePassword} className='change-password-form'>
                        
                        
                        <div className='formGroup'>
                            <label htmlFor="verificationCode">{t('verificationCode')}</label>
                            <input
                                type="text"
                                name="verificationCode"
                                placeholder={t('verificationCode')}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
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
                )}

            </section>
        </div>
    );
};
export default RecoverPasswordPage;