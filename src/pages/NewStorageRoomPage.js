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
import { apiSaveStorageRoom } from '../services/api';
import { logout } from "../services/logout";

import { ClipLoader } from 'react-spinners';


const NewStorageRoomPage = () => {

    const [currentStep, setCurrentStep] = useState(1);

    const [name, setName] = useState(null);
    const [tagsList, setTagsList] = useState([]);
    const [locationObj, setLocationObj] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace

    const navigate = useNavigate();
    

    const isNextButtonDisabled = () => {
        return (currentStep === 1 && (!name || name === '' )) ||
        (currentStep === 3 && (!locationObj.placesList || locationObj.placesList?.length === 0))
    }

    const handleSave = async () => {
        setIsLoading(true);
        await saveStorageRoom();
    }

    const saveStorageRoom = async () => {
        const storageRoom = {
            name: name,
            config: {
                tagsList: tagsList,
                locationObj: locationObj
            }
        };

        try {
            await apiSaveStorageRoom(storageRoom);
            Swal.fire(messagesObj[t('locale')].storageRoomCreated);
            // navigate('/home')
        } catch (err) {
            // await handleError(err);
        }
    }

    // To handle error depending on http error code
    const handleError = async (err) => {
        if (err.code === 'ERR_NETWORK') {
            Swal.fire(messagesObj[t('locale')].networkError);
            navigate('/login')
        } else if (err.response.status === 401) {
            Swal.fire(messagesObj[t('locale')].sessionError)
            await logout();
            navigate('/login')
        } else if ( err.response.status === 403) {  // Access denied
            Swal.fire(messagesObj[t('locale')].accessDeniedError)
            navigate('/home')
        } else if (err.response.status === 404 ) { // Item not found
            Swal.fire(messagesObj[t('locale')].itemNotFoundError)
            navigate('/home')
        } else if (err.response.status === 500) {
            Swal.fire(messagesObj[t('locale')].unexpectedError)
            await logout();
            navigate('/login')
        }
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

                <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div>
                 
                <Pagination
                    numSteps={4}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isNextButtonDisabled={isNextButtonDisabled()}
                    isSaveButtonDisabled={isLoading}
                    handleSave={handleSave}
                />


            </section>
        </div>
    )
    
};
export default NewStorageRoomPage;