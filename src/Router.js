import React, { Component, useState } from "react";
import { BrowserRouter, Route, Routes, useParams, Navigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ItemPage from "./pages/ItemPage";
import HomePage from "./pages/HomePage";
import NewItemPage from "./pages/NewItemPage";
import EditItemPage from "./pages/EditItemPage";
import Header from './components/Header';
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { AuthProvider } from './services/AuthContext'; // Import the AuthProvider


const Router = () => {


    return(
        <AuthProvider>
            <BrowserRouter>
                <div className="page-container">
                    <Header/>
                    <div className='body-content'>
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route exact path="/change-password" element={<PrivateRoute element={ChangePasswordPage} />} />
                            <Route exact path="/" element={<PrivateRoute element={HomePage} />} />
                            <Route exact path="/home" element={<PrivateRoute element={HomePage} />} />
                            <Route exact path ="/storageRoom/:storageRoomId/item/:itemId" element={<PrivateRoute element={ItemPage} />} />
                            <Route path= "/search" element={<PrivateRoute element={SearchPage} />} />
                            <Route path= "/new-item" element={<PrivateRoute element={NewItemPage} />} />
                            <Route path= "/edit/:id" element={<PrivateRoute element={EditItemPage} />} />
                            <Route path="*" element={
                                <React.Fragment>
                                    <h1>Error</h1>
                                </React.Fragment>
                            } />
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </BrowserRouter>
        </AuthProvider>
    )
};
export default Router;