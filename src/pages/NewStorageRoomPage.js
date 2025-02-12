import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {messagesObj} from '../schemas/messages';

import NewStorageRoomNameForm from '../components/newStorageRoom/NewStorageRoomNameForm';
import NewStorageRoomTagsForm from '../components/newStorageRoom/NewStorageRoomTagsForm';
import NewStorageRoomLocationsForm from '../components/newStorageRoom/NewStorageRoomLocationsForm';
import NewStorageRoomConfirmation from '../components/newStorageRoom/NewStorageRoomConfirmation';
import Pagination from '../components/utils/Pagination';
import { apiSaveStorageRoom } from '../services/api';
import handleError from '../services/handleError';
import AuthContext from '../services/AuthContext';

import { ClipLoader } from 'react-spinners';
import createOptionList from '../utils/createOptionList';
import filterTreeData from '../utils/filterTreeData';


const NewStorageRoomPage = () => {

    const [currentStep, setCurrentStep] = useState(1);

    const [name, setName] = useState('');
    const [tagsList, setTagsList] = useState([]);
    const [locationObj, setLocationObj] = useState({});
    const [locationTree, setLocationTree] = useState({name: 'root', children: []});


    const [isLoading, setIsLoading] = useState(false);

    const {setStorageRoomsList, setStorageRoomsAccessList} = useContext(AuthContext);
    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace

    const navigate = useNavigate();
    

    const isNextButtonDisabled = () => {
        return (currentStep === 1 && (!name || name === '' )) ||
        (currentStep === 3 && (locationTree.children?.length === 0))
    }

    const handleSave = async () => {
        setIsLoading(true);
        await saveStorageRoom();
    }

    const saveStorageRoom = async () => {
        const storageRoom = {
            name: name,
            config: {
                tagsList: createOptionList(tagsList),
                locationObj: filterTreeData(locationTree),
            }
        };

        try {
            const newStorageRoom = await apiSaveStorageRoom(storageRoom);
            Swal.fire(messagesObj[t('locale')].storageRoomCreated);
            // Force to query again storage rooms so the new one appears
            setStorageRoomsList(null);
            setStorageRoomsAccessList(null);
            navigate(`/storageRoom/${newStorageRoom.storageRoomId}`)
        } catch (err) {
            await handleError(err, t('locale'), navigate);
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
                    <NewStorageRoomLocationsForm locationTree={locationTree} setLocationTree={setLocationTree}/>
                )}

                {currentStep === 4 && (
                    <NewStorageRoomConfirmation name={name} locationTree={locationTree} tagsList={tagsList}/>
                )}
{/* 
                <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div> */}
                 
                <Pagination
                    numSteps={4}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isNextButtonDisabled={isNextButtonDisabled()}
                    isSaveButtonDisabled={isLoading}
                    handleSave={handleSave}
                    isSaving={isLoading}
                    
                />
            </section>
        </div>
    )
    
};
export default NewStorageRoomPage;