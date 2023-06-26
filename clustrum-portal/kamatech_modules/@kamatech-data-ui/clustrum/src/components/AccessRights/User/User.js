import React from 'react';
import PropTypes from 'prop-types';
import ParticipantAccount from '../ParticipantAccount/ParticipantAccount';

const User = ({ showIcon, participant, role, useRole, onClickLink }) => {
  const source = useRole ? participant[role] || {} : participant;
  const { name, cloud_icon: cloudIcon, icon, title, link } = source;

  const iconHref = cloudIcon ? `${cloudIcon}/islands-retina-middle` : icon || undefined;

  return showIcon ? (
    <ParticipantAccount
      showPic
      picUrl={iconHref}
      name={name}
      title={title}
      link={link}
      onClickLink={onClickLink}
    />
  ) : (
    <ParticipantAccount name={name} title={title} link={link} onClickLink={onClickLink} />
  );
};

User.propTypes = {
  showIcon: PropTypes.bool,
  participant: PropTypes.object,
  role: PropTypes.oneOf(['subject', 'requester', 'author']),
  useRole: PropTypes.bool,
  onClickLink: PropTypes.func,
};

User.defaultProps = {
  showIcon: false,
  role: 'subject',
  useRole: true,
  participant: {},
};

export default User;
