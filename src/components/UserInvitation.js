import React from 'react';


const UserInvitation = ({user, removeInvitation, editInvitation}) => {
  

  return (
    <div className='user-list-item'>
        <div className='user-list-email' title={user.email}>{user.email}</div>
        <div>{user.permisionType}</div>
        <div className='invitation-button-container'>
            <div onClick={() => {editInvitation(user.id)}}>
                <span className="material-symbols-outlined">edit</span>
            </div>
            <div onClick={() => {removeInvitation(user.id);}}>
                <span className="material-symbols-outlined">close</span>
            </div>
        </div>
    </div>
  );
};

export default UserInvitation;
