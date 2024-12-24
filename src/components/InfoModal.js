import React from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');  // Required for accessibility

const InfoModal = ({modalIsOpen, setModalIsOpen, text}) => {
  


  return (
    <Modal
        className="info-modal"
        overlayClassName="info-modal-overlay"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Example Modal"   
    >
        <div className="info-modal-header">
            <h2 className="info-modal-title">Info</h2>
            <div className="modal-close-button-container" onClick={() => setModalIsOpen(false)}>
                <span className="material-symbols-outlined">close</span>
            </div>
        </div>
        
        <div className='info-modal-content-container'>
            <div className="info-modal-content">
                {text.split('\\n').map((line, index) => (
                    <React.Fragment key={index}>
                    {line}
                    <br />
                    </React.Fragment>)
                )}
            </div>
        </div>
    </Modal>


  );

};

export default InfoModal;
