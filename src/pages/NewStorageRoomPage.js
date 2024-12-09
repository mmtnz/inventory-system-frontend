import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import messagesObj from '../schemas/messages';

import NewStorageRoomNameForm from '../components/NewStorageRoomNameForm';
import NewStorageRoomTagsForm from '../components/NewStorageRoomTagsForm';
import NewStorageRoomLocationsForm from '../components/NewStorageRoomLocationsForm';
import NewStorageRoomConfirmation from '../components/NewStorageRoomConfirmation';


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
                 

                <div className='step-buttons-container'>
                    <div className='button-container'>
                        <button className='custom-button' disabled={currentStep === 1} onClick={() => {setCurrentStep(currentStep - 1)}}>
                            {t('back')}
                        </button>
                    </div>

                    <div className="pagination-bars-container">
                        {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`pagination-bar ${currentStep >= step ? 'active' : ''}`}
                        ></div>
                        ))}
                    </div>

                    {(currentStep < 4) ? (
                        <div className='button-container'>
                            <button
                                className='custom-button'
                                onClick={() => {setCurrentStep(currentStep + 1)}}
                                disabled={isNextButtonDisabled()}
                            >
                                {t('next')}
                            </button>
                        </div>
                    ): (
                        <div className='button-container'>
                            <button className='custom-button' onClick={handleSave}>
                                {t('save')}
                            </button>
                        </div>
                    )}
                    
                </div>


            </section>
        </div>
    )
    
};
export default NewStorageRoomPage;