// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { apiGetUserInfo } from '../services/api';


const HomePage = () => {
  
  const [storageRoom, setStorageRoom] = useState();
  const [storageRoomsList, setStorageRoomsList] = useState(
    sessionStorage.getItem('storageRoomsList') ? JSON.parse(sessionStorage.getItem('storageRoomsList')) : null
  ); 
  const [isMultipleStorageRooms, setIsMultipleStorageRooms] = useState(false);
  const [storageRoomOptions, setStorageRoomOptions] = useState([]);
  
  const navigate = useNavigate();
  const { t } = useTranslation('homePage'); // Load translations from the 'home' namespace

  useEffect(() => {
    
    if (!storageRoomsList) {
      getUserInfo();
    }

    showAssociatedStorageRooms();    
  }, []);

  // To get storages rooms from user info (it should be done in login)
  const getUserInfo = async () => {
    const userInfo = await apiGetUserInfo();
    sessionStorage.setItem('storageRoomsList', JSON.stringify(userInfo.storageRoomsList))
    setStorageRoomsList(userInfo.storageRoomsList);

  }

  //Show storage room or storageroom options
  const showAssociatedStorageRooms = () => {
    console.log(storageRoomsList)
    // Only one storage room associted
    if (typeof storageRoomsList == 'string' || (storageRoomsList && storageRoomsList.length == 1)){
      let room = typeof storageRoomsList == 'string' ? storageRoomsList : storageRoomsList[0]
      setStorageRoom(room);
    } else {
      setIsMultipleStorageRooms(true);
      setStorageRoomOptions(storageRoomsList.map(storRoom => (
        {value: storRoom.id, label: storRoom.name}
      )))
    }
  }


  const changeStorageRoom = (event) => {
    console.log(event)
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
          <div>
            <h2>{storageRoom?.label}</h2>
            <form className='custom-form'>
              <Select
                className='custom-select'
                options={storageRoomOptions}
                value={storageRoom}
                onChange={changeStorageRoom}
                placeholder={'Select storage room...'}
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
