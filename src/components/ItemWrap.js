// src/components/Item.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/images/default.png';
import API_BASE_URL, { apiGetItem } from "../services/api";

const ItemWrap = ({item}) => {

  const url = API_BASE_URL;
  
  return (
    <div className="list-item">
        <section>
            <div className="image-wrap">
                {item.image !== null ? (
                  <img
                    src={`${url}/image/${item.image}`}
                    alt={item.name}
                    // className="image-item"
                />
                ) : (
                  <img src={defaultImage}/>
                )}
                
            </div>
            
            <h2>{item.name}</h2>
            <span className="date">                                            
                {/* <Moment fromNow>{article.date}</Moment> */}
            </span>
            <Link to={`/item/${item.id}`}>Ver más</Link>
            <Link to={`/edit/${item.id}`}>Editar</Link>
            <div className="clearfix"></div>

        </section>
    </div>
  );
};

export default ItemWrap;