import Modal from 'react-modal';
import TermsText from './TermsText';
Modal.setAppElement('#root');  // Required for accessibility


const TermsModal = ({modalIsOpen, setModalIsOpen, title, content}) => {
    
    return(
        <Modal
            className="terms-modal terms"
            overlayClassName="custom-modal-overlay"
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Example Modal"
            
        >
            <div className="modal-header">
                <h4 className="modal-title">{title}</h4>
                <div className="modal-close-button-container" onClick={() => setModalIsOpen(false)}>
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">close</span>
                </div>
            </div>
            
            <div className='terms-modal-content-container'>
                <TermsText/>
            </div>
        
        </Modal>
    )
}
export default TermsModal;