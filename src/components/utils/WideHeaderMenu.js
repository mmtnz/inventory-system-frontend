import { defaultFormat } from "moment";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import SignOut from '../auth/SignOut';
import { useNavigate } from 'react-router-dom';

const WideHeaderMenu = ({handleChangeLanguage, cognitoUser, name, lastName}) => {

    const { t, i18n } = useTranslation('login');
    const [isProfileMenuOpened, setIsProfileMenuOpened] = useState(false);
    const navigate = useNavigate();


    const menuRef = useRef(null); // Reference to menu container

    // Close the menu if clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileMenuOpened(false);
            }
        }

        if (isProfileMenuOpened) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileMenuOpened]);

    const goToProfile = () => {
        navigate('/profile')
    }

    return(
        <>
        
        <div className='header-icon-container-language'>
            
            {!cognitoUser ? (
                <>
                <div className="header-option">
                    {t('signUp')}
                </div>
                <div className="header-option">
                    {t('login')}
                </div>
                </>
                
            ):(
                <>  
                    <SignOut/>
                    <div className='header-icon-container'>
                        <span
                            className="material-symbols-outlined"
                            translate="no" aria-hidden="true" // prevent problems with translators
                            onClick={() => {setIsProfileMenuOpened(!isProfileMenuOpened)}}
                        >
                            person
                        </span>
                    </div>
                    {isProfileMenuOpened && (
                        <div className='header-menu-dropdown' ref={menuRef}>
                            <div className='header-menu-item'>
                                <div>{name} {lastName}</div>
                            </div>
                            <div className='header-menu-item' onClick={goToProfile}>
                                <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                    person
                                </span>
                                <div>{t('profile')}</div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <select
                id="language-select"
                onChange={handleChangeLanguage}
                value={i18n.language}
            >
                <option value="en">EN</option>
                <option value="es">ES</option>
            </select>
        </div>
        
        </>
    )
};
export default WideHeaderMenu;