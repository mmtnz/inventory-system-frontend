import React, { useEffect, useState } from 'react';
import Item from '../components/Item';
// import { apiGetTagsList, apiGetTLoationsObj } from '../services/api';
import { getStorageRoomInfo } from '../services/storageRoomInfoService';
import { useParams } from 'react-router-dom';


const ItemPage = () => {

  const [args, setArgs] = useState({tagList: null, locationObj: null});
  const [isLoaded, setIsLoaded] = useState(false);
  const { storageRoomId } = useParams();

    useEffect(() => {
      getStorageRoomData();
      // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [])

  // Get storage room info
  const getStorageRoomData = async () => {
    let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
    setArgs(storageRoomInfo.config);
    setIsLoaded(true);
}
    
  if (!isLoaded) {
    return (
      <div>Loading...</div>
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