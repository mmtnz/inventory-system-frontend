import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SimpleReactValidator from 'simple-react-validator';


const NewStorageRoomNameForm = ({name, setName}) => {

    const nameRef = React.createRef();
    
    const { t, i18n } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace
    const [validator, setValidator] = useState(new SimpleReactValidator(
        { messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
        }
    }));

    // Change validator messages language
    useEffect(() => {
        // changeState();
        setValidator(
            new SimpleReactValidator({
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );
    }, [i18n.language])
       

    return(
        <div>
            <form 
                className="custom-form"
                onSubmit={(e) => {e.preventDefault()}}
                // onSubmit={handleSubmit}
                // onChange={changeState}
            >
                <div className="formGroup">
                    <label htmlFor="name">{t('name')}</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {validator.message('name', name, 'required|alpha_num_space')}
                </div>
            </form>
    </div>
    )
    
};
export default NewStorageRoomNameForm;