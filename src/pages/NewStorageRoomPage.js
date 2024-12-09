import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import messagesObj from '../schemas/messages';

import NewStorageRoomNameForm from '../components/NewStorageRoomNameForm';
import NewStorageRoomTagsForm from '../components/NewStorageRoomTagsForm';
import NewStorageRoomLocationsForm from '../components/NewStorageRoomLocationsForm';
import NewStorageRoomConfirmation from '../components/NewStorageRoomConfirmation';
import Pagination from '../components/Pagination';


const NewStorageRoomPage = () => {

    const [currentStep, setCurrentStep] = useState(1);

    const [name, setName] = useState(null);
    const [tagsList, setTagsList] = useState([]);
    const [locationObj, setLocationObj] = useState({});

    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace

    const navigate = useNavigate();
    
    useEffect(() => {
        // getStorageRoomData();        
    }, [])

    const isNextButtonDisabled = () => {
        return (currentStep === 1 && (!name || name === '' )) ||
        (currentStep === 3 && (!locationObj.placesList || locationObj.placesList?.length === 0))
    }

    const handleSave = () => {
        const storageRoom = {
            name: name,
            config: {
                tagsList: tagsList,
                locationObj: locationObj
            }
        };
        console.log(storageRoom)
    }
    

    return(
        <div className='center'>
            <section className='content'>
                <h1>{t('title')}</h1>

                {currentStep === 1 && (
                    <NewStorageRoomNameForm name={name} setName={setName}/>
                )}

                {currentStep === 2 && (
                    <NewStorageRoomTagsForm tagsList={tagsList} setTagsList={setTagsList}/>
                )}

                {currentStep === 3 && (
                    <NewStorageRoomLocationsForm locationObj={locationObj} setLocationObj={setLocationObj}/>
                )}

                {currentStep === 4 && (
                    <NewStorageRoomConfirmation name={name} locationObj={locationObj} tagsList={tagsList}/>
                )}
                 
                <Pagination
                    numSteps={4}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isNextButtonDisabled={isNextButtonDisabled()}
                    handleSave={handleSave}
                />


            </section>
        </div>
    )
    
};
export default NewStorageRoomPage;