import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createOptionList from '../utils/createOptionList';
import createLocationTree from '../utils/createLocationTree';
import CustomTree from './CustomTree';


const NewStorageRoomConfirmation = ({name, tagsList, locationTree}) => {

    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace
    const transformedTagsList = createOptionList(tagsList);

    return(
        <div className='storage-room-confirmation'>

            <div className="storage-room-data">
                <div className="storage-room-data-group">
                    <label>{t('name')}:</label>
                    <p>{name}</p>
                </div>

                <div className="storage-room-data-group">
                    <label>{t('tags')}:</label>
                    {(tagsList.length > 0) ? 
                        (<div className="tags-container">
                            {transformedTagsList.map((tag, index) => (
                                <div className="tag-item" key={index}>
                                    <span className='tag'>{tag.label}</span>
                                </div>
                            ))}
                        </div>) : (
                            '-'
                        )
                    }
                </div>

                <div className='storage-room-data-group'> 
                    <label>{t('locations')}:</label>
                    <CustomTree data={locationTree}/>
                </div>
            </div>
        </div>
    )
    
};
export default NewStorageRoomConfirmation;