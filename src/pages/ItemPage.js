import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import Item from '../components/Item';
import { apiGetStorageRoomsList } from "../services/api";
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';

const ItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
  const [isLoading, setIsLoading] = useState(true);
  const { storageRoomId } = useParams();
  const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace


  useEffect(() => {
    if (!storageRoomsList || !storageRoomsAccessList){
        getStorageRoomData();        
    } else {
        const storageRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
        setArgs(storageRoom?.config);
        setIsLoading(false);
    }
}, [])

  // Get storage room info
  // const getStorageRoomData = async () => {
  //   let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
  //   setArgs(storageRoomInfo.config);
  //   setIsLoaded(true);
  // }

  const getStorageRoomData = async () => {
    try {
        const response = await apiGetStorageRoomsList();
        setStorageRoomsList(response.storageRoomsList);
        setStorageRoomsAccessList(response.storageRoomsAccessList);
        const storageRoom = response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
        if (!storageRoom){
            await handleError({response: {status: 403}}, t('locale'), navigate);
        }
        setArgs(storageRoom?.config);
        setIsLoading(false);
    } catch (err) {
        await handleError(err, t('locale'), navigate);
    }
}
    
if (isLoading) {
  return (
      <div className="loader-clip-container">
          <ClipLoader className="custom-spinner-clip" loading={true} />
      </div>
  )
}

  return(
    <div className='center'>
      <section className='content'>
        <Item args={args}/>                                    
      </section>
    </div>  
  );  
};
export default ItemPage;