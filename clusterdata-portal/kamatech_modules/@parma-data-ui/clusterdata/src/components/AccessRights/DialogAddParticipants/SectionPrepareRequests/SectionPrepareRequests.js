import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import User from '../../User/User';
import { PERMISSION_ACTION } from '../../constants';
import PermissionSelect from '../../PermissionSelect/PermissionSelect';
import ButtonDelete from '../../ButtonDelete/ButtonDelete';

// import './SectionPrepareRequests.scss';

const b = block('dl-ar-section-prepare-requests');

const SectionPrepareRequests = ({ participants, onAction, inactive, entry }) => (
  <div className={b()}>
    {participants.map((participant, index) => {
      return (
        <div key={index} className={b('row')}>
          <div className={b('user')}>
            <User showIcon useRole={false} participant={participant} />
          </div>
          <div className={b('permission')}>
            <PermissionSelect
              disabled={inactive}
              val={participant.permission}
              onChange={newPermission =>
                onAction({
                  action: PERMISSION_ACTION.SELECT_CHANGE,
                  permission: newPermission,
                  index,
                })
              }
              scope={entry.scope}
            />
          </div>
          <ButtonDelete
            className={b('btn-delete')}
            disabled={inactive}
            onClick={() =>
              onAction({
                action: PERMISSION_ACTION.DELETE,
                index,
              })
            }
          />
        </div>
      );
    })}
  </div>
);

SectionPrepareRequests.propTypes = {
  participants: PropTypes.array,
  onAction: PropTypes.func,
  inactive: PropTypes.bool,
  entry: PropTypes.object,
};

export default SectionPrepareRequests;
