import React, { useEffect, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import TagsInput from '../TagsInput';
import { useTranslation } from 'react-i18next';
import createOptionList from '../../utils/createOptionList';
import InfoModal from '../InfoModal';
import CustomEditableTree from '../tree/CustomEditableTree';

const NewStorageRoomLocationsForm = ({locationTree, setLocationTree}) => {

    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const { t, i18n } = useTranslation('newStorageRoom'); // Load translations from the 'newItem' namespace
    const [validator, setValidator] = useState(new SimpleReactValidator(
        { messages: {
            default: t('defaultMessage'),
            required: t('requiredMessage'),
        }
    }));

    // Change validator messages language
    useEffect(() => {
        setValidator(
            new SimpleReactValidator({
                messages: {
                    required: t('requiredMessage'),
                    email: t('emailInvalid'),
                },
            })
        );
    }, [i18n.language])


    return(
        <div>
            <form 
                className="custom-form"
            >
                <InfoModal
                    modalIsOpen={isInfoOpen}
                    setModalIsOpen={setIsInfoOpen}
                    text={t('placesInfo')}
                />
           
                <div className='storage-room-data-group'> 
                    <div className='label-container'>
                        <label htmlFor='location'>
                        {t('locations')}:
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
                    
                </div>

                <CustomEditableTree treeData={locationTree} setTreeData={setLocationTree}/>                           
            </form>          
        </div>
    );

};
export default NewStorageRoomLocationsForm;