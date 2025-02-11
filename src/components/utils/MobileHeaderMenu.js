import React, {useEffect, useState, useContext, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import { apiDeleteRefreshToken } from '../../services/api';
import AuthContext from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const MobileHeaderMenu = ({handleChangeLanguage, cognitoUser, name, lastName}) => {

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const {setStorageRoomsList, setStorageRoomsAccessList} = useContext(AuthContext);
    const { t, i18n } = useTranslation('login');

    const menuRef = useRef(null); // Reference to menu container
    
    const navigate = useNavigate();

    // Close the menu if clicking outside
        useEffect(() => {
            function handleClickOutside(event) {
                if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setIsMenuOpened(false);
                }
            }
    
            if (isMenuOpened) {
                document.addEventListener("mousedown", handleClickOutside);
            }
    
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isMenuOpened]);

    const handleLogOut = async () => {
        try {
        
            // Call Cognito's signOut method
            cognitoUser.signOut();

            // Clear refresh token from http cookie
            const accessToken = sessionStorage.getItem('accessToken')
            await apiDeleteRefreshToken(accessToken);

            // Clear session storage
            sessionStorage.clear();
            setStorageRoomsList(null);
            setStorageRoomsAccessList(null);
            setIsMenuOpened(false);
            navigate('/')
        } catch (err) {
            console.log(err.response.status);
        }
    }

    const goToProfile = () => {
        setIsMenuOpened(false);
    }

    const goToLogin = () => {
        setIsMenuOpened(false);
        navigate('/login');
    };

    const goToSignUp = () => {
        setIsMenuOpened(false);
        navigate('/sign-up');
    };

    return (
        <>
        <div className="header-icon-container" onClick={() => {setIsMenuOpened(!isMenuOpened)}}>
            <select
                id="language-select"
                onChange={handleChangeLanguage}
                value={i18n.language}
            >
                <option value="en">EN</option>
                <option value="es">ES</option>
            </select>
            
            <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                menu
            </span>
        </div>
        {isMenuOpened && (
            <div className='header-menu-dropdown' ref={menuRef}>
                {cognitoUser ? (
                    <>
                    <div className='header-menu-item'>
                        <div>{name} {lastName}</div>
                    </div>
                    <div className='header-menu-item' onClick={goToProfile}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            person
                        </span>
                        <div>{t('profile')}</div>
                    </div>
                    <div className='header-menu-item' onClick={handleLogOut}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            logout
                        </span>
                        <div>{t('signOut')}</div>
                    </div>
                    </>
                ) : (
                    <>
                    <div className='header-menu-item' onClick={goToLogin}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            login
                        </span>
                        <div>{t('login')}</div>
                    </div>
                    <div className='header-menu-item' onClick={goToSignUp}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            person_add 
                        </span>
                        <div>{t('signUp')}</div>
                    </div>
                    </>
                )}
                
            </div>
            )}
        </>
    )
};
export default MobileHeaderMenu;
