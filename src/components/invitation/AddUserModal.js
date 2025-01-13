import Modal from 'react-modal';
import Moment from 'react-moment'
import { useTranslation } from 'react-i18next';
import AddUserForm from './AddUserForm';
Modal.setAppElement('#root');  // Required for accessibility


const AddUserModal = ({modalIsOpen, setModalIsOpen, usersList, setUsersList, userData, setUserData, isNew, invitationsToEdit, setInvitationsToEdit, currentUserList}) => {
    
    const { t, i18n } = useTranslation('storageRoom');

    const closeModal = () => {
        setModalIsOpen(false);
        setUserData(null);
    }

    return(
        <Modal
            className="small-modal"
            overlayClassName="small-modal-overlay"
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="New user"
            
        >
            <div className="modal-header">
                <h4 className="small-modal-title">{t('addUser')}</h4>
                <div className="modal-close-button-container" onClick={closeModal}>
                    <span
                        className="material-symbols-outlined"
                        translate="no" aria-hidden="true" // prevent problems with translators
                    >close</span>
                </div>
            </div>
            
            <div className='small-modal-content-container'>
                <div className="small-modal-content">
                    <AddUserForm
                        usersList={usersList}
                        setUsersList={setUsersList}
                        userData={userData}
                        setUserData={setUserData}
                        closeModal={closeModal}
                        isNew={isNew}
                        invitationsToEdit={invitationsToEdit}
                        setInvitationsToEdit={setInvitationsToEdit}
                        currentUserList={currentUserList}
                    />
                </div>
            </div>
        </Modal>
    )
}
export default AddUserModal;