// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import { apiAddUsers, apiGetInvitations, apiGetStorageRoomsList } from '../services/api';
import Swal from "sweetalert2";
import {messagesObj} from "../schemas/messages";
import UserInvitation from '../components/UserInvitation';
import AddUserModal from '../components/AddUserModal';

const StorageRoomAddUsersPage = () => {
  

    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL
    const [storageRoom, setStorageRoom] = useState(null);
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);

    const [usersList, setUsersList] = useState([]);
    const [userEmail, setUserEmail] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalNewIsOpen, setModalNewIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const [invitationsList, setInvitationsList] = useState(null);
    const [invitationsToDelete, setInvitationsToDelete] = useState([]);
    const [invitationsToEdit, setInvitationsToEdit] = useState([]);

    const { t } = useTranslation('storageRoom'); // Load translations from the 'home' namespace

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
            const storageRoomPermission = response.storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            console.log(storageRoomPermission)
            if (!storageRoomPermission){
                await handleError({response: {status: 403}}, t('locale'), navigate);
            }

            if (storageRoomPermission?.permissionType !== 'admin'){
                Swal.fire(messagesObj[t('locale')].deleteStorageRoomNoPermission)
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
        setIsUpdateLoading(true);
        console.log(invitationsToEdit)
        try {
            await apiAddUsers(storageRoomId,
                {
                    newInvitationsList: usersList,
                    removeInvitationsList: invitationsToDelete,
                    editInvitationsList: invitationsToEdit
                }
            );
            // if success
            setInvitationsList([...invitationsList, ...usersList]);
            setUsersList([])
            setInvitationsToDelete([]); 
            setInvitationsToEdit([]);
        } catch (err) {
            console.log(err)
            
            // handleError(err, t('locale'), navigate);
        }
        setIsUpdateLoading(false);
        
    }

    const removeInvitation = (invitationId) => {
        const itemToDelete = invitationsList.find(user => user.invitationId === invitationId);

        setInvitationsList(invitationsList.filter(user => user.invitationId !== invitationId));
        setInvitationsToDelete([...invitationsToDelete || [], itemToDelete]);
        console.log([...invitationsToDelete || [], itemToDelete])
    }

    const removeNewInvitation = (invitationId) => {
        setUsersList(usersList.filter(user => user.invitationId !== invitationId))
    }

    const editInvitation = (invitationId) => {
        let auxUser = invitationsList.find(user => user.invitationId === invitationId);
        setUserToEdit({...auxUser});
        setModalIsOpen(true);
    }

    const editNewInvitation = (invitationId) => {
        let auxUser = usersList.find(user => user.invitationId === invitationId);
        setUserToEdit({...auxUser});
        setModalNewIsOpen(true);
    }

    if (isLoading) {
        return (
            <div className='center'>
                <section className='content'>
                    <h1 className='margin-bottom-0'>{t('addUsers')}</h1>             
                    <div className="loader-clip-container">
                        <ClipLoader className="custom-spinner-clip" loading={true} />
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className='center'>
            <section className='content'>
                <h1 className='margin-bottom-0'>{t('addUsers')}</h1>
                <h3>{storageRoom.name}</h3>                

                {/* To edit current invitations */}
                <AddUserModal 
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    usersList={invitationsList}
                    setUsersList={setInvitationsList}
                    userData={userToEdit}
                    setUserData={setUserToEdit}
                    isNew={false} // To block email input if it is already saved in DB
                    invitationsToEdit={invitationsToEdit}
                    setInvitationsToEdit={setInvitationsToEdit}
                />

                {/* To create and edit new invitations */}
                <AddUserModal 
                    modalIsOpen={modalNewIsOpen}
                    setModalIsOpen={setModalNewIsOpen}
                    usersList={usersList}
                    setUsersList={setUsersList}
                    userData={userToEdit}
                    setUserData={setUserToEdit}
                    currentUserList={[...invitationsList, {email: userEmail}]} // To check if email is already in the list
                    
                />

                
                <div className='user-list-container'>
                        
                        <UserInvitation
                            key={userEmail}
                            user={{email: userEmail, permissionType: 'admin'}}
                            isAdmin={true}
                            removeInvitation={removeInvitation}
                            editInvitation={editInvitation}
                            type={'admin'}
                        />
                        {/* Already invited users and accepted*/}
                        {/*{invitationsList?.map(invitation => ( */}
                        {invitationsList?.filter(invitation => invitation.status === "accepted")?.map(invitation => (
                            <UserInvitation
                                key={invitation.invitationId}
                                user={invitation}
                                removeInvitation={removeInvitation}
                                editInvitation={editInvitation}
                                userEmail={userEmail}
                                type={invitationsToEdit.find(inv => inv.id === invitation.id) ? 'new' : ''} // Change color if edited
                            />
                        ))}
                        <div className='pending-container'>{t('pending')}:</div>
                        {/* Already invited users and pending*/}
                        {/* {invitationsList?.map(invitation => ( */}
                        {invitationsList?.filter(invitation => invitation.status === "pending")?.map(invitation => (
                            <UserInvitation
                                key={invitation.invitationId}
                                user={invitation}
                                removeInvitation={removeInvitation}
                                editInvitation={editInvitation}
                                userEmail={userEmail}
                                type={invitationsToEdit.find(inv => inv.id === invitation.id) ? 'new' : ''} // Change color if edited
                            />
                        ))}
                        {/* New invitations */}
                        {usersList?.map(user => (
                            <UserInvitation
                                key={user.invitationId}
                                user={user}
                                removeInvitation={removeNewInvitation}
                                editInvitation={editNewInvitation}
                                type={'new'}
                            />
                        ))}

                        <div className='add-user-item' onClick={() => {setModalNewIsOpen(true)}}>
                            {t('inviteAnotherUser')}
                        </div>

                </div>

                
                <div className='button-container'>
                    <button
                        className="custom-button"
                        onClick={handleInviteUsers}
                        disabled={usersList?.length <= 0 && invitationsToDelete?.length <= 0 && invitationsToEdit?.length <= 0}
                    >
                        <span className="material-symbols-outlined">
                            person_add
                        </span>
                        {t('update')}
                    </button>
                </div>

                <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isUpdateLoading} />
                </div>
            </section>      
        </div>
    );
};

export default StorageRoomAddUsersPage;
