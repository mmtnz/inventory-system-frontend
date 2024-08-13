// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import SearchForm from '../components/SearchForm';
import { Link } from 'react-router-dom';
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

  return (
    <div>
      <main>
        <h1>Home Page</h1>
        <div className='option-button-container'>
          <div type="button">
            <Link to="/search">Buscar</Link>
          </div>
          <div type="button">
            <Link to="/new-item">Nuevo elemento</Link>
          </div>
        </div>
        
      </main>
      {/* <SearchForm />
      <Footer /> */}
    </div>
  );
};

export default HomePage;
