import React from 'react';


const UserInvitation = ({user, removeInvitation, editInvitation, userEmail}) => {
  

  return (
    <div className='user-list-item'>
        <div className='user-list-email' title={user.email}>{user.email}</div>
        <div>{user.permisionType}</div>
        
        {(userEmail && userEmail === user.email) ? (
          <div className='invitation-you-container'>you</div>
        ) : (
          <div className='invitation-button-container'>
              <div onClick={() => {editInvitation(user.invitationId)}}>
                  <span className="material-symbols-outlined">edit</span>
              </div>
              <div onClick={() => {removeInvitation(user.invitationId);}}>
                  <span className="material-symbols-outlined">close</span>
              </div>
          </div>
        )}
    </div>
  );
};

export default UserInvitation;
