import { toHaveDescription } from '@testing-library/jest-dom/matchers';
import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';


const AddUserForm = ({usersList, setUsersList, userData, setUserData, closeModal}) => {

    const [permisionType, setPermisionType] = useState(null);
    const [email, setEmail] = useState('');

    const [, forceUpdate] = useState();
    
    const { t, i18n } = useTranslation('storageRoom'); 
    
    const [validator, setValidator] = useState(new SimpleReactValidator(
        { messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
            email: t('emailMessage')
        }
    }));
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL

    const permisionTypeOptions = [
        // {label: t('admin'), value: "admin"},
        {label: t('write'), value: "write"},
        {label: t('read'), value: "read"},
    ]
    
    useEffect(() => {
        console.log(userData)
        if (userData) {
            setEmail(userData.email);
            setPermisionType(permisionTypeOptions.find(opt => opt.value === userData.permisionType))
        } else {
            setEmail('');
            setPermisionType(null);
        }
    }, [userData])
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validator.allValid()){
            if (userData) { // Edit
                editUserpermision();
                setUserData(null);
            } else { //New
                addNewUserPermission();
            }
            closeModal();
        } else {
            validator.showMessages()
            forceUpdate({})
        }
    }

    const editUserpermision = () => {
        // Find heir index from userList
        const index = usersList.findIndex((userObj) => userObj.id === userData?.id);
        let auxUserList = [...usersList];
        auxUserList[index] = {email: email, permisionType: permisionType.value};
        setUsersList(auxUserList);
    }

    const addNewUserPermission = () => {
        setUsersList([
            ...usersList,
            {
                storageRoomId: storageRoomId,
                invitationId:  uuidv4(), // Create id so it has a reference to be edited
                email: email,
                permisionType: permisionType.value
            }
        ])
        setEmail(null);
        setPermisionType(null);
    }

    const isEdited = () => {
        return email !== userData?.email || permisionType?.value !== userData?.permisionType
    }


    return (
        
            <form className='small-modal-form' onSubmit={handleSubmit}>
                <div className='formGroup' >
                    <label htmlFor="email">{t('email')}</label>
                    <input
                        type='text'
                        name="email"
                        value={email || ''}
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                    {validator.message('name', email, 'required|email')}
                </div>

                <div className='formGroup'>
                    <label htmlFor="type">{t('permisionType')}</label>
                    <Select
                        options={permisionTypeOptions}
                        onChange={(value) => {setPermisionType(value);}}
                        placeholder={t('select')}
                        value={permisionType}
                        classNamePrefix="react-select" // Apply custom prefix
                    />
                    {validator.message('type', permisionType, 'required')}
                </div>

                <button
                    type="submit"
                    className='custom-button margin-top-2rem margin-bottom-1rem'
                    disabled={!isEdited()}
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>
                    {t('add')}
                </button>
            </form>

       
    )
}
export default AddUserForm;