import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {signIn} from '../services/authenticate';
import AuthContext from '../services/AuthContext';
import SimpleReactValidator from 'simple-react-validator';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);


  const { setUser } = useContext(AuthContext); // Use context to store the user
  const { setUserAttributes } = useContext(AuthContext); // Use context to store the user attributes


  // Initialize simple-react-validator
  const [validator] = useState(new SimpleReactValidator);

  const navigate = useNavigate();
  const { t } = useTranslation('login'); // Load translations from the 'login' namespace

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
     
      const result = await signIn(email, password);


      if (result.newPasswordRequired) {
        setUser(result.cognitoUser)
        setUserAttributes(result.userAttributes)
        console.log(result.userAttributes)
        navigate('/change-password')
        
      } else {
        // Otherwise, redirect to the home page
        setUser(result.cognitoUser)
        setUserAttributes(result.userAttributes)
        console.log(result.userAttributes)
        navigate('/home');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Incorrect email or password')
    }
  };

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
              
    
              <button type="submit">{t('login')}</button>
            </form>        
        </section>
    </div>
  );
}

export default LoginPage;
