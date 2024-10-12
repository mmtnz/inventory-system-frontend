import React, { useEffect, useState } from 'react';
import EditItemForm from '../components/EditItemForm';
import { apiGetItem } from '../services/api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStorageRoomInfo } from '../services/storageRoomInfoService';
import { ClipLoader } from 'react-spinners';
import { logout } from "../services/logout";
import Swal from 'sweetalert2';
import messagesObj from '../schemas/messages';


const EditItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const {storageRoomId, itemId} = useParams();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
    useEffect(() => {
        getStorageRoomData(); // Get item called inside
    }, [])

    // Get storage room info
    const getStorageRoomData = async () => {
        try {
            let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
            setArgs(storageRoomInfo.config);
            // Check if item is passed as state from Item page
            if (location.state?.item) {
                setItem(location.state?.item);
                setLoading(false);
            } else {
                getItem();
            }
            
        } catch (err) {
            if ( err.response.status === 403) {  // Access denied
                Swal.fire(messagesObj[t('locale')].accessDeniedError)
                navigate('/home')
            } else if (err.response.status === 404 ) { // Item not found
                Swal.fire(messagesObj[t('locale')].itemNotFoundError)
                navigate('/home')
            }
        }
    }


    // GET item info
    const getItem = async () => {
        try {
            const data = await apiGetItem(storageRoomId, itemId);
            setItem(data);
            setLoading(false);
            
        } catch (err) {
            if (err.response.status === 401) {
                Swal.fire(messagesObj[t('locale')].sessionError)
                await logout();
                navigate('/login')
            } else if ( err.response.status === 403) {  // Access denied
                Swal.fire(messagesObj[t('locale')].accessDeniedError)
                navigate('/home')
            } else if (err.response.status === 404 ) { // Item not found
                Swal.fire(messagesObj[t('locale')].itemNotFoundError)
                navigate('/home')
            }
            setItem({})
        }
    }

    if (loading) {
        return(
            <div className="loader-clip-container">
                <ClipLoader className="custom-spinner-clip" loading={true} />
            </div>
        )
    }

    return(
        <div className='center'>
            <section className='content'>
                <h1>{t('titleEdit')}</h1>
                <EditItemForm args={args} itemArg={item}/>
            </section>
        </div>
    )
};
export default EditItemPage;