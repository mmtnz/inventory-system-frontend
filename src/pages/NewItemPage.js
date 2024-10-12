import React, { useEffect, useState } from 'react';
import NewItemForm from '../components/NewItemForm';
import { useTranslation } from 'react-i18next';
import { getStorageRoomInfo } from '../services/storageRoomInfoService';
import { useParams } from 'react-router-dom';

const NewItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    const { storageRoomId } = useParams();
    
    useEffect(() => {
        getStorageRoomData();        
    }, [])
    
    // Get storage room info
    const getStorageRoomData = async () => {
        
        let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
        setArgs(storageRoomInfo.config);
    }

    return(
        <div className='center'>
            <section className='content'>
                <h1>{t('title')}</h1>
                <NewItemForm args={args}/>                                    
            </section>
        </div>
    )
    
};
export default NewItemPage;