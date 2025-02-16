import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {signUp} from '../services/createAccount';
import SimpleReactValidator from 'simple-react-validator';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import TermsModal from '../components/auth/TermsModal';

function SignUpPage() {

    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { t, i18n } = useTranslation('login'); // Load translations from the 'login' namespace

  // Initialize simple-react-validator
    const [validator, setValidator] = useState(
        new SimpleReactValidator(
        { messages: {
            required: t('requiredMessage'),
            email: t('emailInvalid'),
        }
    }));
    const [, forceUpdate] = useState('')
    const navigate = useNavigate();

   // Reinitialize the validator when the language changes
    useEffect(() => {
        setValidator(
            new SimpleReactValidator({
                validators: {
                    passwordMatch: {  // Custom validator for matching passwords
                        message: t('passwordNotMatchMsg'),
                        rule: (val, params, validator) => {
                            return val === params[0]; // params[0] is newPassword passed in the validation rule
                        },
                        required: true,
                    },
                    passwordStrength: {
                        message: t('unvalidPasswordMsg'),
                        rule: (val) => {
                            // Ensure at least: one lowercase letter, one uppercase leater, one number and one special character
                            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=-])/;
                            return regex.test(val);
                        },
                        required: true,
                    },
                },
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );
        forceUpdate(true)
    }, [i18n.language]); // Re-run the effect when the language changes

  
    const handleSignUp = async (event) => {
        event.preventDefault();

        if (validator.allValid()){
            setIsLoading(true);
            await signUpWithCognito();
            
        } else {
            validator.showMessages()
            forceUpdate(false)
        }
    };

    const signUpWithCognito = async () => {
        try {
            const result = await signUp(email, password, name, lastName);
            console.log(result)
            navigate(`/confirm-email?email=${email}`);
        } catch (err) {
            console.log(err);
            if (err.code === 'UsernameExistsException') {
                setError(t('userAlreadyExistsError'))
            }
            setIsLoading(false);
        }
    }

    const togglePassword = () => {
        setVisible(!visible);
    }


    return (
        <div id="search-page" className="center">
            <section className="content">
                <h1>{t('createAccount')}</h1>
                
                
                <form onSubmit={handleSignUp} className='login-form'>
                    <div className='formGroup'>
                        <label htmlFor="name">{t('name')}</label>
                        <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder={t('name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => validator.showMessageFor('name')}
                        />
                        {validator.message('name', name, 'required|alpha_space')}
                    </div>

                    <div className='formGroup'>
                        <label htmlFor="lastName">{t('lastName')}</label>
                        <input
                            type="text"
                            name="lastName"
                            autoComplete="lastName"
                            placeholder={t('lastName')}
                            value={lastName}
                            onChange={(e) => setlastName(e.target.value)}
                            onBlur={() => validator.showMessageFor('name')}
                        />
                        {validator.message('lastName', lastName, 'required|alpha_space')}
                    </div>
                    
                    <div className='formGroup'>
                        <label htmlFor="email">{t('email')}</label>
                        <input
                            type="text"
                            name="email"
                            autoComplete="email"
                            placeholder={t('email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => validator.showMessageFor('email')}
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {validator.message('email', email, 'required|email')}
                    </div>
        
                    <div className='formGroup'>
                        <label htmlFor="password">{t('password')}</label>
                        <input
                            type={visible ? 'text' : 'password'}
                            name="password"
                            // autoComplete="password"
                            placeholder={t('password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => validator.showMessageFor('password')}
                        />
                        <div className='show-password-container'>
                            <input type='checkbox' onChange={togglePassword}/>
                            <div>{t('showPassword')}</div>
                        </div>
                        {validator.message('password', password, 'required|passwordStrength|min:8')}
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

                        {validator.message('confirmPassword', confirmPassword, `required|passwordMatch:${password}`)}
                    </div>

                    <div className='terms-acception-container'>
                            <input type="checkbox" onChange={() => {setIsAccepted(!isAccepted);}}/>
                            <div>{t('termsAndConditions1')}&nbsp;</div>
                        </div>
                    <div className='login-link' onClick={() => setIsModalOpen(true)}>
                        {t('termsAndConditions2')}
                    </div>
                    <TermsModal
                        modalIsOpen={isModalOpen}
                        setModalIsOpen={setIsModalOpen}
                        title={"Términos y condiciones"}
                    />
                
                    <div className="button-container">
                        <button className="custom-button" type="submit" disabled={isLoading}>
                            {!isLoading ? (
                                <>{t('createAccount')}</>
                            ) : (
                                <div className="custom-button-spinner-container">
                                    <ClipLoader
                                        className="custom-button-spinner"
                                        loading={true}
                                        color="white"
                                    />
                                </div>
                            )}
                        </button>
                    </div>
                </form>

                {/* <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div>         */}
                
            </section>
        </div>
  );
}

export default SignUpPage;
