// src/pages/HomePage.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import AuthContext from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGetStorageRoomsList, apiGetStorageRoomInvitations } from '../services/api';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import Invitations from '../components/invitation/Invitations';


const HomePage = () => {
  
    const {storageRoomsList, setStorageRoomsList, setStorageRoomsAccessList} = useContext(AuthContext);

    const [invitationsList, setInvitationsList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(true);

     // Ref to track first render
     const isFirstRender = useRef(true);
  
    const navigate = useNavigate();
    const { t } = useTranslation('homePage'); // Load translations from the 'home' namespace

    useEffect(() => {
        // Get storage rooms info if necessary
        setIsLoading(true);
        if (!storageRoomsList) {
            getStorageRoomsList();
        }
        getInvitationsList();
    }, []);


    // Get a list with all the storage rooms the user has access and another one with the permission
    const getStorageRoomsList = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList)
            
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    //Get pending invitations to storage rooms
    const getInvitationsList = async () => {
        try {
            const response = await apiGetStorageRoomInvitations();
            setInvitationsList(response);
            // console.log(response)
        } catch (err) {
            // console.log(err)
            await handleError(err, t('locale'), navigate);
        }
        setIsLoading(false);
        isFirstRender.current = true;
        
    }

    const goToNewStorageRoom = () => {
        navigate(`/storageRoom/new`);
    }

    const goToStorageRoom = (storageRoomId) => {
        navigate(`/storageRoom/${storageRoomId}`);
    }

    if (isLoading) {
        return(
            <div className='center'>
            <section className='content'>
            
                <div className='storage-room-list'>
                    <h2>{t('storageRoomsList')}</h2>
                    <div className="loader-clip-container">
                        <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                    </div>
                </div>        
            </section>
        </div>   
        )
    }

    return (
        <div className='center'>
            <section className='content'>
            
                <div className='storage-room-list'>
                    <h2>{t('storageRoomsList')}</h2>

                    {(invitationsList && invitationsList.filter(inv => inv.status === 'pending').length > 0) &&
                        // <h4>Invitations ({invitationsList.length})</h4>
                        <Invitations invitationsList={invitationsList} setInvitationsList={setInvitationsList} getStorageRoomsList={getStorageRoomsList}/>
                    }

                    {(storageRoomsList && storageRoomsList.length > 0) ? (
                        <div className='storage-room-list-container'>
                            {storageRoomsList?.map(stRoom => (
                                <div
                                    key={stRoom.storageRoomId}
                                    className='storage-room-card'
                                    onClick={() => {goToStorageRoom(stRoom.storageRoomId)}}>
                                        {stRoom.name}
                                </div>
                            ))}
                        </div>
                    ): (
                        <div>{t('noStorageRooms')}</div>
                    )}
                </div>

                <div className='option-button-container'>          
                    <button className="custom-button" onClick={goToNewStorageRoom}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            add
                        </span>
                        {t('newStorageRoom')}
                    </button>
                </div>        
            </section>
        </div>
    );
};

export default HomePage;
