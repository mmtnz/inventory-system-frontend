import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TagsInput from './TagsInput';



const NewStorageRoomTagsForm = ({tagsList, setTagsList}) => {

    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace
 
    const addTag = (event) => {
        console.log(event)
        console.log(tagsList)
        console.log(event[event.length - 1].trim())
        console.log(event.length > tagsList && event[event.length - 1].trim() !== "")
        if (event.length > tagsList.length && event[event.length - 1].trim() !== ""){ // avoiding empty string or only blank spaces one
            setTagsList(event)
        }  
    }
    return(
        <div>
            <form 
                className="custom-form"
                onSubmit={(e) => {e.preventDefault()}}
                // onChange={changeState}
            >
                <div className="formGroup">
                    <label htmlFor='tags'>{t('tags')}</label>
                    <TagsInput tagsList={tagsList} setTagsList={addTag}/>
                </div>
            </form>
    </div>
    )
    
};
export default NewStorageRoomTagsForm;