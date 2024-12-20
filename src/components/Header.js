import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignOut from './SignOut';
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
import { useTranslation } from 'react-i18next';
import { useState } from 'react';



const Header = () => {

    const cognitoUser = userPool.getCurrentUser();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    // const { storageRoomId } = useParams();
    const location = useLocation();
    const [storageRoomId, setStorageRoomId] = useState();
      

    useEffect(() => {
        // Extract storageRoomId from the updated path whenever location changes
        const match = location.pathname.match(/\/storageRoom\/([^/]+)\//);
        setStorageRoomId( match ? match[1] : null);
        
        console.log("Updated storageRoomId:", storageRoomId);
    }, [location]);

    // useEffect(() => {
    //     console.log("Updated storageRoomId:", storageRoomId);
    // }, [storageRoomId]);


    const goHome = () => {
        console.log(`redirijo: ${storageRoomId}`)
        if (storageRoomId){
            navigate(`/home?storageRoom=${storageRoomId}`);
        } else {
            navigate('/home')
        }
        
        
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

                <div className='header-title-container'>
                    <h2>{'Storage room'}</h2>
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