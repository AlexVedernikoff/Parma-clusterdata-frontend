import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';
import { Button } from 'lego-on-react';
import EntryTitle from '../../../EntryTitle/EntryTitle';
import { TIMESTAMP_FORMAT } from '../../constants';
import DialogAddParticipants from '../../DialogAddParticipants/DialogAddParticipants';

// import './ActionPanel.scss';

const b = block('dl-ar-action-panel');

class ActionPanel extends React.Component {
  state = {
    visibleDialog: false,
  };

  onClick = () => this.setState({ visibleDialog: true });

  onCloseDialog = () => this.setState({ visibleDialog: false });

  onSuccessDialog = () => {
    this.setState({ visibleDialog: false }, () => {
      this.props.refresh();
    });
  };

  render() {
    const { entry, disabled, editable } = this.props;

    return (
      <React.Fragment>
        <div className={b()}>
          <div className={b('entry-title')}>
            <EntryTitle entry={entry} theme="inline" />
          </div>
          {Boolean(entry.updatedAt) && (
            <div className={b('updatedAt')}>
              <span>{moment(entry.updatedAt).format(TIMESTAMP_FORMAT)}</span>
            </div>
          )}
          {/* <Button - пока не реализована такая возможность
                        theme="pseudo"
                        size="s"
                        view="default"
                        tone="default"
                        cls={b('btn-apply-deeper')}
                        disabled={disabled}
                    >
                        Применить рекурсивно
                    </Button> */}
          <Button
            theme="action"
            size="s"
            view="default"
            tone="default"
            cls={b('btn-add')}
            disabled={disabled}
            onClick={this.onClick}
          >
            Добавить
          </Button>
        </div>
        <DialogAddParticipants
          sdk={this.props.sdk}
          entry={entry}
          onClose={this.onCloseDialog}
          onSuccess={this.onSuccessDialog}
          visible={this.state.visibleDialog}
          withParticipantsRequests={false}
          mode={editable ? 'add' : 'request'}
        />
      </React.Fragment>
    );
  }
}

ActionPanel.propTypes = {
  sdk: PropTypes.object,
  entry: PropTypes.object,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  refresh: PropTypes.func,
};

export default ActionPanel;
