import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL, { apiDeleteItem, apiGetItem, apiReturnLent } from "../services/api";
import { useEffect, useState } from "react";
import defaultImage from "../assets/images/default.png"
import Swal from 'sweetalert2';
import messagesObj from "../schemas/messages";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import { useTranslation } from 'react-i18next';

import Modal from 'react-modal';
import CustomModal from "./CustomModal";
Modal.setAppElement('#root');  // Required for accessibility



const Item = ({args}) => {
    

    const tagList = args.tagList;
    const locationObj = args.locationObj;

    let id = useParams().id;
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
    const { t } = useTranslation('item'); // Load translations from the 'item' namespace

    useEffect(() => {
        loadItem();
    }, [])

    const loadItem = async () => {
        try {
            const data = await apiGetItem(id);
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
        let resultApi = await apiDeleteItem(id);
        console.log(resultApi);
        if (resultApi.status == 200) {
            Swal.fire(messagesObj.deleteItemSuccess);
            navigate('/home');
        }
        else {
            Swal.fire(messagesObj.deleteItemError);
        }
    }

    const handleDelete = async () => {
        Swal.fire(messagesObj.deleteItemConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    deleteItem();      
                }
            }
        )
    }

    const handleReturnLent = async () => {
        let utcDate = new Date().toISOString().split('T')[0];
        let resultApi = await apiReturnLent(item, id, utcDate);
        forceUpdate();
    }

    const goToEdit = () => {
        navigate(`/edit/${id}`)
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
                        {item.image !== null && item.image !== ""? (
                            <img
                                src={`${url}/image/${item.image}`}
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
                                            <span className='tag'>{tagList.find(tagValue => tag.includes(tagValue.value)).label}</span>
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
                                <>
                                    <p>{item.isLent.split('/')[0]}</p>
                                    <Moment fromNow utc locale="es">{item.isLent.split('/')[1]}</Moment>
                                </>
                            ) : (
                                '-'
                            )}
    
                            <button
                                className="history-container"
                                onClick={() => setModalIsOpen(true)}
                                disabled={!item.lentHistory}
                            >
                                <span className="material-symbols-outlined">
                                    history
                                </span>
                            </button>
                            
                        </div>

                        <CustomModal
                            modalIsOpen={modalIsOpen}
                            setModalIsOpen={setModalIsOpen}
                            title={t('modalTitle')}
                            content={item.lentHistory}
                        />

                        <div className="item-data-group">
                            <label>{t('lastModification')}:</label>
                            <Moment format="DD/MM/YYYY HH:mm">{item.date.lastEdited}</Moment>
                        </div>

                        <div className="item-data-group">
                            <label>{t('creationDate')}:</label>
                            <Moment format="DD/MM/YYYY HH:mm">{item.date.created}</Moment>
                        </div>
                    </div>
                </div>

                <div className="item-button-container">
                    <button className='edit-button' onClick={goToEdit}>{t('editButton')}</button>
                    <button className='delete-button' onClick={handleDelete}>{t('deleteButton')}</button>
                    <button className='retrun-button' onClick={handleReturnLent}>{"return"}</button>
                </div>
            </div>
        </div>
    );
};
export default Item;