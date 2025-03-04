import React from "react";
import logo from "../assets/images/icon.png";
import { useTranslation } from 'react-i18next';
import {useNavigate } from 'react-router-dom';
import {Link} from 'react-scroll';
import Contact from "../components/sections/Contact";
import About from "../components/sections/About";
import Arrow2Top from "../components/sections/Arrow2Top";


const WelcomePage = () => {
    const { t } = useTranslation('login'); // Load translations from the 'login' namespace
    const navigate = useNavigate();

    const goToSignUp = () => {
        navigate('/sign-up')
    }
    const goToLogIn = () => {
        navigate('/login')
    }

    return(
        <div className='center main'>
            <section id="welcome" className='content main'>
                <div>
                    <img src={logo} alt="Logo" className="welcome-icon"/>
                </div>

                <div className="welcome-title">
                    {"tidymystorage.com"}
                </div>

                <div className="welcome-slogan">
                    {"Simplify. Organise. Thrive."}
                </div>

                <div className="welcome-buttons-container">
                    <button className="custom-button" onClick={goToSignUp}>
                        {t("signUp")}
                    </button>
                    <button className="custom-button" onClick={goToLogIn}>
                        {t("login")}
                    </button>
                </div>
                
                <div className="button-link-container">
                    <Link to="about" smooth={true} duration={500} className="button-link">
                        Know more
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            arrow_downward
                        </span>
                    </Link>
                </div>
                </section>

                <section id="about" className="section">
                    <h2 className="welcome-subtitle">About</h2>
                    <About/>
                </section>

                <section id="contact" className="section">
                    <h2 className="welcome-subtitle">Contact</h2>
                    <Contact/>
                </section>

                {/* <Arrow2Top/> */}


           
        </div>
    )
};

export default WelcomePage;