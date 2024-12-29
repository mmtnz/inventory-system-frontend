import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import NewItemForm from '../components/NewItemForm';
import { useTranslation } from 'react-i18next';
import { apiGetStorageRoomsList } from "../services/api";
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {messagesObj} from '../schemas/messages';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';


const NewItemPage = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    const { storageRoomId } = useParams();
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);

    const navigate = useNavigate();
    
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
        setIsLoading(false);
    }, [])
    

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
                <h1>{t('title')}</h1>
                <NewItemForm args={args}/>                                    
            </section>
        </div>
    )
    
};
export default NewItemPage;