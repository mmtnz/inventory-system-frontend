import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SignOut from './SignOut';
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
import { useTranslation } from 'react-i18next';



const Header = () => {

    
    const languageOptions = [
        {"label": "EN", "value": "en"},
        {"label": "ES", "value": "es"}
    ]
    const cognitoUser = userPool.getCurrentUser();
    const navigate = useNavigate();
    const { i18n } = useTranslation(); 
      

    const goHome = () => {
        navigate('/home');
    }

    // Function to change the language
    const handleChangeLanguage = (event) => {
        const selectedLanguage = event.target.value;
        i18n.changeLanguage(selectedLanguage);  // Change the language in i18next
    };

    return(
        <div id="header">
            {cognitoUser ? ( 
                <>
                <div className='header-icon-container'>
                    <span className="material-symbols-outlined" onClick={goHome}>
                        home
                    </span>
                    {/* <div className='hover-text'>
                        Home
                    </div> */}
                    
                </div>
                
                <div className='header-icon-container'>
                    <select
                        id="language-select"
                        onChange={handleChangeLanguage}
                        value={i18n.language}
                    >
                        <option value="en">EN</option>
                        <option value="es">ES</option>
                    </select>
                    <SignOut/>
                </div>
                
                </>
            ) : ( 
                <div className='header-icon-container-language'>
                    <select
                        id="language-select"
                        onChange={handleChangeLanguage}
                        value={i18n.language}
                    >
                        <option value="en">EN</option>
                        <option value="es">ES</option>
                    </select>
                </div>
            )}
        </div>
    )
};

export default Header;