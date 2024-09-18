// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import config from '../config';


const Footer = () => {
  
  const { SW_VERSION } = config;
  console.log(SW_VERSION)

  return (
    <div className='footer'>
      <div className='version-content'>{SW_VERSION}</div>      
    </div>
  );
};

export default Footer;
