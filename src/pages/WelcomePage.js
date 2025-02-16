import React from "react";
import logo from "../assets/images/icon.png";
import { useTranslation } from 'react-i18next';


const WelcomePage = () => {
    const { t } = useTranslation('login'); // Load translations from the 'login' namespace
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
                    <button className="custom-button">
                        {t("signUp")}
                    </button>
                    <button className="custom-button">
                        {t("login")}
                    </button>
                </div>

            </section>
        </div>
    )
};

export default WelcomePage;