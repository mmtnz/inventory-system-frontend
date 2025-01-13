import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import { apiAcceptInvitation, apiDeclineInvitation } from "../../services/api";
import { ClipLoader } from 'react-spinners'

const InvitationCard = ({invitation, acceptInvitation, declineInvitation}) => {
    
    const [isLoading ,setIsLoading] = useState(false);
    
    const handleAcceptInvitation = async () => {
        setIsLoading(true);
        try {
            await acceptInvitation(invitation);
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    }

    const handleDeclineInvitation = async () => {
        setIsLoading(true);
        try {
            await declineInvitation(invitation);
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    }
    
    
    return (
        <div className="invitation-card" key={invitation.storageRoomId}>
            {invitation?.name}
            <ClipLoader className="custom-spinner-clip" loading={isLoading} />
            <div className="pending-invitation-button-container">
                <button className="custom-button-icon" onClick={handleAcceptInvitation} disabled={isLoading}>
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">check</span>
                </button>
                <button className="custom-button-icon delete" onClick={handleDeclineInvitation} disabled={isLoading}>
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">close</span>
                </button>
            </div>
        </div>
    )
};

const Invitations = ({invitationsList, setInvitationsList,  getStorageRoomsList}) => {
    
    const [isWrapped, setIsWrapped] = useState(true);
    const { t } = useTranslation('homePage');

    const acceptInvitation = async (invitation) => {
        try {
            const result = await apiAcceptInvitation(invitation.storageRoomId, invitation.invitationId);
            invitation = result;
            console.log(result)
            const auxInvitationsList = invitationsList.map(obj =>
                obj.invitationId === invitation.invitationId ? { ...obj, status: 'accepted' } : obj
            );
            await getStorageRoomsList();
            setInvitationsList(auxInvitationsList);
        } catch (err) {
            console.log(err);
        }
    }

    const declineInvitation = async (invitation) => {
        try {
            const result = await apiDeclineInvitation(invitation.storageRoomId, invitation.invitationId);
            const auxInvitationsList = invitationsList.filter(obj => obj.invitationId !== invitation.invitationId );
            setInvitationsList(auxInvitationsList);
        } catch (err) {
            console.log(err);
        }
    }
    
    return (
        <div className="margin-bottom-2rem width-100">
            
            <div
                className="invitations-title-container margin-bottom-1rem"
                onClick={() => {setIsWrapped(!isWrapped)}}
            >
                Invitations ({invitationsList.filter(inv => inv.status === 'pending').length})
                {isWrapped ? (
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">chevron_right</span>
                ): (
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">expand_more</span>
                )}            
            </div>

            {!isWrapped && (
                <div className="invitations-container">
                    {invitationsList.filter(inv => inv.status === 'pending').map(invitation => (
                        <InvitationCard
                            key={invitation.storageRoomId}
                            invitation={invitation}
                            acceptInvitation={acceptInvitation}
                            declineInvitation={declineInvitation}
                        />
                    ))}
                </div>
            )}
        </div>
    )
};
export default Invitations;