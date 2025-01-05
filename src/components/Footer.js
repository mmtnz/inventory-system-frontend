// src/pages/HomePage.js
import React from 'react';
import config from '../config';


const Footer = () => {
  
  const { SW_VERSION } = config;

  return (
    <div className='footer'>
      <div className='version-content'>{SW_VERSION}</div>      
    </div>
  );
};

export default Footer;
