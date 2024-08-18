import React, { Component } from "react";
import { BrowserRouter, Route, Routes, useParams, Navigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ItemPage from "./pages/ItemPage";
import HomePage from "./pages/HomePage";
import NewItemPage from "./pages/NewItemPage";
import EditItemPage from "./pages/EditItemPage";
import Header from './components/Header';


const Router = () => {


    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/home" element={<HomePage />} />
                <Route exact path ="/item/:id" element={<ItemPage/>}/>
                <Route path= "/search" element={<SearchPage/>}/>
                <Route path= "/new-item" element={<NewItemPage/>}/>
                <Route path= "/edit" element={<EditItemPage/>}/>
                <Route path="*" element={
                    <React.Fragment>
                        <h1>Error</h1>
                    </React.Fragment>
                    
                } />
            </Routes>
        </BrowserRouter>
    )
};
export default Router;