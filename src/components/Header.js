import { useNavigate } from 'react-router-dom';


const Header = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate('/home');
    }

    return(
        <div id="header">
            <div className='home-icon'>
                <span className="material-symbols-outlined" onClick={goHome}>
                    home
                </span>
            </div>  
        </div>
    )
};

export default Header;