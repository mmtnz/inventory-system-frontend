import Modal from 'react-modal';
import Moment from 'react-moment'
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
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">close</span>
                </div>
            </div>
            
            <div className='modal-content-container'>
                <div className="modal-content">
                    <ul>
                        {content.map((result, index) => {
                            let [lentName, lentDateInit, lentDateEnd] = result.split('/');
                            return(
                                <li key={index}>
                                    <div className='modal-history-entry'>
                                        {lentName}
                                        <div className='modal-history-entry-aux'>
                                            <Moment format="DD/MM/YYYY ">{lentDateInit}</Moment>
                                            <Moment format="DD/MM/YYYY ">{lentDateEnd}</Moment>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </Modal>
    )
}
export default CustomModal;