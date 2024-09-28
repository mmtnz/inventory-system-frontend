import React, { useEffect, useState } from 'react';
import NewItemForm from '../components/NewItemForm';
import { apiGetTLoationsObj, apiGetTagsList} from '../services/api';
import { useTranslation } from 'react-i18next';

const NewItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    const { t } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
    useEffect(() => {
        getArgs();
    }, [])
    
    // Get options from the DB
    const getArgs = async () => {
        let tagList = await apiGetTagsList();
        let locationObj = await apiGetTLoationsObj();
        let aux = {
            tagList: tagList,
            locationObj: locationObj
        };
        setArgs(aux);
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