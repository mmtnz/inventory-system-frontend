import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TagsInput from './TagsInput';
import { apiGetTLoationsObj, apiGetTagsList, apiSaveItem, apiUploadImage } from '../services/api';
import Swal from 'sweetalert2';

import ItemModel from '../schemas/item';
import messagesObj from '../schemas/messages';

import { useTranslation } from 'react-i18next';

const NewItemForm = ({args}) => {

    const tagList = args.tagList;
    const locationObj = args.locationObj;
    const placesList = locationObj != null ?  locationObj.placesList : null;
      
    const nameRef = React.createRef();
    const descriptionRef = React.createRef();
    const [selectedTags, setSelectedTags] = useState([]);
    const [otherNamesList, setOtherNamesList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSublocation] = useState(null);
    const [item, setItem] = useState(ItemModel);
    const [isLent, setIsLent] = useState(false);

    const [isLentName, setIsLentName] = useState('');
    const [isLentDate, setIsLentDate] = useState('');

    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
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
                console.log(messagesObj[t('locale')])
                Swal.fire(messagesObj[t('locale')].newItemSuccess);
                navigate('/home');
            }      
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj[t('locale')].newItemError)
        } 
    }

    const uploadImage = async (itemId) => {
        try {            
            const response = await apiUploadImage(selectedFile, itemId);
            Swal.fire(messagesObj[t('locale')].newItemSuccess);
            navigate('/home')
        } catch (err) {
            setError(err);
            Swal.fire(messagesObj[t('locale')].newItemImageError);
        }
    }

    const changeState = () => {
        // let auxLent = isLent && isLentName && isLentDate
        //     ? `${isLentName}/${isLentDate}`
        //     : null;

        setItem({...item,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            // isLent: auxLent
        })
        console.log(item)
    
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

    const changeLentName = (event) => {
        console.log(event.target.value)
        setIsLentName(event.target.value)
        let auxIsLent = `${event.target.value}/${isLentDate}`;
        setItem({...item, isLent: auxIsLent})
    }

    const changeLentDate = (event) => {
        console.log(event.target.value)
        setIsLentDate(event.target.value)
        let auxIsLent = `${isLentName}/${event.target.value}`;
        setItem({...item, isLent: auxIsLent})
    }

    return(
        <div>
            <form 
                className="new-form"
                onSubmit={handleSubmit}
                // onChange={changeState}
            >
                <div className="formGroup">
                    <label htmlFor="name">{t('name')}</label>
                    <input
                        type="text"
                        name="name"
                        ref={nameRef}
                        onChange={changeState}
                        // onBlur={() => validator.showMessageFor('name')}
                    />
                    {validator.message('name', item.name, 'required|alpha_num_space')}
                </div>

                <div className="formGroup">
                    <label htmlFor='otherNames'>{t('otherNames')}</label>
                    <TagsInput tagList={otherNamesList} setTagList={changeOtherNamesList}/>
                </div>

                <div className="formGroup">
                    <label htmlFor='tags'>{t('tags')}</label>
                    <Select
                        isMulti
                        options={tagList}
                        onChange={updateTagList}
                        placeholder={t('select')}
                    />
                </div>

                <div className="formGroup">
                    <label htmlFor='location'>{t('location')}</label>

                    <Select
                        options={placesList}
                        onChange={changePlace}
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

                <div className="formGroup">
                    <label htmlFor='description'>
                        {t('description')}
                    </label>
                    <textarea maxLength={300} ref={descriptionRef}/>
                </div>

                <div className='formGroup'>
                    <label htmlFor='file0'>{t('image')}</label>
                    <input
                        type='file'
                        name='file0'
                        onChange={addFile}
                        accept='.jpg, .jpeg, .png'
                    />
                </div>

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
                    <div className='save-button-container'>
                        <button className='custom-button' type='submit'>
                            {t('save')}
                        </button>
                    </div>
                </div>
                

            </form>
        </div>
    );

};
export default NewItemForm;