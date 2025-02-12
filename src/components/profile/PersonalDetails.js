import React, {useState, useEffect} from "react";
import { defineLocale } from "moment";
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import SimpleReactValidator from 'simple-react-validator';

const PersonalDetails = ({cognitoUser}) => {

    const { t, i18n } = useTranslation('profile');

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nameOld, setNameOld] = useState('');
    const [lastNameOld, setLastNameOld] = useState('');
    const [isDetailsDisabled, setIsDetailsDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [, forceUpdate] = useState('')

    const [validator, setValidator] = useState(new SimpleReactValidator({
        validators: {
            alpha_space_accents: {
                message: t('alpaSpaceAccentsMsg'),
                rule: (val) => {
                    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
                    return regex.test(val);
                },
                required: true
            }
        },
        messages: {
            required: t('required'),
        },
    })
    );

    // Reinitialize the validator when the language changes
    useEffect(() => {
        setValidator(
            new SimpleReactValidator({
                validators: {
                    alpha_space_accents: {
                        message: t('alpaSpaceAccentsMsg'),
                        rule: (val) => {
                            const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
                            return regex.test(val);
                        },
                        required: true
                    }
                },
                messages: {
                    required: t('required'),
                },
            })
        );
        forceUpdate(true)
    }, [i18n.language]); // Re-run the effect when the language changes

    useEffect(() => {
        if (cognitoUser) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    console.error("Error getting session:", err);
                    return;
                }        
                // Fetch user attributes
                cognitoUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        console.error("Error getting attributes:", err);
                        return;
                    }
        
                    // Parse attributes
                    const userAttributes = {};
                    attributes.forEach(attribute => {
                        userAttributes[attribute.getName()] = attribute.getValue();
                    });

                    setName(userAttributes.name);
                    setLastName(userAttributes.family_name);
                    setNameOld(userAttributes.name);
                    setLastNameOld(userAttributes.family_name);
                    setIsLoading(false);
                    console.log(userAttributes)
                });
            });
        } else {
            console.log("No user is currently signed in.");
        }
        
    }, []);

    const isUpdates = () => {
        return name !== nameOld || lastName !== lastNameOld;
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        if (validator.allValid()){
            setIsUpdating(true);
            const attributes = [
                { Name: "name", Value: name },
                { Name: "family_name", Value: lastName }
            ];
            cognitoUser.updateAttributes(attributes, (err, result) => {
                setIsUpdating(false);
                if (err) {
                    console.error("Update error:", err);
                    
                } else {
                    setNameOld(name);
                    setLastNameOld(lastName);
                    setIsDetailsDisabled(true);
                }
            });
        } else {
            validator.showMessages();
            forceUpdate('')
        }

    }

    if (isLoading) {
        return(
            <form className="custom-form">
                <div className="width-100 flex-row-between">
                    <h3>{t('personalDetails')}</h3>
                    
                </div>
                <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div>        
            </form>  
        ) 
    }

    return (
        <form className="custom-form" onSubmit={handleUpdate}>
            <div className="width-100 flex-row-between">
                <h3>{t('personalDetails')}</h3>
                {isDetailsDisabled ? (
                    <div style={{cursor: "pointer"}} onClick={() => {setIsDetailsDisabled(false)}}>
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                        edit 
                    </span>
                </div>
                ):(
                    <div style={{cursor: "pointer"}} onClick={() => {setIsDetailsDisabled(true)}}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            close 
                        </span>
                    </div>
                )}
                
            </div>
            <div className="formGroup">
                <label htmlFor="name">{t('name')}</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isDetailsDisabled}
                />
                {validator.message('name', name, 'required|alpha_space_accents')}
            </div>
            <div className="formGroup">
                <label htmlFor="lastName">{t('lastName')}</label>
                <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isDetailsDisabled}
                />
                {validator.message('lastName', lastName, 'required|alpha_space_accents')}
            </div>

            {!isDetailsDisabled && (
                <div className="button-container">
                    <button className="custom-button" type="submit" disabled={!isUpdates() || isUpdating}>
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
            )}

        </form>
    )
};
export default PersonalDetails;