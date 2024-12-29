import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {signIn} from '../services/authenticate';
import AuthContext from '../services/AuthContext';
import SimpleReactValidator from 'simple-react-validator';
import { useTranslation } from 'react-i18next';
import { apiGetStorageRoomsList } from '../services/api';
import { ClipLoader } from 'react-spinners';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const { setUser } = useContext(AuthContext); // Use context to store the user
  const { setUserAttributes } = useContext(AuthContext); // Use context to store the user attributes

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
        messages: {
          required: t('requiredMessage'),
          email: t('emailInvalid'),
        },
      })
    );
    forceUpdate(true)
  }, [i18n.language]); // Re-run the effect when the language changes
  
  
  const handleLogin = async (event) => {
    event.preventDefault();

    if (validator.allValid()){
      setIsLoading(true);
      await loginWithCognito();
      
    } else {
      validator.showMessages()
      forceUpdate(false)
    }
  };

  const loginWithCognito = async () => {
    try {
     
      const result = await signIn(email, password);
      console.log(result)
      console.log(result.newPasswordRequired)

      if (result.newPasswordRequired) {
        setUser(result.cognitoUser)
        setUserAttributes(result.userAttributes)
        navigate('/change-password')
        
      } else {
        // Otherwise, redirect to the home page
        setUser(result.cognitoUser)
        setUserAttributes(result.userAttributes)
        
        // const userInfo = await apiGetUserInfo();
        // sessionStorage.setItem('storageRoomsList', JSON.stringify(userInfo.storageRoomsList))
        const storageRoomsList = await apiGetStorageRoomsList();
        console.log(storageRoomsList)
        navigate('/home');
      }
    } catch (err) {
      if (err.code === 'NotAuthorizedException') {
        console.error('Error signing in:', err);
        setError(t('incorrectEmailPassword'))
      } else if (err.code === "UserNotConfirmedException") {
        navigate(`/confirm-email?email=${email}`)
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
        <h1>{t('login')}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin} className='login-form'>
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
                {validator.message('email', email, 'required|email')}
              </div>
    
              <div className='formGroup'>
                <label htmlFor="password">{t('password')}</label>
                <input
                  type={visible ? 'text' : 'password'}
                  name="password"
                  autoComplete="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validator.showMessageFor('password')}
                />
                <div className='show-password-container'>
                  <input type='checkbox' onChange={togglePassword}/>
                  <div>{t('showPassword')}</div>
                </div>
                {validator.message('password', password, 'required')}
              </div>

              
              
              <div className="button-container">
                <button className="custom-button" type="submit" disabled={isLoading}>
                  {t('login')}
                </button>
              </div>

              <div className='login-options-container'>
                <p className='login-link' onClick={() => {navigate('/sign-up')}}>{t('createAccount')}</p>
                <p className='login-link' onClick={() => {navigate('/forotten-password')}}>{t('forgotMyPassword')}</p>
              </div>
            </form>

            <div className="loader-clip-container">
              <ClipLoader className="custom-spinner-clip" loading={isLoading} />
            </div>        
            
        </section>
    </div>
  );
}

export default LoginPage;
