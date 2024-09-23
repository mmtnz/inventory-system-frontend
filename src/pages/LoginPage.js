import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {signIn} from '../services/authenticate';
import AuthContext from '../services/AuthContext';
import SimpleReactValidator from 'simple-react-validator'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [step, setStep] = useState('login');

  const { setUser } = useContext(AuthContext); // Use context to store the user
  const { setUserAttributes } = useContext(AuthContext); // Use context to store the user attributes

  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');

  // Initialize simple-react-validator
  const [validator] = useState(new SimpleReactValidator);

  const navigate = useNavigate();

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
        // console.log(result.userAttributes)
        navigate('/home');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Incorrect email or password')
    }
  };


  return (
    <div id="search-page" className="center">
      <section className="content">
        <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin} className='login-form'>
              <div className='formGroup'>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validator.showMessageFor('email')}
                />
                {validator.message('email', email, 'required|email')}
              </div>
    
              <div className='formGroup'>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validator.showMessageFor('password')}
                />
                {validator.message('password', password, 'required')}
              </div>
              
    
              <button type="submit">Login</button>
            </form>
        
        {/* {step == 'login' ? (
          <>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin} className='login-form'>
              <div className='formGroup'>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
    
              <div className='formGroup'>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
    
              <button type="submit">Login</button>
            </form>
          </>
        ) : (
          <>
            <h1>Create new password</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleUpdatePassword} className='repeat-password-form'>
                <div className='formGroup'>
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        name="new-password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className='formGroup'>
                    <label htmlFor="repeat-new-password">Repeat new password</label>
                    <input
                        type="password"
                        name="repeat-new-password"
                        placeholder="new password"
                        value={repeatNewPassword}
                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                        required
                    />
                    </div>
                <button type="submit">Update password</button>
            </form>
          </>
        )} */}
        
        </section>
    </div>
  );
}

export default LoginPage;
