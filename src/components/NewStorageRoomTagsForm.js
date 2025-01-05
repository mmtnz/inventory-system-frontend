import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TagsInput from './TagsInput';
import InfoModal from './InfoModal';



const NewStorageRoomTagsForm = ({tagsList, setTagsList}) => {

    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace
 
    // const addTag = (event) => {
    //     if (event.length > tagsList.length && event[event.length - 1].trim() !== ""){ // avoiding empty string or only blank spaces one
    //         setTagsList(event)
    //     }

    // }
    return(
        <div>
            <form 
                className="custom-form"
                onSubmit={(e) => {e.preventDefault()}}
                // onChange={changeState}
            >
                <div className="formGroup">
                    <div className='label-container'>
                        <label htmlFor='tags'>
                            {t('tags')}
                            
                        </label>
                        <div
                            className='label-icon-container'
                            onClick={() => {setIsInfoOpen(true)}}
                        >
                            <span className="material-symbols-outlined" translate="no" aria-hidden="true">
                                help
                            </span>
                        </div>
                    </div>
                    <TagsInput tagsList={tagsList} setTagsList={setTagsList}/>
                </div>
            </form>

            <InfoModal
                modalIsOpen={isInfoOpen}
                setModalIsOpen={setIsInfoOpen}
                text={t('tagsInfo')}
            />
    </div>
    )
    
};
export default NewStorageRoomTagsForm;