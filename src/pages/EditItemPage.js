import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import EditItemForm from '../components/EditItemForm';
import { apiGetItem } from '../services/api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGetStorageRoomsList } from "../services/api";
import { ClipLoader } from 'react-spinners';
import handleError from '../services/handleError';
import Swal from 'sweetalert2';
import {messagesObj} from '../schemas/messages';


const EditItemPage = () => {

    const [args, setArgs] = useState({tagsList: null, locationObj: null});
    const {storageRoomId, itemId} = useParams();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);

    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
    useEffect(() => {
        if (!storageRoomsList || !storageRoomsAccessList){
            getStorageRoomData();        
        } else {
            const storRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            const storageRoomPermission = storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            if (!storRoom || !storageRoomPermission) {
                handleError({response: {status: 404}}, t('locale'), navigate);
            } else {
                const storageRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
                setArgs(storageRoom?.config);           
            }
            
        }
        getItemData();
    }, [])

    // Get storage room info
    const getStorageRoomData = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList);
            const storageRoom = response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            const storageRoomPermission = response.storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            if (!storageRoom || !storageRoomPermission){
                await handleError({response: {status: 403}}, t('locale'), navigate);
            }
            if (storageRoomPermission?.permissionType === 'read'){
                Swal.fire(messagesObj[t('locale')].readOnlyPermission)
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            navigate(`/storageRoom/${storageRoomId}`);
                        }
                    }
                );
            }
            setArgs(storageRoom?.config);

        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    const getItemData = () => {
        // Check if item is passed as state from Item page
        if (location.state?.item) {
            setItem(location.state?.item);
        } else {
            getItem();
        }
        setLoading(false);
    }

    // GET item info from backend
    const getItem = async () => {
        try {
            const data = await apiGetItem(storageRoomId, itemId);
            setItem(data);           
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    if (loading || JSON.stringify(item) === JSON.stringify({}) || !args.tagsList || !args.locationObj) {
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