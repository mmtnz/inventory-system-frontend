// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { apiGetUserInfo } from '../services/api';
import { logout } from "../services/logout";
import Swal from 'sweetalert2';
import messagesObj from '../schemas/messages';


const HomePage = () => {
  
  const [storageRoom, setStorageRoom] = useState();
  const [storageRoomsList, setStorageRoomsList] = useState(
    sessionStorage.getItem('storageRoomsList') ? JSON.parse(sessionStorage.getItem('storageRoomsList')) : null
  ); 
  const [isMultipleStorageRooms, setIsMultipleStorageRooms] = useState(false);
  const [storageRoomOptions, setStorageRoomOptions] = useState([]);
  
  const navigate = useNavigate();
  const { t } = useTranslation('homePage'); // Load translations from the 'home' namespace
  const [searchParams] = useSearchParams();

  useEffect(() => {

    // Get user info if not already loaded
    if (!storageRoomsList) {
      getUserInfo();
    }
    // Add storage room options
    showAssociatedStorageRooms();
  }, []);

  useEffect(() => {
    getStorageRoomFromUrl();
  }, [storageRoomOptions])

  // To get storages rooms from user info (it should be done in login)
  const getUserInfo = async () => {
    try {
      const userInfo = await apiGetUserInfo();
      sessionStorage.setItem('storageRoomsList', JSON.stringify(userInfo.storageRoomsList))
      setStorageRoomsList(userInfo.storageRoomsList);  
    } catch (err){
      console.log(err)
      handleError(err);
    }
  }

  // To handle error depending on http error code
  const handleError = async (err) => {
    if (err.code === 'ERR_NETWORK') {
        Swal.fire(messagesObj[t('locale')].networkError);
        navigate('/login')
    } else if (err.response.status === 401) {
        Swal.fire(messagesObj[t('locale')].sessionError)
        await logout();
        navigate('/login')
    } else if ( err.response.status === 403) {  // Access denied
        Swal.fire(messagesObj[t('locale')].accessDeniedError)
        navigate('/home')
    } else if (err.response.status === 404 ) { // Item not found
        Swal.fire(messagesObj[t('locale')].itemNotFoundError)
        navigate('/home')
    } else if (err.response.status === 500) {
        Swal.fire(messagesObj[t('locale')].unexpectedError)
        await logout();
        navigate('/login')
    }
}

  //Show storage room or storageroom options
  const showAssociatedStorageRooms = () => {
    // Only one storage room associted
    if (typeof storageRoomsList === 'string' || (storageRoomsList && storageRoomsList.length === 1)){
      let room = typeof storageRoomsList === 'string' ? storageRoomsList : storageRoomsList[0]
      setStorageRoom(room);
    } else if (storageRoomsList) {
      setIsMultipleStorageRooms(true);
      setStorageRoomOptions(storageRoomsList.map(storRoom => (
        {value: storRoom.id, label: storRoom.name}
      )))
    }
  }

  // If storage room in url choose that option
  const getStorageRoomFromUrl = () => {
    
    const urlStorageRoom = searchParams.get('storageRoom');
    if (urlStorageRoom) {
      setStorageRoom(storageRoomOptions.find(storRoom => storRoom.value === urlStorageRoom))
    } 
  }


  const changeStorageRoom = (event) => {
    sessionStorage.removeItem('storageRoom');
    setStorageRoom(event);
  }

  const goToSearch = () => {
    navigate(`/storageRoom/${storageRoom.value}/search`);
  }

  const goToNewItem = () => {
    navigate(`/storageRoom/${storageRoom.value}/new-item`);
  }

  return (
    <div className='center'>
      <section className='content'>
        {/* <h1>{t('title')}</h1> */}
        {/* <label>Storage room:</label> */}
        
        {(isMultipleStorageRooms ? (
          <div className='storage-room-select-container'>
            {/* <h2>{storageRoom?.label}</h2> */}
            <form className='custom-form'>
              <Select
                className='custom-select'
                options={storageRoomOptions}
                value={storageRoom}
                onChange={changeStorageRoom}
                placeholder={t('select')}
                classNamePrefix="react-select" // Apply custom prefix
              />
            </form>
          
          </div>
        ) : (
          <h2>{storageRoom}</h2>
        ))}
        
        <div className='option-button-container'>
          
          <button className="custom-button" onClick={goToSearch} disabled={!storageRoom}>
            <span className="material-symbols-outlined">
                search
            </span>
            {t('searchButton')}
          </button>
          
          <button className="custom-button" onClick={goToNewItem} disabled={!storageRoom}>
            <span className="material-symbols-outlined">
              add
            </span>
            {t('newItemButton')}
          </button>
        </div>
        
      </section>
    </div>
  );
};

export default HomePage;
