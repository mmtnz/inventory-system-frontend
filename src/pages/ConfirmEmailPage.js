import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {confirmUser, resendConfirmationCode} from '../services/createAccount';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import Swal from "sweetalert2";
import {messagesObj} from "../schemas/messages";


function ConfirmEmailPage() {

    const [verificationCode, setVerificationCode] = useState('');
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation('login'); // Load translations from the 'login' namespace
    const navigate = useNavigate();
  
    useEffect(() => {
        if (!email) {
            navigate('/login')
        }    
    }, [])
    
    const handleVerify = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const result = await confirmUser(email, verificationCode);
            console.log(result)
            Swal.fire(messagesObj[t('locale')].emailVerifiedSuccess)
                .then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                        navigate('/login');
                    }
                }
            );
        } catch (err) {
            console.log(err);
            if (err.code === 'ExpiredCodeException'){
                setError(t('codeExpired'))
            } else if (err.code === 'CodeMismatchException' || err.code === "InvalidParameterException") {
                setError(t('wrongCode'));
            } else if (err.code === 'UserNotFoundException') {
                Swal.fire(messagesObj[t('locale')].UserNotFoundException)
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            navigate('/login');
                        }
                    }
                );
            } else if (err.code === "LimitExceededException"){
                setError(t('codeLimitExceeded'));
                console.log('entro')
            } else if (err.code === "NotAuthorizedException"){
                Swal.fire(messagesObj[t('locale')].emailVerifiedSuccess)
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            navigate('/login');
                        }
                    }
            );
            }
        }
        setIsLoading(false);
        
    };

    const sendNewCode = async () => {
        setError(null);
        try {
            const result = await resendConfirmationCode(email)
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    
    return (
        <div id="search-page" className="center">
            <section className="content">
                <h1>{t('confirmEmail')}</h1>
                
                
                <form onSubmit={handleVerify} className='login-form'>
                    
                    <div className='text-container margin-top-1rem margin-bottom-2rem'>
                        {t('codeSent')}
                        <b>{email}</b>
                    </div>
                    
                    <div className='formGroup'>
                        <label htmlFor="verificationCode">{t('verificationCode')}</label>
                        <input
                            type="text"
                            name="verificationCode"
                            placeholder={t('verificationCode')}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                    <div className='text-icon-container'>
                        Send a new code
                        <div className="custom-button-icon" onClick={sendNewCode}>
                            <span className="material-symbols-outlined">
                                sync
                            </span>
                        </div>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                
                    <div className="button-container">
                        <button className="custom-button" type="submit" disabled={isLoading}>
                            {t('verify')}
                        </button>
                    </div>
                </form>

                <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div>        
                
            </section>
        </div>
  );
}

export default ConfirmEmailPage;
