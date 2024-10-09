// src/components/Item.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImage from '../assets/images/default.png';
import API_BASE_URL, { apiGetItem, apiReturnLent, apiDeleteItem } from "../services/api";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import moment from 'moment';
import Swal from 'sweetalert2';
import messagesObj from "../schemas/messages";

import { useTranslation } from 'react-i18next';

const ItemWrap = ({item}) => {

  console.log(item.imageUrl)
  const [lentName, lentDate] = item.isLent != null ? item.isLent.split('/') : [null, null]
  const url = API_BASE_URL;
  const { storageRoomId } = useParams();
  const [,forceUpdate] = useState();
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
    navigate(`/storageRoom/${storageRoomId}/item/${item.itemId}`);
  }

  const handleReturnLent = async () => {
    let utcDate = new Date().toISOString().split('T')[0];
    let resultApi = await apiReturnLent(storageRoomId, item, utcDate);
    forceUpdate();
  }

  const deleteItem = async () => {
    let resultApi = await apiDeleteItem(storageRoomId, item.itemId);
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
      Swal.fire(messagesObj[t('locale')].deleteItemConfirmation)
          .then((result) => {
              if (result.isConfirmed) {
                  deleteItem();   
              }
          }
      )
  }

  
  return (
    <div className="list-item">
        
        <div className="image-wrap" onClick={goToItem}>
            {item.imageUrl && item.imageUrl !== "" ? (
              <img
                src={item.imageUrl}
                alt={item.name}
            />
            ) : (
              <img src={defaultImage}/>
            )}
            
        </div>

        {/* {item.imageUrl} */}

        <div className='item-wrap-content-container' onClick={goToItem}>
          <h2>{item.name}</h2>

          <span className="date">
              <p>{t('edited')}:</p>
              <Moment fromNow utc locale={i18n.language}>{item.dateLastEdited}</Moment>
          </span>

          {(item.isLent != null) &&
            <span className="date">
              <p>{t('lent')}:</p>
              <Moment fromNow utc locale={i18n.language}>{lentDate}</Moment>
              <div>{t('to')} {lentName}</div>
            </span>
          }
        </div>

        <div className='item-wrap-buttons-container'>
          <button className='custom-button-small' onClick={handleDelete}>
            <span className="material-symbols-outlined">
              delete
            </span>
            {t('delete')}
          </button>
          {item.isLent && 
            <button className='custom-button-small' onClick={handleReturnLent}>
                <span className="material-symbols-outlined">
                  assignment_return                                            
                </span>            
              {t('return')}
            </button>
          }
        </div>
        
      

       
    </div>
  );
};

export default ItemWrap;