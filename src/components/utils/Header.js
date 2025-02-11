import React, {useEffect, useState} from 'react';
import {useNavigate } from 'react-router-dom';
import SignOut from '../auth/SignOut';
import userPool from '../../services/cognitoConfig'; // Your Cognito configuration
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from "react-responsive";
import MobileHeaderMenu from './MobileHeaderMenu';

const Header = () => {

    const cognitoUser = userPool.getCurrentUser();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isMobile = useMediaQuery({ maxWidth: 900 });
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const { t } = useTranslation('login'); 
    
    const goHome = () => {
        navigate('/home');      
    }

    useEffect(() => {
        if (cognitoUser) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    console.error("Error getting session:", err);
                    return;
                }        
                // Fetch user attributes
                cognitoUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        console.error("Error getting attributes:", err);
                        return;
                    }
        
                    // Parse attributes
                    const userAttributes = {};
                    attributes.forEach(attribute => {
                        userAttributes[attribute.getName()] = attribute.getValue();
                    });
                    
                    setName(userAttributes.name);
                    setLastName(userAttributes.family_name);
                });
            });
        } else {
            console.log("No user is currently signed in.");
        }
        
    }, [cognitoUser])

    // Function to change the language
    const handleChangeLanguage = (event) => {
        const selectedLanguage = event.target.value;
        i18n.changeLanguage(selectedLanguage);  // Change the language in i18next
    };

    return(
        <div id="header">
            <>
            <div className='header-icon-container'>
                <span
                    className="material-symbols-outlined"
                    translate="no" aria-hidden="true" // prevent problems with translators
                    onClick={goHome}
                >
                    home
                </span>
            </div>

            <div className='header-title-container'>
                <h2 translate="no">{'tidymystorage'}</h2>
            </div>
            </>
            
            {isMobile ? (
                <MobileHeaderMenu cognitoUser={cognitoUser} name={name} lastName={lastName}/>
            ) : (
                <div className='header-icon-container-language'>
                    <button className='custom-button'>
                        Sign up
                    </button>
                    <button className='custom-button'>
                        Log in
                    </button>
                    
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




            // {/* // {cognitoUser ? ( 
            // //     <div className='header-icon-container'>
            // //         {/* <div className='header-name'>
            // //             {lastName}, {name}
            // //         </div> */}
            //         <select
            //             id="language-select"
            //             onChange={handleChangeLanguage}
            //             value={i18n.language}
            //         >
            //             <option value="en">EN</option>
            //             <option value="es">ES</option>
            //         </select>
            //         <SignOut/>
            //     </div>
                  
            // ) : (
            //     <>
            //     {isMobile ? (
            //         <>
            //         <div className="header-icon-container" onClick={() => {setIsMenuOpened(!isMenuOpened)}}>
            //             <span className="material-symbols-outlined" translate="no" aria-hidden="true">
            //                 menu
            //             </span>
            //         </div>
            //         {isMenuOpened && (

            //         <div className='header-menu-dropdown'>
            //             <div className='header-menu-item'>
            //                 <a>{name} {lastName}</a>
            //             </div>
            //             <div className='header-menu-item'>
            //                 <span className="material-symbols-outlined" translate="no" aria-hidden="true">
            //                     person
            //                 </span>
            //                 <a>{t('profile')}</a>
            //             </div>
            //             <div className='header-menu-item'>
            //                 <span className="material-symbols-outlined" translate="no" aria-hidden="true">
            //                     logout
            //                 </span>
            //                 <a>{t('signOut')}</a>
            //             </div>
            //         </div>
            //         )}
            //         </>





            //     ) : (
            //         <div className='header-icon-container-language'>
            //             <button className='custom-button'>
            //                 Sign up
            //             </button>
            //             <button className='custom-button'>
            //                 Log in
            //             </button>
                        
            //             <select
            //                 id="language-select"
            //                 onChange={handleChangeLanguage}
            //                 value={i18n.language}
            //             >
            //                 <option value="en">EN</option>
            //                 <option value="es">ES</option>
            //             </select>
            //         </div>
            //     )}
            //     </>
            // )} */}
        // </div>
    )
};

export default Header;