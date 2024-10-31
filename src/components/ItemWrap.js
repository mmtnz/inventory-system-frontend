// src/components/Item.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImage from '../assets/images/default.png';
import { apiReturnLent, apiDeleteItem } from "../services/api";
import { logout } from "../services/logout";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import moment from 'moment';
import Swal from 'sweetalert2';
import messagesObj from "../schemas/messages";
import { ClipLoader } from 'react-spinners';

import { useTranslation } from 'react-i18next';

const ItemWrap = ({itemArg, removeItemFromList}) => {

  const [item, setItem] = useState(itemArg);
  const [lentName, lentDate] = item.isLent != null ? item.isLent.split('/') : [null, null]
  const [isLent, setIsLent] = useState(item.isLent);
  const [isUpdating, setIsUpdating] = useState(false);

  const { storageRoomId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('itemWrap'); // Load translations from the 'itemWrap' namespace

   // Update Moment's locale based on the current language from i18next
  useEffect(() => {
    if (i18n.language === 'es') {
      moment.locale('es'); // Set Moment to use Spanish locale
    } else {
      moment.locale('en'); // Use default locale (English) if language is not Spanish
    }
  }, [i18n.language]);  // Re-run whenever the language changes
  
  const goToItem = () => {
    navigate(`/storageRoom/${storageRoomId}/item/${item.itemId}`, { state: { item: item } });
  }

  const handleReturnLent = async () => {
    setIsUpdating(true);
    let utcDate = new Date().toISOString().split('T')[0];
    try {
      const updatedItem = await apiReturnLent(storageRoomId, {...item}, utcDate);
      setItem({...updatedItem, imageUrl: item.imageUrl})
      setIsLent(null);
      Swal.fire(messagesObj[t('locale')].editItemSuccess)
      setIsUpdating(false);
    } catch (err) {
      await handleError(err);
    }
    
    // forceUpdate();
  }

  const handleDelete = async () => {
      Swal.fire(messagesObj[t('locale')].deleteItemConfirmation)
          .then((result) => {
              if (result.isConfirmed) {
                setIsUpdating(true);
                  deleteItem();   
              }
          }
      )
  }

  const deleteItem = async () => {
    try {
      await apiDeleteItem(storageRoomId, item.itemId);
      setIsUpdating(false);
      Swal.fire(messagesObj[t('locale')].deleteItemSuccess);
      removeItemFromList(item.itemId)

    } catch (err) {
      await handleError(err);
    }
  }

  // To handle error depending on http error code
  const handleError = async (err) => {
    console.log(err)
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

 

  
  return (
    <div className="list-item">
        
        <div className="image-wrap-container" onClick={goToItem}>
            {item.imageUrl && item.imageUrl.thumbnail !== "" ? (
              <img
                src={item.imageUrl.thumbnail}
                alt={item.name}
            />
            ) : (
              <img src={defaultImage} alt={'default'}/>
            )}
        </div>



        <div className='list-item-wrapper'>
          <div className='item-wrap-content-container' onClick={goToItem}>
            <h2>{item.name}</h2>

            <div className="list-item-date">
                <div className='text-bold'>{t('edited')}:</div>
                <div className='list-item-date-text'>
                  <Moment fromNow utc locale={i18n.language}>{item.updatedAt}</Moment>
                </div>
            </div>

            {isLent &&
              <div className="list-item-date">
                <div className='text-bold'>{t('lent')}:</div>
                
                <div className='list-item-date-text'>
                  <Moment fromNow utc locale={i18n.language}>{lentDate}</Moment>
                  {t('to')} {lentName}
                </div>

              </div>
            }
          </div>

          <div className='item-wrap-buttons-container'>
            {item.isLent && 
              <button className='custom-button-small' onClick={handleReturnLent} disabled={isUpdating}>
                  <span className="material-symbols-outlined">
                    assignment_return                                            
                  </span>            
                {t('return')}
              </button>
            }

            <button className='custom-button-small' onClick={handleDelete} disabled={isUpdating}>
              <span className="material-symbols-outlined">
                delete
              </span>
              {t('delete')}
            </button>

            {isUpdating && (
              <div className="loader-clip-container-small">
                <ClipLoader className="custom-spinner-clip" loading={isUpdating}/>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default ItemWrap;