import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TagsInput from './TagsInput';
import { apiGetTLoationsObj, apiGetTagsList, apiSaveItem, apiUploadImage } from '../services/api';
import Swal from 'sweetalert2';
// import { Navigate } from 'react-router-dom';
import ItemModel from '../schemas/item';
import messagesObj from '../schemas/messages';

const NewItemForm = ({args}) => {

    const tagList = args.tagList;
    const locationObj = args.locationObj;
    const placesList = locationObj != null ?  locationObj.placesList : null;
    // const zonesList = locationObj != null ?  locationObj.zonesList : null;
      
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSublocation] = useState(null);
    const [item, setItem] = useState(ItemModel);

    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

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
        changeState();
    }, [])

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

    const saveItem = async () => {
        try {
            const itemResponse = await apiSaveItem(item);
            setItem(itemResponse);
            setError(null);
            
            if (selectedFile){
                await uploadImage(itemResponse.id);
            } else {
                Swal.fire(messagesObj.newItemSuccess);
                navigate('/home');
            }      
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj.newItemError)
        } 
    }

    const uploadImage = async (itemId) => {
        try {            
            const response = await apiUploadImage(selectedFile, itemId);
            Swal.fire(messagesObj.newItemSuccess);
            navigate('/home')
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj.newItemImageError);
        }
    }

    const changeState = () => {
        setItem({...item,
            name: nameRef.current.value,
            // otherNamesList: otherNamesList,
            description: descriptionRef.current.value,
        })
    };

    const updateTagList = (tags) => {
        setSelectedTags(tags);
        setItem({...item, tagsList: tags.map(tag => tag.value) });
    }

    const addFile = (event) => {
        setSelectedFile(event.target.files[0]); // Only one photo
    }

    const changeOtherNamesList = (event) => {
        if (event != ''){
            setOtherNamesList(event);
            setItem({...item, otherNamesList: event})
        }
    }

    const changePlace = (event) => {
        setPlace(event);
        setLocation(null);
        setSublocation(null);
    }

    const changeLocation = (event) => {
        setLocation(event);
        setSublocation(null);

    }

    const changeSublocation = (event) => {
        setSublocation(event);
        setItem({...item, location: place.value + "/" + location.value + "/" + event.value})
    }

    return(
        <div>
            <form 
                className="new-form"
                onSubmit={handleSubmit}
                onChange={changeState}
            >
                <div className="formGroup">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        name="name"
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
                    />
                </div>

                <div className="formGroup">
                    <label htmlFor='location'>Ubicación</label>

                    <Select options={placesList} onChange={changePlace}/>
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
                    <textarea maxLength={300} ref={descriptionRef}/>
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
        </div>
    );

};
export default NewItemForm;