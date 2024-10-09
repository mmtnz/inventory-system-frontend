import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL, { apiDeleteItem, apiGetItem, apiReturnLent } from "../services/api";
import { useEffect, useState } from "react";
import defaultImage from "../assets/images/default.png"
import Swal from 'sweetalert2';
import messagesObj from "../schemas/messages";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Modal from 'react-modal';
import CustomModal from "./CustomModal";
Modal.setAppElement('#root');  // Required for accessibility



const Item = ({args}) => {
    
    const tagsList = args.tagsList;
    const locationObj = args.locationObj;

    const {storageRoomId, itemId} = useParams();
    let url = API_BASE_URL;
    
    const [item, setItem] = useState({});
    const [status, setStatus] = useState({});
    const [error, setError] = useState(null);

    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [sublocation, setSublocation] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [, forceUpdate] = useState();

    const navigate = useNavigate();
    const { t, i18n } = useTranslation('item'); // Load translations from the 'item' namespace


    // Update Moment's locale based on the current language from i18next
    useEffect(() => {
        if (i18n.language === 'es') {
            moment.locale('es'); // Set Moment to use Spanish locale
        } else {
            moment.locale('en'); // Use default locale (English) if language is not Spanish
        }
        console.log(locationObj)
        loadItem();
        
    }, [i18n.language]);  // Re-run whenever the language changes

    

    const loadItem = async () => {
        try {
            const data = await apiGetItem(storageRoomId, itemId);
            setItem(data);
            setError(null);

            let [auxPlace, auxLoc, auxSubLoc] = data.location.split('/');
            setPlace(locationObj.placesList.find(option => auxPlace.includes(option.value)));
            setLocation(locationObj.placeObj[auxPlace].zonesList.find(option => auxLoc.includes(option.value)));
            setSublocation(locationObj.placeObj[auxPlace].selfsObj[auxLoc].find(option => auxSubLoc.includes(option.value)));
        
            // setLocation(data.location.split('/')[0]);
            // setSublocation(data.location.split('/')[1]);
            setIsLoaded(true);
        } catch (err) {
            setItem({})
            console.log(err)
            setError(t('error'))
        }
    }

    const deleteItem = async () => {
        let resultApi = await apiDeleteItem(storageRoomId, itemId);
        console.log(resultApi);
        if (resultApi.status == 200) {
            Swal.fire(messagesObj[t('locale')].deleteItemSuccess);
            navigate('/home');
        }
        else {
            Swal.fire(messagesObj[t('locale')].deleteItemError);
        }
    }

    const handleDelete = async () => {
        Swal.fire(messagesObj[t('locale')].deleteItemConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    deleteItem();      
                }
            }
        )
    }

    const handleReturnLent = async () => {
        try {

            let utcDate = new Date().toISOString().split('T')[0];
            let resultApi = await apiReturnLent(storageRoomId, item, utcDate);
            Swal.fire({
                title: 'Elemento actualizado',
                text: "El elemento se ha creado correctamente",
                icon: "success"
            })
            setItem({...item, isLent: null})
        } catch (error) {
            console.log('poner swal')
        }
        forceUpdate();
    }

    const goToEdit = () => {
        navigate(`/storageRoom/${storageRoomId}/item/${itemId}/edit`)
    }

    if (error) {
        return(
            <div>{error}</div>
        )
    }

    if (!isLoaded) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            <h1>{item.name}</h1>
            <div id="item">
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
                            {(item.isLent != null) ? (
                                <div className="lent-data-container">
                                    <Moment fromNow utc locale="es">{item.isLent.split('/')[1]}</Moment>
                                    <p>{t('to')} {item.isLent.split('/')[0]}</p>
                                    <button
                                        className='custom-button-small'
                                        onClick={handleReturnLent}
                                    >
                                        <span className="material-symbols-outlined">
                                            assignment_return                                            
                                        </span>
                                        {t('isReturned')}
                                    </button>
                                </div>
                            ) : (
                                '-'
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