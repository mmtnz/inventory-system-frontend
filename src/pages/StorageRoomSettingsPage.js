// src/pages/HomePage.js
import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../services/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import handleError from '../services/handleError';
import { ClipLoader } from 'react-spinners';
import { apiGetStorageRoomsList, apiSearchItems } from '../services/api';
import Swal from "sweetalert2";
import {messagesObj, getDeleteStorageRoomConfirmationMsg} from "../schemas/messages";

const StorageRoomSettingsPage = () => {
  
    const [isLoading, setIsLoading] = useState(false);
    const { storageRoomId } = useParams(); // Retrieves the storageRoomId from the URL
    const { t, i18n } = useTranslation('storageRoom'); // Load translations from the 'home' namespace

    const handleDelete = () => {
        Swal.fire(messagesObj[t('locale')].deleteStorageRoomConfirmation
            ).then((result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);
                    deleteStorageRoom();      
                }
            }
        )
    }
    
    const deleteStorageRoom = async () => {
        const [_, totalCount] = await apiSearchItems(storageRoomId, "q=&tag=&lent=null");
        console.log(`total: ${totalCount}`);
        Swal.fire(getDeleteStorageRoomConfirmationMsg(t('locale'), totalCount)
            ).then((result) => {
                if (result.isConfirmed) {
                    console.log('delete')
                }
            }
        )
    }


    return (
        <div className='center'>
            <section className='content'>
                <h1>Storage room</h1>  
                
                <div className='option-button-container'>
                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} >
                    {/* <button className="custom-button" onClick={goToSearch}> */}
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                        {t('edit')}
                    </button>
            
                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""}`} >
                        <span className="material-symbols-outlined">
                            person_add
                        </span>
                        {t('addUser')}
                    </button>

                    <button className={`custom-button ${i18n.language === 'es' ? "es" : ""} delete`} onClick={handleDelete}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                        {t('delete')}
                    </button>
                </div>
            </section>      
        </div>
    );
};

export default StorageRoomSettingsPage;
