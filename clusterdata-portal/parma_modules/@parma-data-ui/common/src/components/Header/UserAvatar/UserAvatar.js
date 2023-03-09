import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {UserAccount} from 'lego-on-react';
// import './UserAvatar.scss';

const b = block('yc-header');

export default function UserAvatar({userData, actionsMenu, onLogin}) {
    if (!userData) {
        return null;
    }

    const accounts = (userData.accounts || [])
        .filter(({uid}) => uid !== userData.uid)
        .map(({uid, name, avatarId}) => (
            <UserAccount
                key={uid}
                uid={uid}
                name={name}
                avatarId={avatarId}
                pic
                hasRedLetter
                mix={{block: 'user2', elem: 'account', js: {uid}}}
            />
        ));

    return (
        <div className={b('user-account')}>
            {/*<User*/}
            {/*    provider={userData.provider}*/}
            {/*    uid={userData.uid}*/}
            {/*    yu={userData.yu}*/}
            {/*    passportHost={userData.passportHost}*/}
            {/*    avatarHost={userData.avatarHost}*/}
            {/*    avatarId={userData.avatarId}*/}
            {/*    name={userData.name || false}*/}
            {/*    actionsMenu={actionsMenu}*/}
            {/*    onLogin={onLogin}*/}
            {/*>*/}
            {/*    {accounts}*/}
            {/*</User>*/}
        </div>
    );
}

UserAvatar.propTypes = {
    userData: PropTypes.shape({
        uid: PropTypes.string.isRequired,
        yu: PropTypes.string.isRequired,
        avatarId: PropTypes.string.isRequired,
        name: PropTypes.string,
        passportHost: PropTypes.string,
        avatarHost: PropTypes.string,
        provider: PropTypes.string,
        accounts: PropTypes.arrayOf(PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string,
            avatarId: PropTypes.string.isRequired
        }))
    }),
    actionsMenu: PropTypes.array,
    onLogin: PropTypes.func
};
