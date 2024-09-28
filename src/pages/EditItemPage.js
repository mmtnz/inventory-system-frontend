import React, { useEffect, useState } from 'react';
import EditItemForm from '../components/EditItemForm';
import { apiGetTagsList, apiGetTLoationsObj } from '../services/api';
import { apiGetItem } from '../services/api';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const itemId = useParams().id;
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
    useEffect(() => {
        getArgs();       
    }, [])

    const getData = ()  => {
        getArgs();
        getItem();
        setLoading(false);
    }
    
    // Get options from the DB
    const getArgs = async () => {
        let tagList = await apiGetTagsList();
        let locationObj = await apiGetTLoationsObj();
        let aux = {
            tagList: tagList,
            locationObj: locationObj
        };
        setArgs(aux);
        getItem();
        // setLoading(false);
    }

    const getItem = async () => {
        try {
            const data = await apiGetItem(itemId);
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