// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGetStorageRoomsList } from '../services/api';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';


const HomePage = () => {
  
    const {storageRoomsList, setStorageRoomsList, setStorageRoomsAccessList} = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
  
    const navigate = useNavigate();
    const { t } = useTranslation('homePage'); // Load translations from the 'home' namespace

    useEffect(() => {
        // Get storage rooms info if necessary
        if (!storageRoomsList) {
            setIsLoading(true);
            getStorageRoomsList();
        }
        
    }, []);

    // Get a list with all the storage rooms the user has access and another one with the permission
    const getStorageRoomsList = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList)
            setIsLoading(false);
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    const goToNewStorageRoom = () => {
        navigate(`/storageRoom/new`);
    }

    const goToStorageRoom = (storageRoomId) => {
        navigate(`/storageRoom/${storageRoomId}`);
    }

    if (isLoading) {
        return(
            <div className="loader-clip-container">
              <ClipLoader className="custom-spinner-clip" loading={isLoading} />
            </div>       
        )
    }

    return (
        <div className='center'>
            <section className='content'>
            
                <div className='storage-room-list'>
                    <h2>{t('storageRoomsList')}</h2>

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
                        <span className="material-symbols-outlined">
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
