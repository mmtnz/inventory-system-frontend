import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NewStorageRoomPage from "./pages/NewStorageRoomPage";
import StorageRoomPage from "./pages/StorageRoomPage";
import StorageRoomSettingsPage from "./pages/StorageRoomSettingsPage";
import StorageRoomAddUsersPage from "./pages/StorageRoomAddUsersPage";
import SignUpPage from "./pages/SignUpPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";


const Router = () => {


    return(
        <AuthProvider>
            <BrowserRouter>
                <div className="page-container">
                    <Header/>
                    <div className='body-content'>
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/sign-up" element={<SignUpPage/>}/>
                            <Route path="/confirm-email" element={<ConfirmEmailPage/>}/>
                            <Route exact path="/change-password" element={<ChangePasswordPage/>} />
                            <Route exact path="/" element={<PrivateRoute element={HomePage} />} />
                            <Route path ="/home" element={<PrivateRoute element={HomePage} />} />
                            <Route exact path ="/storageRoom/:storageRoomId" element={<PrivateRoute element={StorageRoomPage} />} />
                            <Route exact path ="/storageRoom/:storageRoomId/settings" element={<PrivateRoute element={StorageRoomSettingsPage} />} />
                            <Route exact path ="/storageRoom/:storageRoomId/add-users" element={<PrivateRoute element={StorageRoomAddUsersPage} />} />
                            <Route exact path ="/storageRoom/:storageRoomId/item/:itemId" element={<PrivateRoute element={ItemPage} />} />
                            <Route path= "/storageRoom/:storageRoomId/search" element={<PrivateRoute element={SearchPage} />} />
                            <Route path= "/storageRoom/:storageRoomId/new-item" element={<PrivateRoute element={NewItemPage} />} />
                            <Route path= "/storageRoom/:storageRoomId/item/:itemId/edit" element={<PrivateRoute element={EditItemPage} />} />
                            <Route path="/storageRoom/new" element={<PrivateRoute element={NewStorageRoomPage} />} />
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