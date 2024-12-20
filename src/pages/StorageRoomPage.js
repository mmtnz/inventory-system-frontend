import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import { apiGetStorageRoomsList } from '../services/api';


const StorageRoomPage = () => {
  
    const {storageRoomId} = useParams(); // Get it from url
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);
    const [storageRoom, setStorageRoom] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
  
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('homePage'); // Load translations from the 'home' namespace

    useEffect(() => {
        // Get storage room info if not already loaded
        if (!storageRoomsList || !setStorageRoomsAccessList) {
            setIsLoading(true);
            getStorageRoomsList();
        } else {
            const storRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId)
            setStorageRoom(storRoom)
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const permisionType = storageRoomsAccessList?.find(permission => permission.storageRoomId === storageRoomId).permisionType
        setIsAdmin(permisionType === 'admin')
    }, [storageRoom])

    // Get a list with all the storage rooms the user has access and another one with the permission
    const getStorageRoomsList = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList);

            // check if user has access to the storage room
            const storRoom = response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId)
            if (!storRoom){
                navigate('/home')
            }
            setStorageRoom(storRoom)
            setIsLoading(false);
        } catch (err) {
            handleError(err, t("locale"), navigate)
        }
    }


    const goToSearch = () => {
        navigate(`/storageRoom/${storageRoomId}/search`);
    }

    const goToNewItem = () => {
        navigate(`/storageRoom/${storageRoomId}/new-item`);
    }

    const goToSettings = () => {
        navigate(`/storageRoom/${storageRoomId}/settings`);
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
                {/* <h2>{storageRoom?.label}</h2>   */}
                <h1>{storageRoom.name}</h1>  
        
                <div className='option-button-container'>
                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} onClick={goToSearch}>
                    {/* <button className="custom-button" onClick={goToSearch}> */}
                        <span className="material-symbols-outlined">
                            search
                        </span>
                        {t('searchButton')}
                    </button>
            
                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} onClick={goToNewItem}>
                        <span className="material-symbols-outlined">
                            add
                        </span>
                        {t('newItemButton')}
                    </button>

                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} onClick={goToSettings} disabled={!isAdmin}>
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                        {t('settings')}
                    </button>
                </div>
            </section>
    </div>
  );
};

export default StorageRoomPage;
