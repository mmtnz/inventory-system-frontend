// src/components/Item.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/images/default.png';

const ItemWrap = ({item}) => {
  
  return (
    <div className="list-item">
        <section>
            <div className="image-wrap">
                <img src={defaultImage}/>
            </div>
            <h2>{item.name}</h2>
            <span className="date">                                            
                {/* <Moment fromNow>{article.date}</Moment> */}
            </span>
            <Link to={`/item/${item.id}`}>Leer más</Link>
            <div className="clearfix"></div>

        </section>
    </div>
  );
};

export default ItemWrap;