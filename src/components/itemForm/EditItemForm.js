import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiEditItem, apiUploadImage } from '../../services/api';
import {messagesObj} from '../../schemas/messages';
import handleError from '../../services/handleError';
import TagsInput from '../utils/TagsInput';
import { ClipLoader } from 'react-spinners';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import ItemLocationForm from './ItemLocationForm';

const EditItemForm = ({args, itemArg}) => {
 
    const { storageRoomId, itemId} = useParams();
    const [item, setItem] = useState(itemArg);
    
    const oldItem = itemArg;
    delete oldItem.dateLastEdited;

    const tagsList = args.tagsList;
    const locationObj = args.locationObj;
      
    // const nameRef = React.createRef();
    // const descriptionRef = React.createRef();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [locationAll, setLocationAll] = useState(itemArg.location);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileChanged, setIsFileChanged] = useState(false);
    const [isDifferent, setIsDifferent] = useState(false);
    const [isLent, setIsLent] = useState(itemArg.isLent != null);
    
    // const initialIsLent = itemArg.isLent != null;

    const [isLentName, setIsLentName] = useState('');
    const [isLentDate, setIsLentDate] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [itemSaving, setItemSaving] = useState(false);

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
        if (itemArg.tagsList && itemArg.tagsList.length > 0) {
            setSelectedTags(args.tagsList?.filter(option => itemArg.tagsList.includes(option.value)));
        }

        setName(itemArg.name || '');
        setDescription(itemArg.description || '');
                
        setOtherNamesList(itemArg.otherNamesList ? itemArg.otherNamesList : []); // Just in case item has no otherNamesList as attribute
        setLocationAll(itemArg.location)
       
        setLoading(false);

        if (isLent && itemArg.isLent != null){
            let [auxLentName, auxLentDate] = itemArg.isLent.split('/');
            setIsLentName(auxLentName);
            setIsLentDate(auxLentDate);
        }
    }, []);

    // Check if location has changed
    useEffect(() => {
        if (item && locationAll) {
           changeState();
        }
    }, [locationAll, name, description]);

    useEffect(() => {
        setValidator(
            new SimpleReactValidator({
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );
    }, [i18n.language]);
    
    const handleSubmit = (e)  => {
        e.preventDefault();
        changeState();
        if(validator.allValid()){
            setItemSaving(true);
            saveItem();
        }
        else{
            validator.showMessages();
        }
    };

    const changeState = () => {
        let auxItem = {
            ...item,
            name: name,
            description: description !== '' ? description : null,
            location: locationAll,
            otherNamesList: otherNamesList?.length > 0 ? otherNamesList : null,
            // tagsList: ta
        }
        auxItem = JSON.parse(JSON.stringify(auxItem, (key, value) => (value === null ? undefined : value)))
        setItem(auxItem)
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
    };

    const saveItem = async () => {
        try {
            const itemResponse = await apiEditItem(storageRoomId, item, itemId);
            setItem(itemResponse);            
            if (selectedFile){
                await uploadImage(itemResponse.itemId);
            } else {
                Swal.fire(messagesObj[t('locale')].editItemSuccess);   
            }      
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
        navigate(`/storageRoom/${storageRoomId}`)  // Go storage room page when success
    }

    // Uploads image throug a S3 url
    const uploadImage = async (itemId) => {
        try {            
            const fileExtension = `.${selectedFile.type.split('/')[1]}`;
            const response = await apiUploadImage(storageRoomId, itemId, fileExtension);
            const uploadUrl = response.data.uploadUrl;
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type,  // Make sure to set the correct MIME type
                },
                body: selectedFile,  // The actual file goes here
            });

            Swal.fire(messagesObj[t('locale')].editItemSuccess);
        } catch (err) {
            console.log(err)
            Swal.fire(messagesObj[t('locale')].editItemImageError);
        }
    }

    const changeOtherNamesList = (event) => {
        setOtherNamesList(event);
        let auxItem = {...item, otherNamesList: event};
        setItem(auxItem);
        setIsDifferent(!!(JSON.stringify(oldItem) !== JSON.stringify(auxItem)));
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
        return (
            <div className="loader-clip-container">
                <ClipLoader className="custom-spinner-clip" loading={true} />
            </div>
        )
    }
    
    return(
        <div>
            <form 
                className="custom-form"
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
                        // defaultValue={item.name}
                        // ref={nameRef}
                        value={name}
                        onBlur={() => validator.showMessageFor('name')}
                        onChange={(e) => {setName(e.target.value)}}
                    />
                    {validator.message('name', item.name, 'required|alpha_num_space')}
                </div>

                {/* OTHER NAMES */}
                <div className="formGroup">
                    <label htmlFor='otherNames'>{t('otherNames')}</label>
                    <TagsInput tagsList={otherNamesList} setTagsList={changeOtherNamesList}/>
                </div>

                {/* TAGS */}
                {(tagsList && tagsList.length > 0) && (     
                    <div className="formGroup">
                        <label htmlFor='tags'>{t('tags')}</label>
                        <Select
                            isMulti
                            options={tagsList}
                            onChange={updateTagsList}
                            isLoading={!tagsList}
                            value={selectedTags}
                            placeholder={t('select')}
                            classNamePrefix="react-select" // Apply custom prefix
                        />
                    </div>
                )}


                {/* LOCATION */}
                <div className="formGroup">
                    <label htmlFor='location'>{t('location')}</label>
                    <ItemLocationForm
                        validator={validator}
                        locationObj={locationObj}
                        location={locationAll}
                        setLocation={setLocationAll}
                    />
                </div>
                
                {/* LOCATION */}
                {/* <div className="formGroup">
                    <label htmlFor='location'>{t('location')}</label>
                    <Select
                        options={placesList}
                        onChange={changePlace}
                        value={place}
                        placeholder={t('select')}
                        classNamePrefix="react-select" // Apply custom prefix
                    />
                    {validator.message('place', place, 'required')}

                    {(place && locationObj.placeObj[place.value]?.zonesList) && 
                        <>
                        <Select
                            options={locationObj.placeObj[place.value].zonesList}
                            onChange={changeLocation}
                            value={location}
                            placeholder={t('select')}
                            classNamePrefix="react-select" // Apply custom prefix
                        />
                        {validator.message('location', location, 'required')}
                        </>
                    }
                                       
                    
                    {((location && place) && locationObj?.placeObj[place.value]?.selfsObj[location.value]) &&
                        <>
                        <Select
                            options={locationObj.placeObj[place.value].selfsObj[location.value]}
                            onChange={changeSublocation}
                            value={sublocation}
                            placeholder={t('select')}
                            classNamePrefix="react-select" // Apply custom prefix  
                        /> 
                        {validator.message('sublocation', sublocation, 'required')}
                        </>                  
                    }
                                            
                </div> */}

                {/* DESCRIPTION */}
                <div className="formGroup">
                    <label htmlFor='description'>
                        {t('description')}
                    </label>
                    <textarea
                        maxLength={300}
                        // ref={descriptionRef}
                        // defaultValue={item.description}
                        value={description}
                        onChange={(e) => {setDescription(e.target.value)}}
                    />
                </div>

                {/* IMAGE */}
                <div className='formGroup'>
                    {(!isFileChanged) && (
                        <div className='thumb-image-container'>
                            {(item.imageUrl && item.imageUrl.thumbnail !== "") && (
                                <img src={item.imageUrl.thumbnail} alt={item.name} className="thumb"/> 
                            )}

                            {(item.imageUrl && item.imageUrl.thumbnail !== "") && (
                                <div className='delete-button' onClick={removeImage}>
                                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                        close
                                    </span>
                                </div>
                            )}
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
                        <button className='custom-button' type='submit' disabled={(!isDifferent && !isFileChanged) || itemSaving}>
                            {t('save')}
                        </button>
                    </div>
                </div>

                <div className="loader-clip-container-small">
                    <ClipLoader className="custom-spinner-clip" loading={itemSaving} />
                </div>
                

            </form>
            
            

        </div>
    )
}
export default EditItemForm;