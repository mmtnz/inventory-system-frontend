import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiDeleteItem, apiGetItem, apiReturnLent } from "../services/api";
import { logout } from "../services/logout";
import { useEffect, useState } from "react";
import defaultImage from "../assets/images/default.png"
import Swal from 'sweetalert2';
import messagesObj from "../schemas/messages";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import { BarLoader } from 'react-spinners';

import Modal from 'react-modal';
import CustomModal from "./CustomModal";
Modal.setAppElement('#root');  // Required for accessibility



const Item = ({args}) => {
    
    const tagsList = args.tagsList;
    const locationObj = args.locationObj;

    const {storageRoomId, itemId} = useParams();    
    const [item, setItem] = useState({});

    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSublocation] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [, forceUpdate] = useState();

    const navigate = useNavigate();
    const locationState = useLocation();
    const { t, i18n } = useTranslation('item'); // Load translations from the 'item' namespace


    // Update Moment's locale based on the current language from i18next
    useEffect(() => {
        if (i18n.language === 'es') {
            moment.locale('es'); // Set Moment to use Spanish locale
        } else {
            moment.locale('en'); // Use default locale (English) if language is not Spanish
        }
        loadItem();
        
    }, [i18n.language]);  // Re-run whenever the language changes

    

    const loadItem = async () => {
        try {
            let data;
            if (locationState.state?.item) {
                data = locationState.state?.item // Get item from state when clicking in item wrap
            } else {
                data = await apiGetItem(storageRoomId, itemId);
            }
            
            setItem(data);

            let [auxPlace, auxLoc, auxSubLoc] = data.location.split('/');
            setPlace(locationObj.placesList.find(option => auxPlace.includes(option.value)));
            setLocation(locationObj.placeObj[auxPlace].zonesList.find(option => auxLoc.includes(option.value)));
            setSublocation(locationObj.placeObj[auxPlace].selfsObj[auxLoc].find(option => auxSubLoc.includes(option.value)));

            setIsLoaded(true);
        } catch (err) {
            console.log(err)
            await handleError(err);
        }
    }

    // Confirm qith user if they want to delete he item
    const handleDelete = async () => {
        Swal.fire(messagesObj[t('locale')].deleteItemConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    deleteItem();      
                }
            }
        )
    }
    
    // API call to delete item
    const deleteItem = async () => {
        try {
            await apiDeleteItem(storageRoomId, itemId);
            Swal.fire(messagesObj[t('locale')].deleteItemSuccess);
            navigate('/home');
        } catch (err) {
            await handleError(err);
        }
    }

    // To handle error depending on http error code
    const handleError = async (err) => {
        if (err.response.status === 401) {
            Swal.fire(messagesObj[t('locale')].sessionError)
            await logout();
            navigate('/login')
        } else if ( err.response.status === 403) {  // Access denied
            Swal.fire(messagesObj[t('locale')].accessDeniedError)
            navigate('/home')
        } else if (err.response.status === 404 ) { // Item not found
            Swal.fire(messagesObj[t('locale')].itemNotFoundError)
            navigate('/home')
        }
    }


    const handleReturnLent = async () => {
        try {
            let utcDate = new Date().toISOString().split('T')[0];
            let itemSaved = await apiReturnLent(storageRoomId, item, utcDate);
            console.log(itemSaved)
            Swal.fire(messagesObj[t('locale')].editItemSuccess)
            setItem({...item, isLent: null, lentHistory: itemSaved.lentHistory})
        } catch (err) {
            console.log('poner swal')
            handleError(err)
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
                        {item.imageUrl && item.imageUrl !== "" ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="image-item"
                            />
                        ):(
                            <img src={defaultImage} className="image-item"/>
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
                            <p>{`${place.label} / ${location.label} / ${sublocation.label}`}</p>  
                        </div>
                        
                        <div className="item-data-group">
                            <label>{t('description')}:</label>
                            {(item.description != '') ? (
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
                                {(item.isLent != null) && (
                                    <button
                                        className='custom-button-small'
                                        onClick={handleReturnLent}
                                    >
                                        <span className="material-symbols-outlined">
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
                                    <span className="material-symbols-outlined">
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
                    <button className='custom-button' onClick={goToEdit}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                        {t('editButton')}
                    </button>
                    <button className='custom-button' onClick={handleDelete}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                        {t('deleteButton')}
                    </button>
                    {/* <button className='retrun-button' onClick={handleReturnLent}>{"return"}</button> */}
                </div>
            </div>
        </div>
    );
};
export default Item;