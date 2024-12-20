// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import AuthContext from '../services/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import { apiGetStorageRoomsList, apiSearchItems } from '../services/api';
import Swal from "sweetalert2";
import {messagesObj, getDeleteStorageRoomConfirmationMsg} from "../schemas/messages";
import TagsInput from '../components/TagsInput';
import AddUserModal from '../components/AddUserModal';
import UserInvitation from '../components/UserInvitation';

const StorageRoomAddUsersPage = () => {
  

    const [emailsList, setEmailsList] = useState([]);
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL
    const [storageRoom, setStorageRoom] = useState(null);
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);

    const [usersList, setUsersList] = useState([]);
    // const [userData, setUserData] = useState(null)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const { t, i18n } = useTranslation('storageRoom'); // Load translations from the 'home' namespace

    const validator = new SimpleReactValidator();
    const navigate = useNavigate();

    useEffect(() => {
        if (!storageRoomsList || !storageRoomsAccessList){
            getStorageRoomData();        
        } else {
            const storRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            if (!storRoom) {
                handleError({response: {status: 404}}, t('locale'), navigate);
            } else {
                setStorageRoom(storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId));
                setIsLoading(false);           
            }
    
        }
    }, [])

    const getStorageRoomData = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList);
            setStorageRoom(response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId));
            const storageRoomPermision = response.storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            console.log(storageRoomPermision)
            if (!storageRoomPermision){
                await handleError({response: {status: 403}}, t('locale'), navigate);
            }

            if (storageRoomPermision?.permisionType !== 'admin'){
                Swal.fire(messagesObj[t('locale')].deleteStorageRoomNoPermision)
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            navigate(`/storageRoom/${storageRoomId}`);
                        }
                    }
                );
            } else {
                setIsLoading(false);
            }

        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    const validateEmails = () => {
        return emailsList.every((email) => validator.check(email, 'email'));
    };

    const handleInviteUsers = () => {
        if (validateEmails()) {
            alert('Invite people');
            setIsError(false);
        } else {
            setIsError(true);
        }
    }

    const removeInvitation = (userId) => {
        setUsersList(usersList.filter(user => user.id !== userId))
    }

    const editInvitation = (userId) => {
        let auxUser = usersList.find(user => user.id === userId);
        console.log(userId)
        console.log(auxUser)
        console.log(usersList)
        setUserToEdit({...auxUser});
        setModalIsOpen(true);
    }

    if (isLoading) {
        return (
            <div className="loader-clip-container">
                <ClipLoader className="custom-spinner-clip" loading={true} />
            </div>
        )
    }

    return (
        <div className='center'>
            <section className='content'>
                <h1 className='margin-bottom-0'>{t('addUsers')}</h1>
                <h3>{storageRoom.name}</h3>
                

                <AddUserModal 
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    usersList={usersList}
                    setUsersList={setUsersList}
                    userData={userToEdit}
                    setUserData={setUserToEdit}
                />

                
                <div className='user-list-container'>
                        {usersList.map(user => (
                            <UserInvitation
                                key={user.id}
                                user={user}
                                removeInvitation={removeInvitation}
                                editInvitation={editInvitation}
                            />
                        ))}
                        <div className='add-user-item' onClick={() => {setModalIsOpen(true)}}>
                            Invite Another User...
                        </div>

                </div>

                
                <div className='button-container'>
                    <button
                        className="custom-button"
                        onClick={handleInviteUsers}
                        disabled={usersList?.length <= 0}
                    >
                        <span className="material-symbols-outlined">
                            person_add
                        </span>
                        {t('update')}
                    </button>
                </div>
            </section>      
        </div>
    );
};

export default StorageRoomAddUsersPage;
