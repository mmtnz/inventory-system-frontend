import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { apiGetItem } from '../services/api';

import Select from 'react-select';
import TagsInput from './TagsInput';
import { apiGetTLoationsObj, apiGetTagsList, apiSaveItem, apiUploadImage } from '../services/api';
import Swal from 'sweetalert2';

const EditItemForm = ({args, itemArg}) => {
 
    const itemId = useParams().id;
    const tagList = args.tagList;
    const locationObj = args.locationObj;

    const zonesList = locationObj != null ?  locationObj.zonesList : null;
      
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSubLocation] = useState(null);
    const [item, setItem] = useState(itemArg);

    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [loading ,setLoading] = useState(true);
    
    const [displayTags, setDisplayTags] = useState([]);

    const navigate = useNavigate();
    
    //Default messages in Spanish
    const customMessages = {
        default: 'Este campo no es válido.',
        required: 'Este campo es obligatorio.',
        name: "Este campo es obligatorio",
        min: 'El valor debe ser mayor o igual a :min caracteres.',
        max: 'El valor debe ser menor o igual a :max caracteres.',
        email: 'El correo electrónico no es válido.',
    };

    const [validator] = useState(new SimpleReactValidator({ messages: customMessages }));

    useEffect(() => {
        console.log(args)
        console.log(item)
        // getItem();
        setSelectedTags(item.tagList);
        console.log(item.tagsList)
        console.log(tagList.filter(option => item.tagsList.includes(option.value)))
        setDisplayTags(tagList.filter(option => item.tagsList.includes(option.value)))
        setLoading(false);
    }, [])

    const getItem = async () => {
        try {
            const data = await apiGetItem(itemId);
            setItem(data);
            setError(null);

            setSelectedTags(data.tagList);
            if (tagList) {
                setDisplayTags(tagList.filter(option => data.tagsList.includes(option.value)))
            }
            
        } catch (err) {
            setItem({})
            console.log(err)
            setError('Error cargando elemento')
        }
    }
    
    const handleSubmit = (e)  => {
        e.preventDefault();
        changeState();
        if(validator.allValid()){
            saveItem();
        }
        else{
            validator.showMessages();
        }
    };

    const changeState = () => {
        setItem({
            name: nameRef.current.value,
            otherNamesList: otherNamesList,
            tagsList: selectedTags,
            location: location + "/" + sublocation,
            description: descriptionRef.current.value, 
        })
    };

    const saveItem = async () => {
        try {
            console.log(item)
            const itemResponse = await apiSaveItem(item);
            setItem(itemResponse);
            setError(null);
            
            if (selectedFile){
                await uploadImage(itemResponse.id);
            } else {
                Swal.fire({
                    title: 'Elemento creado',
                    text: "El elemento se ha creado correctamente",
                    icon: "success"
                });
                navigate('/home');
            }      
        } catch (err) {
            setError(err);
            Swal.fire({
                title: 'Error',
                text: "Error creando elemento",
                icon: "error"
            })
        } 
    }

    const uploadImage = async (itemId) => {
        try {            
            const response = await apiUploadImage(selectedFile, itemId);
            Swal.fire({
                title: 'Elemento creado',
                text: "El elemento se ha creado correctamente",
                icon: "success"
            });
            navigate('/home')
        } catch (err) {
            setError(err);
            Swal.fire({
                title: 'Error',
                text: "Error guardando imagen",
                icon: "error"
            });
        }
    }

    const updateTagList = (tags) => {
        setDisplayTags(tags)
        const aux = [];
        if (tags && tags.length > 0) {
            tags.forEach(tag => aux.push(tag.value));
        }
        setSelectedTags(aux);
    }

    const addFile = (event) => {
        setSelectedFile(event.target.files[0]); // Only one photo
    }

    const changeLocation = (event) => {
        setLocation(event.value);
    }

    const changeSubLocation = (event) => {
        setSubLocation(event.value);
    }

    if (loading && args.tagList !== null) {
        <div>Loading..</div>
    }
    
    return(
        <div>
            {item.name ? (
                <form 
                    className="edit-form"
                    onSubmit={handleSubmit}
                    onChange={changeState}
                >
                    <div className="formGroup">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={item.name}
                            ref={nameRef}
                            onBlur={() => validator.showMessageFor('name')}
                        />
                        {validator.message('name', item.name, 'required|alpha_num_space')}
                    </div>

                    <div className="formGroup">
                        <label htmlFor='otherNames'>Otros nombres</label>
                        <TagsInput tagList={otherNamesList} setTagList={setOtherNamesList}/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor='tags'>Tags</label>
                        <Select
                            isMulti
                            options={tagList}
                            onChange={updateTagList}
                            isLoading={!item.tagsList.length}
                            // defaultValue={initialTags}
                            value={displayTags}

                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor='location'>Ubicación</label>
                        <Select options={zonesList} onChange={changeLocation}/>
                        {location && 
                            <Select options={locationObj.selfsObj[location]} onChange={changeSubLocation}/>
                        }
                        {validator.message('location', location, 'required')}
                    </div>

                    <div className="formGroup">
                        <label htmlFor='description'>
                            Descripción
                        </label>
                        <textarea maxLength={300} ref={descriptionRef} defaultValue={item.description}/>
                    </div>

                    <div className='formGroup'>
                        <label htmlFor='file0'>Imagen</label>
                        <input type='file' name='file0' onChange={addFile} accept='.jpg, .jpeg, .png'/>
                    </div>

                    <div className='formGroup'>
                        <div className='save-button-container'>
                            <button className='save-button' type='submit'>
                                Guardar
                            </button>
                        </div>
                    </div>
                    

                </form>
            ): (
                <h2>Esperando articulo</h2>
            )}
            

        </div>
    )
}
export default EditItemForm;