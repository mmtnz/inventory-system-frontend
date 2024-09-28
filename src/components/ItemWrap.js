// src/components/Item.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultImage from '../assets/images/default.png';
import API_BASE_URL, { apiGetItem } from "../services/api";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale
import moment from 'moment';

import { useTranslation } from 'react-i18next';

const ItemWrap = ({item}) => {

  const [lentName, lentDate] = item.isLent != null ? item.isLent.split('/') : [null, null]
  const url = API_BASE_URL;
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
    navigate(`/item/${item.id}`);
  }
  
  return (
    <div className="list-item" onClick={goToItem}>
        
        <div className="image-wrap">
            {item.image !== null && item.image !== "" ? (
              <img
                src={`${url}/image/${item.image}`}
                alt={item.name}
            />
            ) : (
              <img src={defaultImage}/>
            )}
            
        </div>

        <div className='item-wrap-container'>
          <h2>{item.name}</h2>

          <span className="date">
              <p>{t('edited')}:</p>
              <Moment fromNow utc locale={i18n.language}>{item.date.lastEdited}</Moment>
          </span>

          {(item.isLent != null) &&
            <span className="date">
              <p>{t('lent')}:</p>
              <Moment fromNow utc locale={i18n.language}>{lentDate}</Moment>
              <div>a {lentName}</div>
            </span>
          }
          

        </div>
        
      

       
    </div>
  );
};

export default ItemWrap;