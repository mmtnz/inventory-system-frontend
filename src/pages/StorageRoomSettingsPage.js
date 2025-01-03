// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import { apiDeleteStorageRoom, apiGetStorageRoomsList, apiSearchItems } from '../services/api';
import Swal from "sweetalert2";
import {messagesObj, getDeleteStorageRoomConfirmationMsg} from "../schemas/messages";

const StorageRoomSettingsPage = () => {
  
    const [isLoading, setIsLoading] = useState(true);
    const [storageRoom, setStorageRoom] = useState(null);
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);
    const { t, i18n } = useTranslation('storageRoom'); // Load translations from the 'home' namespace

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
            const storageRoomPermission = response.storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);

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
            } else {
                setIsLoading(false);
            }

        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    const handleDelete = () => {
        Swal.fire(messagesObj[t('locale')].deleteStorageRoomConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);
                    confirmDeletion();
                }
            }
        )
    }
    
    const confirmDeletion = async () => {
        const [, totalCount] = await apiSearchItems(storageRoomId, "q=&tag=&lent=null");
        console.log(`total: ${totalCount}`);
        Swal.fire(getDeleteStorageRoomConfirmationMsg(t('locale'), totalCount)
            ).then((result) => {
                if (result.isConfirmed) {
                    deleteStorageRoom();
                }
            }
        )
    }

    const deleteStorageRoom = async () => {
        try {
            await apiDeleteStorageRoom(storageRoomId);
            Swal.fire(messagesObj[t('locale')].deleteStorageRoomDeletionSuccess);
            setStorageRoomsAccessList(null); // Force reload
            setStorageRoomsList(null);
            navigate('/home')

        } catch (err) {
            console.log(err)
            handleError(err, t('locale'), navigate)
        } 
    }

    const goToAddUser = () => {
        navigate(`/storageRoom/${storageRoomId}/add-users`);
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
                <h1 className='margin-bottom-0'>{t('settings')}</h1>
                <h3>{storageRoom.name}</h3>
                
                <div className='option-button-container'>
                    {/* <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} disabled={true}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                        {t('edit')}
                    </button> */}
            
                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} onClick={goToAddUser} >
                        <span className="material-symbols-outlined">
                            person_add
                        </span>
                        {t('addUser')}
                    </button>

                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""} delete`} onClick={handleDelete}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                        {t('delete')}
                    </button>
                </div>
            </section>      
        </div>
    );
};

export default StorageRoomSettingsPage;
