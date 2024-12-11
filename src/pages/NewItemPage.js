import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import NewItemForm from '../components/NewItemForm';
import { useTranslation } from 'react-i18next';
import { apiGetStorageRoomsList } from "../services/api";
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {messagesObj} from '../schemas/messages';
import handleError from '../services/handleError';


const NewItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    const { storageRoomId } = useParams();
    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!storageRoomsList || !storageRoomsAccessList){
            getStorageRoomData();        
        } else {
            const storageRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            setArgs(storageRoom?.config);
        }
    }, [])
    

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
        } catch (err) {
            await handleError(err, t('locale'), navigate);
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