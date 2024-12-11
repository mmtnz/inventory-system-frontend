// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { apiGetUserInfo } from '../services/api';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';


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
    console.log(storageRoom)
  }, []);

  useEffect(() => {
    if (storageRoomsList.length > 1){
      getStorageRoomFromUrl();
    }
  }, [storageRoomOptions])

  // To get storages rooms from user info (it should be done in login)
  const getUserInfo = async () => {
    try {
      const userInfo = await apiGetUserInfo();
      sessionStorage.setItem('storageRoomsList', JSON.stringify(userInfo.storageRoomsList))
      setStorageRoomsList(userInfo.storageRoomsList);  
    } catch (err){
      console.log(err)
      await handleError(err, t('locale'), navigate);
    }
  }

  //Show storage room or storageroom options
  const showAssociatedStorageRooms = () => {
    // Only one storage room associted
    // if (typeof storageRoomsList === 'string' || (storageRoomsList && storageRoomsList.length === 1)){
    if (storageRoomsList && storageRoomsList.length === 1){
      // let room = typeof storageRoomsList === 'string' ? storageRoomsList : storageRoomsList[0]
      let room = storageRoomsList[0]
      console.log(room)
      setStorageRoom({value: room.id, label: room.name});
      setIsMultipleStorageRooms(false);
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
          // <h2>{'hola'}</h2>
          // <h2>{JSON.stringify(storageRoom)}</h2>
          <h2>{storageRoom?.label}</h2>
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
