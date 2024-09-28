import Modal from 'react-modal';
Modal.setAppElement('#root');  // Required for accessibility


const CustomModal = ({modalIsOpen, setModalIsOpen, title, content}) => {
    
    return(
        <Modal
            className="custom-item-modal"
            overlayClassName="custom-modal-overlay"
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Example Modal"
            
        >
            <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <div className="modal-close-button-container" onClick={() => setModalIsOpen(false)}>
                    <span className="material-symbols-outlined">close</span>
                </div>
            </div>
            
            <div className="modal-content">
                {content}
            </div>
        </Modal>
    )
}
export default CustomModal;