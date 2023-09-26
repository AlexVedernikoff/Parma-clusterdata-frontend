import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Loader } from '@kamatech-data-ui/common/src';
import AddingParticipant from '../AccessRights/AddingParticipant/AddingParticipant';
import User from '../AccessRights/User/User';
import ButtonDelete from '../AccessRights/ButtonDelete/ButtonDelete';
import PermissionSelect from '../AccessRights/PermissionSelect/PermissionSelect';
import { DL, PERMISSION } from '../../constants/common';
import { $appSettingsStore } from '@shared/app-settings';

// import './SettingPermissions.scss';

const b = block('dl-setting-permissions');

class SettingPermissions extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onChange: PropTypes.func,
  };

  state = {
    participants: [],
    predefinedList: [],
    isLoading: false,
  };

  async componentDidMount() {
    const { sdk, userId, onChange } = this.props;
    const { user: { uid, login } = {} } = $appSettingsStore.getState();
    const predefinedParticipants = [],
      participants = [];

    this.setState({
      isLoading: true,
    });

    if (DL.IS_INTERNAL && uid) {
      const yGroup = 'group:962';

      const [yGroupSubject, userSubject] = [
        await sdk.suggest({ searchText: yGroup, limit: 1 }),
        await sdk.suggest({ searchText: userId, limit: 1 }),
      ];

      predefinedParticipants.push(yGroupSubject[0]);
      participants.push(
        this.getUserItem({
          participant: userSubject[0],
          permission: PERMISSION.ADMIN,
          freeze: true,
        }),
      );
    } else if (login) {
      const [userSubject] = [await sdk.suggest({ searchText: login, limit: 1 })];

      participants.push(
        this.getUserItem({
          participant: userSubject[0],
          permission: PERMISSION.ADMIN,
          freeze: true,
        }),
      );
    }

    this.setState(
      {
        isLoading: false,
        predefinedParticipants,
        participants,
      },
      () => {
        if (onChange) {
          onChange({ participants });
        }
      },
    );
  }

  getUserItem = ({ participant = {}, permission = PERMISSION.READ, freeze = false }) => {
    const { name } = participant;
    return {
      name,
      permission,
      subject: {
        ...participant,
      },
      freeze,
    };
  };

  addParticipant = ({ participant }) => {
    const { onChange } = this.props;
    const { participants } = this.state;

    const existedParticipant = participants.find(({ name }) => name === participant.name);

    if (!existedParticipant) {
      const participantNew = this.getUserItem({ participant });
      const participantsNext = [...participants, participantNew];

      this.setState(
        {
          participants: participantsNext,
        },
        () => {
          if (onChange) {
            onChange({ participants: participantsNext });
          }
        },
      );
    }
  };

  onChangeSelect(index) {
    return permission => {
      const { onChange } = this.props;
      const { participants } = this.state;

      const participantChanged = participants[index];
      const participantsNext = [...participants];

      participantsNext.splice(index, 1, {
        ...participantChanged,
        permission,
      });

      this.setState(
        {
          participants: participantsNext,
        },
        () => {
          if (onChange) {
            onChange({ participants: participantsNext });
          }
        },
      );
    };
  }

  onDelete(index) {
    return () => {
      const { onChange } = this.props;
      const { participants } = this.state;

      const participantsNext = [...participants];
      participantsNext.splice(index, 1);

      this.setState(
        {
          participants: participantsNext,
        },
        () => {
          if (onChange) {
            onChange({ participants: participantsNext });
          }
        },
      );
    };
  }

  render() {
    const { visible, sdk } = this.props;
    const { isLoading, participants, predefinedParticipants } = this.state;

    if (isLoading) {
      return (
        <div className={b()}>
          <div className={b('loader')}>
            <Loader size="m" />
          </div>
        </div>
      );
    }

    return (
      <div className={b()}>
        <AddingParticipant
          editable={true}
          visible={visible}
          onAction={this.addParticipant}
          predefinedParticipants={predefinedParticipants}
          sdk={sdk}
        />
        <div className={b('participants')}>
          {participants.map((participant, index) => {
            const { permission, freeze } = participant;

            return (
              <div key={index} className={b('participant')}>
                <div className={b('user')}>
                  <User showIcon participant={participant} />
                </div>
                <div className={b('permission')}>
                  <PermissionSelect
                    disabled={freeze}
                    val={permission}
                    onChange={this.onChangeSelect(index)}
                    scope="connection" // т.к. диалог для connections
                  />
                </div>
                <ButtonDelete
                  className={b('btn-delete', { hidden: freeze })}
                  onClick={this.onDelete(index)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SettingPermissions;
