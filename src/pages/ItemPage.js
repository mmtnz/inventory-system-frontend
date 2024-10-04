import React, { useEffect, useState } from 'react';
import Item from '../components/Item';
// import { apiGetTagsList, apiGetTLoationsObj } from '../services/api';
import { getStorageRoomInfo } from '../services/storageRoomInfoService';


const ItemPage = () => {

  const [args, setArgs] = useState({tagList: null, locationObj: null});
  const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
      getStorageRoomData();    
    }, [])

  // Get storage room info
  const getStorageRoomData = async () => {
    let storageRoomInfo = await getStorageRoomInfo();
    setArgs(storageRoomInfo.config);
    setIsLoaded(true);
}
  
//   // Get options from the DB
//   const getArgs = async () => {
//     let tagList = await apiGetTagsList();
//     let locationObj = await apiGetTLoationsObj();
//     let aux = {
//         tagList: tagList,
//         locationObj: locationObj
//     };
//     setArgs(aux);
//     setIsLoaded(true);
// }
  
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