import React, { useEffect, useState } from 'react';
import EditItemForm from '../components/EditItemForm';
import { apiGetTagsList, apiGetTLoationsObj } from '../services/api';
import { apiGetItem } from '../services/api';
import { useParams } from 'react-router-dom';

const EditItemPage = () => {

    const [args, setArgs] = useState({tagList: null, locationObj: null});
    // const url = API_BASE_URL;
    const itemId = useParams().id;
    const [item, setItem] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    
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
            setError(null);

            // setSelectedTags(data.tagList);
            // console.log(data)
            // if (tagList) {
            //     setInitialTags(tagList.filter(option => data.tagsList.includes(option.value)))
            // }
            setLoading(false);
            
        } catch (err) {
            setItem({})
            console.log(err)
            setError('Error cargando elemento')
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
                <h1>Editar elemento</h1>
                <EditItemForm args={args} itemArg={item}/>
            </section>
        </div>
    )
};
export default EditItemPage;