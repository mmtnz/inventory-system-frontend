import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TagsInput from './TagsInput';
import { apiGetTLoationsObj, apiGetTagsList, apiSaveItem, apiUploadImage } from '../services/api';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

const NewItemForm = ({args}) => {

    const tagList = args.tagList;
    const locationObj = args.locationObj;
    
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [location, setLocation] = useState(null);
    const [item, setItem] = useState({});

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
            console.log(item.id) //use state nos updating on time
            
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

    const changeState = () => {
        setItem({
            name: nameRef.current.value,
            otherNamesList: otherNamesList, 
            description: descriptionRef.current.value, 
        })
    };

    const addFile = (event) => {
        setSelectedFile(event.target.files[0]); // Only one photo
    }

    const changeLocation = (event) => {
        setLocation(event.value)
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
                    <TagsInput tagList={otherNamesList} setTagList={setOtherNamesList}/>
                </div>

                <div className="formGroup">
                    <label htmlFor='tags'>Tags</label>
                    <Select
                        isMulti
                        options={tagList}
                    />
                </div>

                <div className="formGroup">
                    <label htmlFor='location'>Ubicación</label>
                    <Select options={locationObj} onChange={changeLocation}/>
                    {location && 
                        <Select options={locationObj}/>
                    }
                    {validator.message('location', location, 'required')}
                </div>

                <div className="formGroup">
                    <label htmlFor='description'  ref={descriptionRef}>
                        Descripción
                    </label>
                    <textarea maxLength={300}/>
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