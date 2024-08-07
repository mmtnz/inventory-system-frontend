import React, { useEffect, useState } from 'react';
import EditItemForm from '../components/NewItemForm';
import { apiGetTagsList, apiGetTLoationsObj } from '../services/api';

const EditItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    
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
                <h1>Editar elemento</h1>
                <EditItemForm args={args}/>
            </section>
        </div>
    )
};
export default EditItemPage;