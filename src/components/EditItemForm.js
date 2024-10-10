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
import { useTranslation } from 'react-i18next';

const EditItemForm = ({args, itemArg}) => {
 
    const { storageRoomId, itemId} = useParams();
    const [item, setItem] = useState(itemArg);
    const oldItem = itemArg;
    delete oldItem.dateLastEdited;

    const tagsList = args.tagsList;
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
    const [isDifferent, setIsDifferent] = useState(false);
    const [isLent, setIsLent] = useState(itemArg.isLent != null);
    const initialIsLent = itemArg.isLent != null;

    const [isLentName, setIsLentName] = useState('');
    const [isLentDate, setIsLentDate] = useState('');
    
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);
    let url = API_BASE_URL;

    const navigate = useNavigate();
    const { t, i18n } = useTranslation('itemForm'); // Load translations from the 'itemForm' namespace
    
    
    const [validator, setValidator] = useState(new SimpleReactValidator(
        { messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
        }
    }));

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        console.log('entro use')
        console.log(item)
        if (item.tagsList && item.tagsList.length > 0) {
            setSelectedTags(tagsList.filter(option => item.tagsList.includes(option.value)));
        }
                
        setOtherNamesList(item.otherNamesList ? item.otherNamesList : []); // Just in case item has no otherNamesList as attribute

        let [auxPlace, auxLoc, auxSubLoc] = item.location.split('/');
        setPlace(placesList.find(option => auxPlace.includes(option.value)));
        setLocation(locationObj.placeObj[auxPlace].zonesList.find(option => auxLoc.includes(option.value)));
        setSubLocation(locationObj.placeObj[auxPlace].selfsObj[auxLoc].find(option => auxSubLoc.includes(option.value)));
        setLoading(false);

        if (isLent && item.isLent != null){
            let [auxLentName, auxLentDate] = item.isLent.split('/');
            setIsLentName(auxLentName);
            setIsLentDate(auxLentDate);
        }

        setValidator(
            new SimpleReactValidator({
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );

    }, [item, tagsList, locationObj, placesList, i18n.language]);
    
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
        
        console.log('enro change state')
        let auxItem = {
            ...item,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            // date: {created: item.date.created}
        }

        setItem(auxItem)
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
        console.log(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)))
        // console.log("entro")
    };

    const saveItem = async () => {
        try {
            const itemResponse = await apiEditItem(storageRoomId, item, itemId);
            setItem(itemResponse);
            setError(null);
            
            if (selectedFile){
                await uploadImage(itemResponse.itemId);
            } else {
                Swal.fire(messagesObj[t('locale')].editItemSuccess);
                navigate('/home');
            }      
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj[t('locale')].editItemError)
        } 
    }

    const uploadImage = async (itemId) => {
        try {            
            const fileExtension = `.${selectedFile.type.split('/')[1]}`;
            const response = await apiUploadImage(storageRoomId, itemId, selectedFile);
            const uploadUrl = response.data.uploadUrl;
            const responseImage = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type,  // Make sure to set the correct MIME type
                },
                body: selectedFile,  // The actual file goes here
            });

            Swal.fire(messagesObj[t('locale')].editItemSuccess);
            navigate('/home')
        } catch (err) {
            console.log(err)
            setError(err);
            Swal.fire(messagesObj[t('locale')].editItemImageError);
        }
    }

    const changeOtherNamesList = (event) => {
        setOtherNamesList(event);
        let auxItem = {...item, otherNamesList: event};
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
    }

    const changePlace = (e) => {
        setPlace(e);
        setLocation(null);
        setSubLocation(null);
    }

    const changeLocation = (e) => {
        setLocation(e);
        setSubLocation(null);
    }

    const changeSublocation = (e) => {
        setSubLocation(e);
        let auxItem = {...item, location: place.value + "/" + location.value + "/" + e.value};
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
        console.log(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)))
    }

    

    const updateTagsList = (tags) => {
        setSelectedTags(tags);
        let auxItem = {...item, tagsList: tags.map(tag => tag.value) }
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
    }

    const addFile = (event) => {
        setSelectedFile(event.target.files[0]); // Only one photo
        setIsFileChanged(true);
    }

    const changeIsLent = (value) => {
        let lentState = value === 'true';
        console.log(lentState)
        
        setIsLent(lentState);
        let auxItem = {
            ...item,
            isLent: lentState && isLentName && isLentDate
                            ? `${isLentName}/${isLentDate}`
                            : null
        };
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
        console.log(auxItem)
        console.log(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)))
    }

    const changeLentName = (event) => {
        setIsLentName(event.target.value)
        let auxIsLent = `${event.target.value}/${isLentDate}`;
        let auxItem = {...item, isLent: auxIsLent};
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
    }

    const changeLentDate = (event) => {
        setIsLentDate(event.target.value)
        let auxIsLent = `${isLentName}/${event.target.value}`;
        let auxItem = {...item, isLent: auxIsLent};
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
    }

    const removeImage = () => {
        setIsFileChanged(true);
        let auxItem = {...item, imageUrl: null};
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
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
                    // onChange={changeState}
                    // onClick={() => {setIsDifferent(oldItem === item)}}
                >
                    {/* NAME */}
                    <div className="formGroup">
                        <label htmlFor="name">{t('name')}</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={item.name}
                            ref={nameRef}
                            onBlur={() => validator.showMessageFor('name')}
                            onChange={changeState}
                        />
                        {validator.message('name', item.name, 'required|alpha_num_space')}
                    </div>

                    {/* OTHER NAMES */}
                    <div className="formGroup">
                        <label htmlFor='otherNames'>{t('otherNames')}</label>
                        <TagsInput tagsList={otherNamesList} setTagsList={changeOtherNamesList}/>
                    </div>

                    {/* TAGS */}
                    <div className="formGroup">
                        <label htmlFor='tags'>{t('tags')}</label>
                        <Select
                            isMulti
                            options={tagsList}
                            onChange={updateTagsList}
                            isLoading={!tagsList}
                            value={selectedTags}
                            placeholder={t('select')}
                        />
                    </div>

                    {/* LOCATION */}
                    <div className="formGroup">
                        <label htmlFor='location'>{t('location')}</label>
                        <Select
                            options={placesList}
                            onChange={changePlace}
                            value={place}
                            placeholder={t('select')}
                        />
                        {validator.message('place', place, 'required')}
                        {place && 
                            <Select
                                options={locationObj.placeObj[place.value].zonesList}
                                onChange={changeLocation}
                                value={location}
                                placeholder={t('select')}
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
                                placeholder={t('select')}  
                            />                   
                        }
                        {(location && place) && 
                            <div>
                                {validator.message('sublocation', sublocation, 'required')}
                            </div>
                        }
                            
                    </div>

                    {/* DESCRIPTION */}
                    <div className="formGroup">
                        <label htmlFor='description'>
                            {t('description')}
                        </label>
                        <textarea
                            maxLength={300}
                            ref={descriptionRef}
                            defaultValue={item.description}
                            onChange={changeState}
                        />
                    </div>

                    {/* IMAGE */}
                    <div className='formGroup'>
                        {(!isFileChanged) && (
                            <div className='thumb-image-container'>
                                {item.imageUrl && item.imageUrl !== "" ? (
                                    <img src={item.imageUrl} alt={item.name} className="thumb"/> 
                                ):(
                                    <img src={defaultImage} className="thumb"/>
                                )}

                                <div className='delete-button' onClick={removeImage}>
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        
                        <label htmlFor='file0'>{t('image')}</label>
                        <input type='file' name='file0' onChange={addFile} accept='.jpg, .jpeg, .png'/>
                    </div>

                    {/* IS LENT */}
                    <div className='formGroup'>
                        <label htmlFor='isLent'>{t('isLent')}</label>
                        <div className='radio-buttons-container'>
                            <div>{t('yes')}</div>
                            <input type='radio' name='isLent' value={true}
                                checked={isLent}  // Lent is checked when isLent is true
                                onChange={(e) => changeIsLent(e.target.value)}  // Set state to true when Lent is selected
                            />
                            <div>{t('no')}</div>
                            <input type='radio' name='isLent' value={false}
                                checked={!isLent}  // Lent is checked when isLent is true
                                onChange={(e) => changeIsLent(e.target.value)}  // Set state to true when Lent is selected
                            />
                        </div>
                    </div>

                    {isLent &&
                    <>
                        <div className='formGroup'>
                            <label htmlFor='isLentName'>{t('whom')}</label>
                            <input type='text' name='isLentName' placeholder={t('name')} value={isLentName}
                                onChange={changeLentName}
                            />
                            {validator.message('isLentName', isLentName, isLent ? 'required|alpha_space' : '')}
                        </div>

                        <div className='formGroup'>
                            <label htmlFor='isLentDate'>{t('when')}</label>
                            <input aria-label="Date" type="date" value={isLentDate} max={today}
                                onChange={changeLentDate}
                            />
                            {validator.message('isLentDate', isLentDate, isLent ? 'required' : '')}
                        </div>
                    </>
                }


                    <div className='formGroup'>
                        <div className='button-container'>
                            <button className='custom-button' type='submit' disabled={!isDifferent && !isFileChanged}>
                                {t('save')}
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