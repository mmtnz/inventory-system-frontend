import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';


const AddUserForm = ({usersList, setUsersList, userData, setUserData, closeModal, isNew, invitationsToEdit, setInvitationsToEdit, currentUserList}) => {

    const [permissionType, setPermissionType] = useState(null);
    const [email, setEmail] = useState('');

    const [, forceUpdate] = useState();
    
    const { t, i18n } = useTranslation('storageRoom'); 
    console.log(currentUserList)
    
    const [validator, setValidator] = useState(new SimpleReactValidator(
        {validators: {
            newEmail: {
                message: 'Please fill all heir percentage inputs.',
                rule: (val) => {
                    if (userData) { // An invitations is being edited
                        return true
                    }
                    return !currentUserList?.some(invitation => invitation.email === val);    
                }, 
                required: true
            },
        },
        messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
            email: t('emailMessage'),
            newEmail: t('newEmailMessage')
        }
    }));
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL

    const permissionTypeOptions = [
        // {label: t('admin'), value: "admin"},
        {label: t('write'), value: "write"},
        {label: t('read'), value: "read"},
    ]
    
    useEffect(() => {
        console.log(userData)
        if (userData) {
            setEmail(userData.email);
            setPermissionType(permissionTypeOptions.find(opt => opt.value === userData.permissionType))
        } else {
            setEmail('');
            setPermissionType(null);
        }
    }, [userData])
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validator.allValid()){
            if (userData) { // Edit
                editUserPermission();
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

    const editUserPermission = () => {
        // Find heir index from userList
        const index = usersList.findIndex((userObj) => userObj.id === userData?.id);
        let auxUserList = [...usersList];
        auxUserList[index] = {...auxUserList[index], email: email, permissionType: permissionType.value};
        setUsersList(auxUserList);
        if(!isNew) {
            setInvitationsToEdit([...invitationsToEdit, auxUserList[index]])
        }
    }

    const addNewUserPermission = () => {
        setUsersList([
            ...usersList,
            {
                storageRoomId: storageRoomId,
                invitationId:  uuidv4(), // Create id so it has a reference to be edited
                email: email,
                permissionType: permissionType.value
            }
        ])
        setEmail(null);
        setPermissionType(null);
    }

    const isEdited = () => {
        return email !== userData?.email || permissionType?.value !== userData?.permissionType
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
                        disabled={userData && !isNew}
                    />
                    {validator.message('name', email, 'required|email')}
                    {validator.message('newEmailValidation', email, 'newEmail')}
                </div>

                <div className='formGroup'>
                    <label htmlFor="type">{t('permissionType')}</label>
                    <Select
                        options={permissionTypeOptions}
                        onChange={(value) => {setPermissionType(value);}}
                        placeholder={t('select')}
                        value={permissionType}
                        classNamePrefix="react-select" // Apply custom prefix
                    />
                    {validator.message('type', permissionType, 'required')}
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