// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import AuthContext from '../services/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import { apiAddUsers, apiGetInvitations, apiGetStorageRoomsList, apiSearchItems } from '../services/api';
import Swal from "sweetalert2";
import {messagesObj, getDeleteStorageRoomConfirmationMsg} from "../schemas/messages";
import UserInvitation from '../components/UserInvitation';
import AddUserModal from '../components/AddUserModal';

const StorageRoomAddUsersPage = () => {
  

    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL
    const [storageRoom, setStorageRoom] = useState(null);
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);

    const [usersList, setUsersList] = useState([]);
    const [userEmail, setUserEmail] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userToEdit, setUserToEdit] = useState(null);

    const [invitationsList, setInvitationsList] = useState(null);
    const [invitationsToDelete, setInvitationsToDelete] = useState(null);
    const [invitationsToEdit, setInvitationsToEdit] = useState(null);

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
            }
    
        }
    }, []);

    useEffect(() => {
        if (storageRoom) {
            getInvitations();
        }
    }, [storageRoom]);

    const getInvitations = async () => {
        const [invitationsList, email] = await apiGetInvitations(storageRoomId);
        setInvitationsList(invitationsList);
        setUserEmail(email)
        setIsLoading(false);
    }
    
     

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
            }
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    const handleInviteUsers = async () => {
        try {
            await apiAddUsers(storageRoomId, usersList);
        } catch (err) {
            console.log(err)
            // handleError(err, t('locale'), navigate);
        }
        
    }

    const removeInvitation = (invitationId) => {
        const itemToDelete = invitationsList.find(user => user.invitationId === invitationId);

        setInvitationsList(invitationsList.filter(user => user.invitationId !== invitationId));
        setInvitationsToDelete([...invitationsToDelete || [], itemToDelete]);
        console.log([...invitationsToDelete || [], itemToDelete])
    }

    const removeNewInvitation = (invitationId) => {
        setUsersList(usersList.filter(user => user.id !== invitationId))
    }

    const editInvitation = (invitationId) => {
        let auxUser = usersList.find(user => user.invitationId === invitationId);
        setUserToEdit({...auxUser});
        setModalIsOpen(true);
    }

    const editNewInvitation = (invitationId) => {
        let auxUser = usersList.find(user => user.invitationId === invitationId);
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
                        {/* Already invited users */}
                        {invitationsList?.map(invitation => (
                            <UserInvitation
                                key={invitation.invitationId}
                                user={invitation}
                                removeInvitation={removeInvitation}
                                editInvitation={editInvitation}
                                userEmail={userEmail}
                            />
                        ))}

                        {/* New invitations */}
                        {usersList.map(user => (
                            <UserInvitation
                                key={user.invitationId}
                                user={user}
                                removeInvitation={removeNewInvitation}
                                editInvitation={editInvitation}
                            />
                        ))}

                        <div className='add-user-item' onClick={() => {setModalIsOpen(true)}}>
                            {t('inviteAnotherUser')}
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
