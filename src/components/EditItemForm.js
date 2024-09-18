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
import messagesObj from '../schemas/messages';

const EditItemForm = ({args, itemArg}) => {
 
    const itemId = useParams().id;
    const [item, setItem] = useState(itemArg);
    const oldItem = itemArg;
    delete oldItem.date.lastEdited;

    const tagList = args.tagList;
    const locationObj = args.locationObj;
    const placesList = locationObj != null ?  locationObj.placesList : null;

    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSubLocation] = useState(null);
      
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileChanged, setIsFileChanged] = useState(false);
    const [isDifferent, setIsDifferent] = useState(true);
    
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
        console.log(item)
        if (tagList.length > 0) {
            setSelectedTags(tagList.filter(option => item.tagsList.includes(option.value)));
        }
                
        setOtherNamesList(item.otherNamesList);

        let [auxPlace, auxLoc, auxSubLoc] = item.location.split('/');
        setPlace(placesList.find(option => auxPlace.includes(option.value)));
        setLocation(locationObj.placeObj[auxPlace].zonesList.find(option => auxLoc.includes(option.value)));
        setSubLocation(locationObj.placeObj[auxPlace].selfsObj[auxLoc].find(option => auxSubLoc.includes(option.value)));
        setLoading(false);
    }, [item, tagList, locationObj, placesList]);
    
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
        console.log(item)
        console.log(oldItem)
        // const auxTags = selectedTags.map(tag => tag.value);
        let auxItem = {
            ...item,
            name: nameRef.current.value,
            // otherNamesList: otherNamesList,
            // tagsList: auxTags,
            // location: location.value + "/" + sublocation.value,
            description: descriptionRef.current.value,
            date: {created: item.date.created}
        }
        setItem(auxItem)
        setIsDifferent(JSON.stringify(oldItem) === JSON.stringify(auxItem));
        console.log(oldItem == auxItem)
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
                Swal.fire(messagesObj.editItemSuccess);
                navigate('/home');
            }      
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj.editItemError)
        } 
    }

    const changeOtherNamesList = (event) => {
        setOtherNamesList(event);
        let auxItem = {...item, otherNamesList: event};
        setItem(auxItem);
        setIsDifferent(JSON.stringify(oldItem) === JSON.stringify(auxItem));
    }

    const changePlace = (e) => {
        setPlace(e);
        setLocation(null);
        setSubLocation(null);
        setIsDifferent(true);
    }

    const changeLocation = (e) => {
        setLocation(e);
        setSubLocation(null);
        setIsDifferent(true);
    }

    const changeSublocation = (e) => {
        setSubLocation(e);
        let auxItem = {...item, location: place.value + "/" + location.value + "/" + e.value};
        setItem(auxItem);
        setIsDifferent(JSON.stringify(oldItem) === JSON.stringify(auxItem));
    }

    const uploadImage = async (itemId) => {
        try {            
            const response = await apiUploadImage(selectedFile, itemId);
            Swal.fire(messagesObj.editItemSuccess);
            navigate('/home')
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj.editItemImageError);
        }
    }

    const updateTagList = (tags) => {
        setSelectedTags(tags);
        let auxItem = {...item, tagsList: tags.map(tag => tag.value) }
        setItem(auxItem);
        setIsDifferent(JSON.stringify(oldItem) === JSON.stringify(auxItem));
    }

    const addFile = (event) => {
        setSelectedFile(event.target.files[0]); // Only one photo
        setIsFileChanged(true);
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
                    // onClick={() => {setIsDifferent(oldItem === item)}}
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
                        <Select options={placesList} onChange={changePlace} value={place}/>
                        {validator.message('place', place, 'required')}
                        {place && 
                            <Select
                                options={locationObj.placeObj[place.value].zonesList}
                                onChange={changeLocation}
                                value={location}
                            />
                        }
                        {place &&
                            <div>
                                {validator.message('location', location, 'required')}
                            </div>
                        }
                        
                        
                        {(location && place) && 
                            <Select
                                options={locationObj.placeObj[place.value].selfsObj[location.value]}
                                onChange={changeSublocation}
                                value={sublocation}  
                            />                   
                        }
                        {(location && place) && 
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
                        {(!isFileChanged) && (
                            <div className='thumb-image-container'>
                                {item.image !== null && item.image !== "" ? (
                                    <img src={`${url}/image/${item.image}`} alt={item.name} className="thumb"/> 
                                ):(
                                    <img src={defaultImage} className="thumb"/>
                                )}
                            </div>
                        )}
                        
                        
                        <label htmlFor='file0'>Imagen</label>
                        <input type='file' name='file0' onChange={addFile} accept='.jpg, .jpeg, .png'/>
                        
                    </div>

                    <div className='formGroup'>
                        <div className='save-button-container'>
                            <button className='save-button' type='submit' disabled={isDifferent && !isFileChanged}>
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