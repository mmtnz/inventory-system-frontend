import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation} from "react-router-dom";
import AuthContext from '../../services/AuthContext';
import { apiDeleteItem, apiGetItem, apiReturnLent } from "../../services/api";
import handleError from "../../services/handleError";
import defaultImage from "../assets/images/default.png"
import Swal from 'sweetalert2';
import {messagesObj} from "../../schemas/messages";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import {getLocationString} from '../../utils/getLocationString'
import { apiGetStorageRoomsList } from "../../services/api";
// import { BarLoader } from 'react-spinners';

import Modal from 'react-modal';
import CustomModal from "../utils/CustomModal";
Modal.setAppElement('#root');  // Required for accessibility



const Item = ({args}) => {
    
    const tagsList = args.tagsList;
    const locationObj = args.locationObj;

    const {storageRoomId, itemId} = useParams();    
    const [item, setItem] = useState({});
    const [locationString, setLocationString] = useState(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [storageRoomPermission, setStorageRoomPermission] = useState(null); 

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [, forceUpdate] = useState();



    const {storageRoomsList, setStorageRoomsList, storageRoomsAccessList, setStorageRoomsAccessList} = useContext(AuthContext);

    const navigate = useNavigate();
    const locationState = useLocation();
    const { t, i18n } = useTranslation('item'); // Load translations from the 'item' namespace


    useEffect(() => {
        if (!storageRoomsList || !storageRoomsAccessList){
            getStorageRoomData();        
        } else {
            const storRoom = storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            const storRoomPermission = storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            if (!storRoom || !storRoomPermission) {
                handleError({response: {status: 404}}, t('locale'), navigate);
            }
            setStorageRoomPermission(storRoomPermission.permissionType);        
        }
        loadItem(); 
    }, []);  

    // Update Moment's locale based on the current language from i18next
    useEffect(() => {
        if (i18n.language === 'es') {
            moment.locale('es'); // Set Moment to use Spanish locale
        } else {
            moment.locale('en'); // Use default locale (English) if language is not Spanish
        }        
    }, [i18n.language]);  // Re-run whenever the language changes

    // Get storage room info
    const getStorageRoomData = async () => {
        try {
            const response = await apiGetStorageRoomsList();
            setStorageRoomsList(response.storageRoomsList);
            setStorageRoomsAccessList(response.storageRoomsAccessList);
            const storRoom = response.storageRoomsList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            const storRoomPermission = response.storageRoomsAccessList.find(storRoom => storRoom.storageRoomId === storageRoomId);
            if (!storRoom || !storRoomPermission){
                await handleError({response: {status: 403}}, t('locale'), navigate);
            }
            setStorageRoomPermission(storRoomPermission.permissionType);
            
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }
    

    const loadItem = async () => {
        try {
            let data;
            if (locationState.state?.item) {
                data = locationState.state?.item // Get item from state when clicking in item wrap
            } else {
                data = await apiGetItem(storageRoomId, itemId);
            }
            
            setItem(data);

            const auxList = data.location.split('/');
            setLocationString(auxList.join(' / '))
            setIsLoaded(true);
        } catch (err) {
            console.log(err)
            await handleError(err, t('locale'), navigate);
        }
    }

    // Confirm qith user if they want to delete he item
    const handleDelete = async () => {
        Swal.fire(messagesObj[t('locale')].deleteItemConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);
                    deleteItem();      
                }
            }
        )
    }
    
    // API call to delete item
    const deleteItem = async () => {
        try {
            await apiDeleteItem(storageRoomId, itemId);
            setIsLoading(false);
            Swal.fire(messagesObj[t('locale')].deleteItemSuccess);
            navigate(storageRoomId ?  `/storageRoom/${storageRoomId}` : '/home') 
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
    }

    const handleReturnLent = async () => {
        try {
            setIsLoading(true);
            let utcDate = new Date().toISOString().split('T')[0];
            let itemSaved = await apiReturnLent(storageRoomId, item, utcDate); 
            console.log(itemSaved)
            console.log(item)
            Swal.fire(messagesObj[t('locale')].editItemSuccess)
            setIsLoading(false);
            setItem({...item, isLent: null, lentHistory: itemSaved.lentHistory})
            // Navigate so it is also stored in location state just in case reload
            navigate(`/storageRoom/${item.storageRoomId}/item/${item.itemId}`, {state: {...item, isLent: null, lentHistory: itemSaved.lentHistory}});
        } catch (err) {
            await handleError(err, t('locale'), navigate);
        }
        forceUpdate();
    }

    // Go to edit page to edit this item. Item is sent as state so it doesn't need to be query again
    const goToEdit = () => {
        navigate(`/storageRoom/${storageRoomId}/item/${itemId}/edit`, { state: { item: item } });
        
    }

    if (!isLoaded) {
        return (
            <div className="loader-clip-container">
                <ClipLoader className="custom-spinner-clip" loading={true} />
            </div>
        )
    }

    return (
        <div>
            <div id="item">
                <h1>{item.name}</h1>
                <div className="item-container">
                    <div className="item-image-container">
                        {item.imageUrl && item.imageUrl.medium !== "" ? (
                            <img
                                src={item.imageUrl.medium}
                                alt={item.name}
                                className="image-item"
                            />
                        ):(
                            <img src={defaultImage} alt={'default'} className="image-item"/>
                        )}
                    </div>
                    
                    <div className="item-data">
                        <div className="item-data-group">
                            <label>{t('otherNames')}:</label>
                            {(item.otherNamesList && item.otherNamesList.length > 0) ? 
                                (<div className="tags-container">
                                    {item.otherNamesList.map((tag, index) => (
                                        <div className="tag-item" key={index}>
                                            <span className='tag'>{tag}</span>
                                        </div>
                                    ))}
                                </div>) : (
                                    '-'
                                )
                            }
                        </div>

                        <div className="item-data-group">
                            <label>{t('tags')}:</label>
                            {(item.tagsList && item.tagsList.length > 0) ? 
                                (<div className="tags-container">
                                    {item.tagsList.map((tag, index) => (
                                        <div className="tag-item" key={index}>
                                            <span className='tag'>{tagsList.find(tagValue => tag.includes(tagValue.value)).label}</span>
                                        </div>
                                    ))}
                                </div>) : (
                                    '-'
                                )
                            }
                        </div>

                        <div className="item-data-group">
                            <label>{t('location')}:</label>
                            <p>{locationString}</p>  
                        </div>
                        
                        <div className="item-data-group">
                            <label>{t('description')}:</label>
                            {(item.description !== '') ? (
                                <p>{item.description}</p>
                            ) : (
                                '-'
                            )}
                        </div>

                        <div className="item-data-group">
                            <label>{t('lent')}:</label>
                            <div className="lent-data-container">
                                {(item.isLent != null) && (
                                    <div className="lent-data-info-container">
                                        <Moment fromNow utc locale={i18n.language}>{item.isLent.split('/')[1]}</Moment>
                                        {t('to')} {item.isLent.split('/')[0]}
                                    </div>
                                )}

                            <div className="lent-data-button-container">
                                {(item.isLent) && (
                                    <button
                                        className='custom-button-small'
                                        onClick={handleReturnLent}
                                        disabled={storageRoomPermission === 'read'}
                                    >
                                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                            assignment_return                                            
                                        </span>
                                        {t('isReturned')}
                                    </button>
                                )}

                                <button
                                    className="custom-button-small"
                                    onClick={() => setModalIsOpen(true)}
                                    disabled={!item.lentHistory}
                                >
                                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                        history
                                    </span>
                                </button>
                            </div>


                            </div>                            
                        </div>

                        {item.lentHistory &&
                        <CustomModal
                            modalIsOpen={modalIsOpen}
                            setModalIsOpen={setModalIsOpen}
                            title={t('modalTitle')}
                            content={item.lentHistory}
                        />
                        }

                        <div className="item-data-group">
                            <label>{t('lastModification')}:</label>
                            <Moment format="DD/MM/YYYY HH:mm">{item.updatedAt}</Moment>
                        </div>

                        <div className="item-data-group">
                            <label>{t('creationDate')}:</label>
                            <Moment format="DD/MM/YYYY HH:mm">{item.createdAt}</Moment>
                        </div>
                    </div>
                </div>

                <div className="item-button-container">
                    <button className='custom-button' onClick={goToEdit} disabled={isLoading || storageRoomPermission === 'read'}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            edit
                        </span>
                        {t('editButton')}
                    </button>
                    <button className='custom-button delete' onClick={handleDelete} disabled={isLoading || storageRoomPermission === 'read'}>
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                            delete
                        </span>
                        {t('deleteButton')}
                    </button>
                    {/* <button className='retrun-button' onClick={handleReturnLent}>{"return"}</button> */}
                </div>

                <div className="loader-clip-container-small">
                    <ClipLoader className="custom-spinner-clip" loading={isLoading} />
                </div>
            </div>
        </div>
    );
};
export default Item;