// src/components/Item.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultImage from '../assets/images/default.png';
import API_BASE_URL, { apiGetItem } from "../services/api";
import Moment from 'react-moment';
import 'moment/locale/es'; // Import Spanish locale

const ItemWrap = ({item}) => {

  const url = API_BASE_URL;
  const navigate = useNavigate();

  const goToItem = () => {
    navigate(`/item/${item.id}`);
  }
  
  return (
    <div className="list-item" onClick={goToItem}>
        <section>
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
                  <Moment fromNow utc locale="es">{item.date}</Moment>
              </span>

              {/* <Link to={`/item/${item.id}`}>Ver más</Link> */}
              {/* <Link to={`/edit/${item.id}`}>Editar</Link> */}
            </div>
            
            
            <div className="clearfix"></div>

        </section>
    </div>
  );
};

export default ItemWrap;