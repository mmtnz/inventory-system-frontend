import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../services/AuthContext';



const Header = () => {

    const { user } = useContext(AuthContext); // Access AuthContext
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/home');
    }

    return(
        <div id="header">
            {user && 
                <div className='home-icon-container'>
                    <span className="material-symbols-outlined" onClick={goHome}>
                        home
                    </span>
                </div>
            }  
            
            
        </div>
    )
};

export default Header;