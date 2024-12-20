import React from 'react';
import { useTranslation } from 'react-i18next';


const Pagination = ({numSteps, currentStep, setCurrentStep, isNextButtonDisabled, isSaveButtonDisabled, handleSave}) => {
  
    const stepsList = Array.from({ length: numSteps }, (_, i) => i + 1);;
    const { t } = useTranslation('newStorageRoom'); // Load translations from the 'itemForm' namespace

    return (
        <div className='step-buttons-container'>
            <div className='button-container'>
                <button className='custom-button-small' disabled={currentStep === 1} onClick={() => {setCurrentStep(currentStep - 1)}}>
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                    {t('back')}
                </button>
            </div>

            <div className="pagination-bars-container">
                {stepsList.map((step) => (
                <div
                    key={step}
                    className={`pagination-bar ${currentStep >= step ? 'active' : ''}`}
                ></div>
                ))}
            </div>

            {(currentStep < numSteps) ? (
                <div className='button-container'>
                    <button
                        className='custom-button-small'
                        onClick={() => {setCurrentStep(currentStep + 1)}}
                        disabled={isNextButtonDisabled}
                    >
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>
                        
                        {/* {t('next')} */}
                    </button>
                </div>
            ): (
                <div className='button-container'>
                    <button className='custom-button-small' onClick={handleSave} disabled={isSaveButtonDisabled}>
                        {t('save')}
                    </button>
                </div>
            )}
            
        </div>
    );
};

export default Pagination;
