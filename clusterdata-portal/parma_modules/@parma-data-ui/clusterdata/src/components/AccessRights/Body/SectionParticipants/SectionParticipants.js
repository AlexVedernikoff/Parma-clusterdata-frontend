import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Utils from '../../../../utils';
import User from '../../User/User';
import DialogEditPermissions from '../DialogEditPermissions/DialogEditPermissions';

// import './SectionParticipants.scss';

const b = block('dl-ar-section-participants');

class SectionParticipants extends React.Component {
  state = {
    currentParticipantIndex: null,
    dialogVisible: false,
  };

  onClick(index) {
    this.setState({ dialogVisible: true, currentParticipantIndex: index });
  }

  onCloseDialog = () => this.setState({ dialogVisible: false, currentParticipantIndex: null });

  onSuccessDialog = () => {
    this.setState({ dialogVisible: false, currentParticipantIndex: null }, () => {
      this.props.refresh();
    });
  };

  render() {
    const { participants, editable } = this.props;
    const { currentParticipantIndex } = this.state;

    return (
      <React.Fragment>
        {participants.map((participant, index) => {
          const { permission } = participant;

          return (
            <div key={index} className={b('participant', { editable })} onClick={() => editable && this.onClick(index)}>
              <div className={b('user')}>
                <User showIcon participant={participant} />
              </div>
              <div className={b('permission')}>{Utils.getTextByPermission(permission)}</div>
            </div>
          );
        })}
        {editable && currentParticipantIndex !== null && (
          <DialogEditPermissions
            sdk={this.props.sdk}
            entry={this.props.entry}
            onClose={this.onCloseDialog}
            onSuccess={this.onSuccessDialog}
            visible={this.state.dialogVisible}
            editable={editable}
            participant={participants[currentParticipantIndex]}
          />
        )}
      </React.Fragment>
    );
  }
}

SectionParticipants.propTypes = {
  participants: PropTypes.array,
  editable: PropTypes.bool,
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object,
  refresh: PropTypes.func,
};

export default SectionParticipants;
