import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import TagsInput from '../utils/TagsInput';
import { apiSaveItem, apiUploadImage } from '../../services/api';
import handleError from '../../services/handleError';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

import {messagesObj} from '../../schemas/messages';

import { useTranslation } from 'react-i18next';
import ItemLocationForm from './ItemLocationForm';

const NewItemForm = ({args}) => {

    const tagsList = args.tagsList;
    const locationObj = args.locationObj;
    const placesList = locationObj != null ?  locationObj.placesList : null;
      
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [locationAll, setLocationAll] = useState(null);
    const [item, setItem] = useState({});

    const [isLent, setIsLent] = useState(false);

    const [isLentName, setIsLentName] = useState('');
    const [isLentDate, setIsLentDate] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const locationHook = useLocation();
    const { storageRoomId } = useParams();
    const { t, i18n } = useTranslation('itemForm'); // Load translations from the 'newItem' namespace

      
    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const [validator, setValidator] = useState(new SimpleReactValidator(
        { messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
        }
    }));

    // Change validator messages language
    useEffect(() => {
        changeState();
        setValidator(
            new SimpleReactValidator({
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );
    }, [i18n.language])

    useEffect(() => {
        changeState();
    }, [locationAll])

    const handleSubmit = (e)  => {
        e.preventDefault();
        changeState();
        if(validator.allValid()){
            setIsLoading(true);
            saveItem();
        }
        else{
            validator.showMessages();
        }
    };

    const saveItem = async () => {
        try {
            
            console.log(item)
            const itemResponse = await apiSaveItem(item, storageRoomId);
            setItem(itemResponse);
            
            if (selectedFile){
                await uploadImage(itemResponse.itemId);
            } else {
                Swal.fire(messagesObj[t('locale')].newItemSuccess);
            }      
        } catch (err) {

            await handleError(err, t('locale'), navigate);
        }
        navigate(`/storageRoom/${storageRoomId}`) 
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
            Swal.fire(messagesObj[t('locale')].newItemSuccess);
        } catch (err) {
            Swal.fire(messagesObj[t('locale')].newItemImageError);
        }
    }

    const changeState = () => {
        setItem({...item,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            location: locationAll
        })   
    };

    const updateTagsList = (tags) => {
        setSelectedTags(tags);
        setItem({...item, tagsList: tags.map(tag => tag.value) });
    }

    const handleFileChange = (event) => {
        let file = event.target.files[0] // Only one photo
        if (file){
            setSelectedFile(file); 
        }
    }

    const changeOtherNamesList = (event) => {
        if (event !== ''){
            setOtherNamesList(event);
            setItem({...item, otherNamesList: event})
        }
    }

    const changeLentName = (event) => {
        console.log(event.target.value)
        setIsLentName(event.target.value)
        let auxIsLent = `${event.target.value}/${isLentDate}`;
        setItem({...item, isLent: auxIsLent})
    }

    const changeLentDate = (event) => {
        setIsLentDate(event.target.value)
        let auxIsLent = `${isLentName}/${event.target.value}`;
        setItem({...item, isLent: auxIsLent})
    }

    return(
        <div>
            <form 
                className="custom-form"
                onSubmit={handleSubmit}
                // onChange={changeState}
            >
                {/* NAME */}
                <div className="formGroup">
                    <label htmlFor="name">{t('name')}</label>
                    <input
                        type="text"
                        name="name"
                        ref={nameRef}
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
                {(tagsList && tagsList.length > 0) && (               
                    <div className="formGroup">
                        <label htmlFor='tags'>{t('tags')}</label>
                        <Select
                            isMulti
                            options={tagsList}
                            onChange={updateTagsList}
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
                        setLocation={setLocationAll}
                    />
                </div>

                {/* <div className="formGroup">
                    <label htmlFor='location'>{t('location')}</label>
                    <Select
                        options={placesList}
                        onChange={changePlace}
                        placeholder={t('select')}
                        classNamePrefix="react-select" // Apply custom prefix
                    />
                    {validator.message('place', place, 'required')}

                    {(place && locationObj?.placeObj[place.value]?.zonesList) && 
                        <>
                        <Select
                            options={locationObj?.placeObj[place.value]?.zonesList}
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
                    <textarea maxLength={300} ref={descriptionRef} onChange={changeState}/>
                </div>

                {/* FILE */}
                <div className='formGroup'>
                    <label htmlFor='file0'>{t('image')}</label>
                    <input
                        type='file'
                        name='file0'
                        onChange={handleFileChange}
                        // accept='.jpg, .jpeg, .png'
                        accept="image/*"
                        // capture="camera"
                    />
                </div>

                {/* IS LENT */}
                <div className='formGroup'>
                    <label htmlFor='isLent'>{t('isLent')}</label>
                    <div className='radio-buttons-container'>
                        <div>{t('yes')}</div>
                        <input type='radio' name='isLent' value='yes'
                            checked={isLent}  // BLent is checked when isLent is true
                            onChange={() => setIsLent(true)}  // Set state to true when Lent is selected
                        />
                        <div>{t('no')}</div>
                        <input type='radio' name='isLent' value='no'
                            checked={!isLent}  // Lent is checked when isLent is true
                            onChange={() => setIsLent(false)}  // Set state to true when Lent is selected
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
                        {/* <button className='custom-button' type='submit' disabled={isLoading}>
                            {t('save')}
                        </button> */}
                        <button className="custom-button" type="submit" disabled={isLoading}>
                            {!isLoading ? (
                                <>{t('save')}</>
                            ) : (
                                <div className="custom-button-spinner-container">
                                    <ClipLoader
                                        className="custom-button-spinner"
                                        loading={true}
                                        color="white"
                                    />
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* <div className="loader-clip-container-small">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div> */}
                

            </form>
        </div>
    );

};
export default NewItemForm;