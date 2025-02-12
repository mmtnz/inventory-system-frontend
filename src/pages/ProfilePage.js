import React, {useEffect, useState} from 'react';
import userPool from '../services/cognitoConfig'; // Your Cognito configuration
import { useTranslation } from 'react-i18next';
import PersonalDetails from "../components/profile/PersonalDetails";
import { ClipLoader } from 'react-spinners';
import ChangePassword from "../components/profile/ChangePassword";
import { useMediaQuery } from "react-responsive";



const ProfilePage = () => {

    const cognitoUser = userPool.getCurrentUser();
    const [attributesData, setAttributesData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [menuSelection, setMenuSelection] = useState('personalDetails');
    const isMobile = useMediaQuery({ maxWidth: 900 });




    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isDetailsDisabled, setIsDetailsDisabled] = useState(true);
    // const [isDetailsDisabled, setIsDetailsDisabled] = useState(true);
    const { t } = useTranslation('profile'); 

    

    const changePassword = () => {
        cognitoUser.getSession((err, session) => {
            if (err) {
              console.error(err);
              return;
            }
      
            cognitoUser.changePassword(oldPassword, newPassword, (error, result) => {
              if (error) {
                console.error(error);
              } else {
                console.log(result);
              }
            });
          });
        };
    
    // if (isLoading) {
    //     return(
    //         <div className='center'>
    //         <section className='content'>
            
    //             <div className='storage-room-list'>
    //                 <h2>{t('storageRoomsList')}</h2>
    //                 <div className="loader-clip-container">
    //                     <ClipLoader className="custom-spinner-clip" loading={isLoading} />
    //                 </div>
    //             </div>        
    //         </section>
    //     </div>   
    //     )
    // }

    return (
        <div className='center'>

            <div className={`side-bar-menu ${isCollapsed ? `collapsed` : ''} ${isMobile ? `mobile` : ''}`}>
                <div className="side-bar-menu-item" onClick={() => {setIsCollapsed(!isCollapsed)}}>
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                        menu
                    </span>
                    
                </div>
                {!(isMobile && isCollapsed) && (
                    <div
                        className={`side-bar-menu-item ${menuSelection === "personalDetails" ? "selected"  :""}`}
                        onClick={() => {setMenuSelection('personalDetails')}}
                    >   
                        
                            
                            <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                person
                            </span>
                            <div >{t('personalDetails')}</div>
                            
                        
                    </div>
                )}
                {!(isMobile && isCollapsed) && (
                <div
                    className={`side-bar-menu-item ${menuSelection === "changePassword" ? "selected"  :""}`}
                    onClick={() => {setMenuSelection('changePassword')}}
                >
                        <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                        lock
                        </span>
                        <div>{t('changePassword')}</div>       
                </div>
                )} 
            </div>



            <section className='content'>
                <h1>{t('profile')}</h1>
                <div>
                    <>
                    {(menuSelection === 'personalDetails') && (
                        <PersonalDetails cognitoUser={cognitoUser}/>
                    )}
                    {(menuSelection === 'changePassword') && (
                        <ChangePassword cognitoUser={cognitoUser}/>
                    )}
                    
                    </>
                </div>
            </section>
        </div>
    )
};
export default ProfilePage;