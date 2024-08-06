import React, { useEffect, useState } from 'react';
import NewItemForm from '../components/NewItemForm';
import { apiGetTLoationsObj, apiGetTagsList} from '../services/api';

const NewItemPage = () => {

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
                <h1>Nuevo elemento</h1>
                <NewItemForm args={args}/>                                    
            </section>
        </div>
    )
    
};
export default NewItemPage;