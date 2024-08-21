import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import API_BASE_URL, { apiGetItem } from "../services/api";
import defaultImage from "../assets/images/default.png"

import Select from 'react-select';
import TagsInput from './TagsInput';
import { apiEditItem, apiUploadImage } from '../services/api';
import Swal from 'sweetalert2';

const EditItemForm = ({args, itemArg}) => {
 
    const itemId = useParams().id;
    const [item, setItem] = useState(itemArg);

    const tagList = args.tagList;
    const locationObj = args.locationObj;
    const zonesList = locationObj ?  locationObj.zonesList : [];

    let auxLoc = item.location.split('/')[0];
    // let auxSubLoc = item.location.split('/')[1];
    // let auxLocOp = zonesList.filter(option => auxLoc.includes(option.value));
    // const [location, setLocation] = useState(auxLocOp);
    // const [sublocation, setSubLocation] = useState(locationObj.selfsObj[auxLoc].filter(option => auxSubLoc.includes(option.value)));
    // const [subLocOptions,] = useState(locationObj.selfsObj[auxLocOp.value]);
    // console.log(locationObj.selfsObj[location.value])
    // console.log(location.value)
    // console.log(locationObj.selfsObj)
    const [location, setLocation] = useState(null);
    const [sublocation, setSubLocation] = useState(null);
      
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);
    let url = API_BASE_URL;

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
        if (tagList.length > 0) {
            setSelectedTags(tagList.filter(option => item.tagsList.includes(option.value)));
        }
                
        setOtherNamesList(item.otherNamesList);

        let [auxLoc, auxSubLoc] = item.location.split('/');
        setLocation(zonesList.find(option => auxLoc.includes(option.value)));
        setSubLocation(locationObj.selfsObj[auxLoc].find(option => auxSubLoc.includes(option.value)));
        setLoading(false);
    }, [item, tagList, locationObj, zonesList]);
    
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
        const auxTags = selectedTags.map(tag => tag.value);
        setItem({
            ...item,
            name: nameRef.current.value,
            // otherNamesList: otherNamesList,
            // tagsList: auxTags,
            // location: location.value + "/" + sublocation.value,
            description: descriptionRef.current.value, 
        })
        console.log("entro")
    };

    const saveItem = async () => {
        try {
            const itemResponse = await apiEditItem(item, itemId);
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

    const changeOtherNamesList = (event) => {
        setOtherNamesList(event);
        setItem({...item, otherNamesList: event})
    }

    const changeLocation = (e) => {
        setLocation(e);
        setSubLocation(null);
    }

    const changeSubLocation = (e) => {
        setSubLocation(e);
        setItem({...item, location: location.value + "/" + e.value})
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
        setSelectedTags(tags);
        setItem({...item, tagsList: tags.map(tag => tag.value) });
    }

    const addFile = (event) => {
        setSelectedFile(event.target.files[0]); // Only one photo
    }

    
    if (loading) {
        return <div>Loading..</div>
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
                        <TagsInput tagList={otherNamesList} setTagList={changeOtherNamesList}/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor='tags'>Tags</label>
                        <Select
                            isMulti
                            options={tagList}
                            onChange={updateTagList}
                            isLoading={!item.tagsList.length}
                            value={selectedTags}

                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor='location'>Ubicación</label>
                        <Select options={zonesList} value={location} onChange={changeLocation}/>
                        {validator.message('location', location, 'required')}
                        {(location) && 
                            <Select options={locationObj.selfsObj[location.value]} value={sublocation} onChange={changeSubLocation}/>
                        }
                        {location && 
                            <div>
                                {validator.message('sublocation', sublocation, 'required')}
                            </div>
                        }
                        
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
                        {item.image !== null && item.image !== "" ? (
                            <img src={`${url}/image/${item.image}`} alt={item.name} className="thumb"/> 
                        ):(
                            <img src={defaultImage} className="thumb"/>
                        )}
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