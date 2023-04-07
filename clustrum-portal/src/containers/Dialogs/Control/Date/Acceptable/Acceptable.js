import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';

import { Datepicker } from '@kamatech-data-ui/common/src';
import { i18n } from '@kamatech-data-ui/clustrum';

import Button from '../../Switchers/Button';
import Dialog from '../../Dialog/Dialog';

import { DATE_FORMAT } from '../../constants';
import { getLang } from '../../../../../helpers/utils-dash';

// import './Acceptable.scss';

const b = block('date-acceptable');

class Acceptable extends React.PureComponent {
  static propTypes = {
    acceptableValues: PropTypes.object,
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    acceptableValues: {},
  };

  state = {
    showDialog: false,
    newValue: null,
    acceptableValues: this.props.acceptableValues,
  };

  closeDialog = () => this.setState({ showDialog: false });

  renderBody() {
    const { acceptableValues } = this.state;
    return (
      <React.Fragment>
        <div className={b('row')}>
          <div className={b('title')}>{i18n('dash.control-dialog.edit', 'field_date-from')}</div>
          <div className={b('value')}>
            <Datepicker
              locale={getLang()}
              date={acceptableValues.from || ''}
              scale="day"
              allowEmptyValue={true}
              hasClear={false}
              emptyValueText={i18n('dash.control-dialog.edit', 'value_date-no-limits')}
              callback={({ from }) => this.setState({ acceptableValues: { ...acceptableValues, from } })}
              showApply={false}
            />
          </div>
        </div>
        <div className={b('row')}>
          <div className={b('title')}>{i18n('dash.control-dialog.edit', 'field_date-to')}</div>
          <div className={b('value')}>
            <Datepicker
              locale={getLang()}
              date={acceptableValues.to || ''}
              scale="day"
              allowEmptyValue={true}
              hasClear={false}
              emptyValueText={i18n('dash.control-dialog.edit', 'value_date-no-limits')}
              callback={({ from: to }) => this.setState({ acceptableValues: { ...acceptableValues, to } })}
              showApply={false}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderDialog() {
    const { onApply } = this.props;
    const { showDialog, acceptableValues } = this.state;
    return (
      <Dialog
        visible={showDialog}
        caption={i18n('dash.control-dialog.edit', 'label_acceptable-values')}
        onApply={() => {
          onApply({ acceptableValues });
          this.closeDialog();
        }}
        onClose={this.closeDialog}
      >
        {this.renderBody()}
      </Dialog>
    );
  }

  render() {
    const {
      acceptableValues: { from, to },
    } = this.props;
    let text = i18n('dash.control-dialog.edit', 'value_date-no-limits');
    if (from && to) {
      text = `${moment(from).format(DATE_FORMAT)} - ${moment(to).format(DATE_FORMAT)}`;
    } else if (from) {
      text = `${moment(from).format(DATE_FORMAT)} - ${text}`;
    } else if (to) {
      text = `${text} - ${moment(to).format(DATE_FORMAT)}`;
    }

    return (
      <React.Fragment>
        <Button
          title={i18n('dash.control-dialog.edit', 'field_acceptable-values')}
          text={text}
          onClick={() => this.setState({ showDialog: !this.state.showDialog })}
        />
        {this.renderDialog()}
      </React.Fragment>
    );
  }
}

export default Acceptable;
