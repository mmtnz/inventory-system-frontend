// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// import { getProducts } from '../services/api';

const HomePage = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const products = await getProducts();
//       setProducts(products);
//     }
//     fetchData();
//   }, []);
  const navigate = useNavigate();
  const { t } = useTranslation('homePage'); // Load translations from the 'home' namespace

  const goToSearch = () => {
    navigate('/search');
  }

  const goToNewItem = () => {
    navigate('/new-item');
  }

  return (
    <div className='center'>
      <section className='content'>
        <h1>{t('title')}</h1>
        <div className='option-button-container'>
          
          <button className="custom-button" onClick={goToSearch}>
            <span className="material-symbols-outlined">
                search
            </span>
            {t('searchButton')}
          </button>
          
          <button className="custom-button" onClick={goToNewItem}>
            <span className="material-symbols-outlined">
              add
            </span>
            {t('newItemButton')}
          </button>
        </div>
        
      </section>
    </div>
  );
};

export default HomePage;
