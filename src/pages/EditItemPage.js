import React, { useEffect, useState } from 'react';
import EditItemForm from '../components/EditItemForm';
import { apiGetItem } from '../services/api';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStorageRoomInfo } from '../services/storageRoomInfoService';

const EditItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const {storageRoomId, itemId} = useParams();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
    useEffect(() => {
        // getArgs();
        getStorageRoomData();       
    }, [])

    // Get storage room info
    const getStorageRoomData = async () => {
        let storageRoomInfo = await getStorageRoomInfo(storageRoomId);
        setArgs(storageRoomInfo.config);
        getItem();
    }

    // const getData = ()  => {
    //     getArgs();
    //     getItem();
    //     setLoading(false);
    // }
    
    // // Get options from the DB
    // const getArgs = async () => {
    //     let tagList = await apiGetTagsList();
    //     let locationObj = await apiGetTLoationsObj();
    //     let aux = {
    //         tagList: tagList,
    //         locationObj: locationObj
    //     };
    //     setArgs(aux);
    //     getItem();
    //     // setLoading(false);
    // }

    // GET item info
    const getItem = async () => {
        try {
            const data = await apiGetItem(storageRoomId, itemId);
            setItem(data);
            setLoading(false);
            
        } catch (err) {
            setItem({})
        }
    }

    if (loading) {
        return(
            <div>
                <h2>Cargando...</h2>
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