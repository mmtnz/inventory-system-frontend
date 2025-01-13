import React, {useState, useEffect, useContext} from "react";
import AuthContext from '../services/AuthContext';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { apiEditStorageRoom, apiGetStorageRoomsList } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import handleError from '../services/handleError';
import NewStorageRoomNameForm from "../components/NewStorageRoomNameForm";
import NewStorageRoomTagsForm from "../components/NewStorageRoomTagsForm";
import NewStorageRoomLocationsForm from "../components/NewStorageRoomLocationsForm";
import createOptionList from '../utils/createOptionList';
import filterTreeData from '../utils/filterTreeData';
import deepEqual from '../utils/deepEqual';
import Swal from "sweetalert2";
import {messagesObj} from "../schemas/messages";

const StorageRoomEditPage = () => {

    const {storageRoomId} = useParams();
    const { t } = useTranslation('storageRoom');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [storageRoom, setStorageRoom] = useState();
    const [name, setName] = useState('');
    const [tagsList, setTagsList] = useState([]);
    const [locationTree, setLocationTree] = useState({name: 'root', children: []});

    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Get storage room info if not already loaded
        if (!storageRoomsList || !setStorageRoomsAccessList) {
            setIsLoading(true);
            getStorageRoomsList();
        } else {
            const storRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId)
            setStorageRoom(storRoom);
            setName(storRoom.name);
            setTagsList(storRoom.config?.tagsList.map(tag => tag.label));
            setLocationTree(storRoom.config.locationObj)
            setIsLoading(false);
        }
    }, []);

    // Get a list with all the storage rooms the user has access and another one with the permission
    const getStorageRoomsList = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList);
            const storageRoomPermission = response.storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            // check if user has access to the storage room
            
            if (!storageRoomPermission){
                await handleError({response: {status: 403}}, t('locale'), navigate);
            }
            const storRoom = response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId)
            if (storageRoomPermission?.permissionType !== 'admin'){
                Swal.fire(messagesObj[t('locale')].deleteStorageRoomNoPermission)
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            navigate(`/storageRoom/${storageRoomId}`);
                        }
                    }
                );
            }
            if (!storRoom){
                navigate('/home')
            }
            setStorageRoom(storRoom);
            setName(storRoom.name);
            setTagsList(storRoom.config?.tagsList.map(tag => tag.label));
            setLocationTree(storRoom.config.locationObj)
            setIsLoading(false);
        } catch (err) {
            handleError(err, t("locale"), navigate)
        }
    }

    const isEqual = () => {
        const auxStor = {
            ...storageRoom,
            name: name,
            config: {
                tagsList: createOptionList(tagsList),
                locationObj: filterTreeData(locationTree)
            }
        }
        return deepEqual(storageRoom, auxStor)
    }

    const handleUpdate = async () => {
        setIsUpdating(true)
        const auxStor = {
            ...storageRoom,
            name: name,
            config: {
                tagsList: createOptionList(tagsList),
                locationObj: filterTreeData(locationTree)
            }
        }
        try {
            const result = await apiEditStorageRoom(storageRoomId, auxStor);
            console.log(result);
            setStorageRoom(result);
            setStorageRoomsList(null);
            navigate(`/storageRoom/${storageRoomId}`)
        } catch (err) {
            console.log(err)
            handleError(err, t("locale"), navigate)

        }
        setIsUpdating(false)

    }

    if (isLoading) {
        return(
            <div className='center'>
                <section className='content'>
                    <h1>{t('titleEdit')}</h1>
                    <div className="loader-clip-container">
                        <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                    </div>
                </section>
            </div>
        )
    }
    return(
        <div className='center'>
            <section className='content'>
                <h1>{t('titleEdit')}</h1>

                <div className="margin-bottom-2rem">
                    <NewStorageRoomNameForm name={name} setName={setName}/>
                </div>
                <div className="margin-bottom-2rem">
                    <NewStorageRoomTagsForm tagsList={tagsList} setTagsList={setTagsList}/>
                </div>
                <div className="margin-bottom-2rem">
                    <NewStorageRoomLocationsForm  locationTree={locationTree} setLocationTree={setLocationTree}/>
                </div>
                <div className='formGroup'>
                    <div className='button-container'>
                        <button className='custom-button' onClick={handleUpdate} disabled={isEqual() || isUpdating}>
                            {t('update')}
                        </button>
                    </div>
                </div>
                <div className="loader-clip-container">
                    <ClipLoader className="custom-spinner-clip" loading={isUpdating} />
                </div>
            </section>
        </div>
    )
};
export default StorageRoomEditPage;