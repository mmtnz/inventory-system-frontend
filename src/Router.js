import React, { Component } from "react";
import { BrowserRouter, Route, Routes, useParams, Navigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ItemPage from "./pages/ItemPage";
import HomePage from "./pages/HomePage";
import NewItemPage from "./pages/NewItemPage";
import EditItemPage from "./pages/EditItemPage";
import Header from './components/Header';
import Footer from "./components/Footer";


const Router = () => {


    return(
        <BrowserRouter>
            <div className="page-container">
                <Header/>
                {/* <div className='Header'></div> */}
                <div className='body-content'>
                    <Routes>
                        <Route exact path="/" element={<HomePage />} />
                        <Route exact path="/home" element={<HomePage />} />
                        <Route exact path ="/item/:id" element={<ItemPage/>}/>
                        <Route path= "/search" element={<SearchPage/>}/>
                        <Route path= "/new-item" element={<NewItemPage/>}/>
                        <Route path= "/edit/:id" element={<EditItemPage/>}/>
                        <Route path="*" element={
                            <React.Fragment>
                                <h1>Error</h1>
                            </React.Fragment>
                        } />
                    </Routes>
                </div>
                {/* <div className='footer'></div> */}
                <Footer/>
            </div>
        </BrowserRouter>
    )
};
export default Router;