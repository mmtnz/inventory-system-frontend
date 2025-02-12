import React, {useState} from "react";
import { defineLocale } from "moment";
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import SimpleReactValidator from 'simple-react-validator';

const ChangePassword = ({cognitoUser}) => {

    const { t } = useTranslation('profile');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [IsVisible, setIsVisible] = useState(false);
    const [IsVisibleNew, setIsVisibleNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateState, setUpdateState] = useState(false); // Force update state
    const [error, setError] = useState(false);

    const [validator] = useState(new SimpleReactValidator({
        validators: {
            passwordMatch: {  // Custom validator for matching passwords
                message: t('passwordNotMatchMsg'),
                rule: (val, params, validator) => {
                    return val === params[0]; // params[0] is newPassword passed in the validation rule
                },
                required: true,
            },
            passwordStrength: {
                message: t('unvalidPasswordMsg'),
                rule: (val) => {
                    // Ensure at least: one lowercase letter, one uppercase leater, one number and one special character
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`+=-])/;
                    return regex.test(val);
                },
                required: true,
            },
        },
        messages: {
            required: t('required'),
            min: t('min8CharsMsg')
        },
    }));
    const handleUpdate = (e) => {
        e.preventDefault();
        setError('')
        if (validator.allValid()) {
            setIsUpdating(true);
            cognitoUser.getSession((err, session) => {
                if (err) {
                  console.error(err);
                  return;
                }
                cognitoUser.changePassword(oldPassword, password, (err, result) => {
                    setIsUpdating(false);
                    console.log(err)
                    if (err.code === "NotAuthorizedException" || err.code === "InvalidParameterException") {
                        setError(t('wrongOldPasswordMsg'))
                        // console.log('entro')
                    }
                });
            })
        } else {
            console.log('entro')
            validator.showMessages();
            setUpdateState(prev => !prev); // Force re-render to show validation messages
        }
    }

    return (
        <form className="custom-form" onSubmit={handleUpdate}>
           <div className="width-100 flex-row-between">
                <h3>{t('changePassword')}</h3>
            </div>
            <div className="formGroup">
                <label htmlFor="oldPassword">{t('oldPassword')}</label>
                <input
                    type={IsVisible ? 'text' : 'password'}
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <div className='show-password-container'>
                    <input type='checkbox' onChange={() => {setIsVisible(!IsVisible)}}/>
                    <div>{t('showPassword')}</div>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="formGroup">
                <label htmlFor="newPassword">{t('newPassword')}</label>
                <input
                    type={IsVisibleNew ? 'text' : 'password'}
                    name="newPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className='show-password-container'>
                    <input type='checkbox' onChange={() => {setIsVisibleNew(!IsVisibleNew)}}/>
                    <div>{t('showPassword')}</div>
                </div>
                {validator.message('password', password, 'required|passwordStrength|min:8')}
            </div>

            <div className="formGroup">
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <input
                    type={IsVisibleNew ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {validator.message('confirmPassword', confirmPassword, `required|passwordMatch:${password}`)}
            </div>

            <div className="button-container">
                <button className="custom-button" type="submit" disabled={isUpdating || (oldPassword === '' || password === '')}>
                    {!isUpdating ? (
                        <>{t('update')}</>
                    ) : (
                        <div className="custom-button-spinner-container">
                            <ClipLoader
                                className="custom-button-spinner"
                                loading={true}
                                color="white"
                            />
                        </div>
                    )}
                </button>
            </div>
        </form>
    )
};
export default ChangePassword;