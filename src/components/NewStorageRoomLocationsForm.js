import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import TagsInput from './TagsInput';
import { useTranslation } from 'react-i18next';
import createOptionList from '../utils/createOptionList';

const NewStorageRoomLocationsForm = ({locationObj, setLocationObj}) => {
    

    const [placesList, setPlacesList] = useState(locationObj?.placesList?.map(place => place.label) || []);
    const [locationsList, setLocationsList] = useState([]);
    const [sublocationsList, setSublocationsList] = useState([]);
    
    const [placesOptionsList, setPlacesOptionsList] = useState(placesList.length > 0 ? createOptionList(placesList) : []);
    const [locationOptionsList, setLocationOptionsList] = useState([]);

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);


    const { t, i18n } = useTranslation('newStorageRoom'); // Load translations from the 'newItem' namespace

    const [validator, setValidator] = useState(new SimpleReactValidator(
        { messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
        }
    }));

    // Change validator messages language
    useEffect(() => {
        setValidator(
            new SimpleReactValidator({
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );
    }, [i18n.language])

    const changePlacesList = (event) => {
        const newPlace = event[event.length - 1];

        if (newPlace !== ''){
            const auxOptionsList = createOptionList(event);  // Creat list with {value: , label: }
                                   
            setPlacesList(event);
            setPlacesOptionsList(auxOptionsList);

            const auxPlaceObj = {...locationObj?.placeObj || {}};
            if (event.length < placesList.length) { // one has been deleted
                deleteSubItems(event, auxPlaceObj); // Delete locations associated with this place
                changePlace(null);
            }
            
            // Update object
            setLocationObj({...locationObj, placeObj: {...auxPlaceObj}, placesList: auxOptionsList});
        }
    }

    // Fucntion to delete locations associated with deleted place (or same with location and sublocation)
    const deleteSubItems = (event, auxObj) => {
        for (let place in auxObj) {
            if (!event.find(val => val === place)) {
                delete auxObj?.[place];
                break
            }
        }
    }

    // Change selected place from options and showing the respective associated locations 
    const changePlace = (e) => {
        setSelectedPlace(e);
        setLocationsList([...locationObj.placeObj?.[e?.value]?.zonesList?.map(val => val.value) || [] ]);
        setLocationOptionsList([...locationObj.placeObj?.[e?.value]?.zonesList])
        changeLocation(null);
    }

    // Change locations in the storageRoom config
    const changeLocationList = (event) => {
        const newPlace = event[event.length - 1];
        
        if (newPlace !== ''){
            const auxOptionsList = createOptionList(event);  // Creat list with {value: , label: }
            
            setLocationsList(event);
            setLocationOptionsList(auxOptionsList);


            const auxLocationObj = {...locationObj.locationObj?.placeObj || {}};
            if (event.length < locationsList.length) {  // one has been deleted
                deleteSubItems(event, auxLocationObj); // Delete sublocations associated with this location
                changeLocation(null);
            }
            
            setLocationObj({
                ...locationObj,
                placeObj: {
                    ...locationObj?.placeObj,
                    [selectedPlace?.value]: {zonesList: auxOptionsList}
                }
            })
        }
    }

    // Change selected location from options and showing the respective associated blocations 
    const changeLocation = (e) => {
        setSelectedLocation(e);
        setSublocationsList([...locationObj.placeObj?.[selectedPlace?.value]?.selfsObj?.[e?.value]?.map(val => val.value) || [] ]);
    }

     // Change sublocations in the storageRoom config
    const changeSublocationList = (event) => {
        const newPlace = event[event.length - 1];
        if (newPlace !== ''){
            const auxOptionsList = createOptionList(event);  // Creat list with {value: , label: }

            setSublocationsList(event);
            setLocationObj({
                ...locationObj,
                placeObj: {
                    ...locationObj.placeObj,
                    [selectedPlace?.value]: {
                        ...locationObj.placeObj?.[selectedPlace?.value],
                        selfsObj: {
                            ...locationObj.placeObj?.[selectedPlace?.value].selfsObj,
                            [selectedLocation?.value]: auxOptionsList
                        }
                    }
                }
            })
        }
    }

    return(
        <div>
            <form 
                className="custom-form"
            >
                <div className="formGroup">
                    <label htmlFor='places'>{t('places')}</label>
                    <TagsInput tagsList={placesList} setTagsList={changePlacesList}/>
                </div>

                {placesOptionsList.length > 0 && (
                    <>
                    <div className="formGroup">
                        <label htmlFor='location'>{t('place')}</label>
                        <Select
                            // isMulti
                            options={placesOptionsList}
                            onChange={changePlace}
                            value={selectedPlace}
                            placeholder={t('select')}
                            classNamePrefix="react-select" // Apply custom prefix
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor='locations'>{t('locations')}</label>
                        <TagsInput tagsList={locationsList} setTagsList={changeLocationList} isDisabled={!selectedPlace}/>
                    </div>

                    {locationOptionsList.length > 0 && (
                        <>
                        <div className="formGroup">
                            <label htmlFor='sublocation'>{t('location')}</label>
                            <Select
                                options={locationOptionsList}
                                onChange={changeLocation}
                                value={selectedLocation}
                                placeholder={t('select')}
                                classNamePrefix="react-select" // Apply custom prefix
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor='sublocations'>{t('sublocations')}</label>
                            <TagsInput tagsList={sublocationsList} setTagsList={changeSublocationList} isDisabled={!selectedLocation}/>
                        </div>
                        </> 
                    )}
                    </> 
                )}              

                              

            </form>

           

        </div>
    );

};
export default NewStorageRoomLocationsForm;