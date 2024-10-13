import React, { useEffect, useState } from 'react';
import NewItemForm from '../components/NewItemForm';
import { useTranslation } from 'react-i18next';
import { getStorageRoomInfo } from '../services/storageRoomInfoService';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import messagesObj from '../schemas/messages';


const NewItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    const { storageRoomId } = useParams();

    const navigate = useNavigate();
    
    useEffect(() => {
        getStorageRoomData();        
    }, [])
    
    // Get storage room info
    const getStorageRoomData = async () => {
        
        try {
            let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
            setArgs(storageRoomInfo.config);;
        } catch (err) {
            
            if (err.code === 'ERR_NETWORK') {
                Swal.fire(messagesObj[t('locale')].networkError);
                navigate('/login')
            } else if ( err.response.status === 403) {  // Access denied
                Swal.fire(messagesObj[t('locale')].accessDeniedError)
                navigate('/home')
            } else if (err.response.status === 404 ) { // Item not found
                Swal.fire(messagesObj[t('locale')].itemNotFoundError)
                navigate('/home')
            }
        }
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