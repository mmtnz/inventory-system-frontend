import React from "react";
import logo from "../assets/images/icon.png";
import { useTranslation } from 'react-i18next';
import {useNavigate } from 'react-router-dom';


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
        <div className='center'>
            <section className='content'>
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

            </section>
        </div>
    )
};

export default WelcomePage;