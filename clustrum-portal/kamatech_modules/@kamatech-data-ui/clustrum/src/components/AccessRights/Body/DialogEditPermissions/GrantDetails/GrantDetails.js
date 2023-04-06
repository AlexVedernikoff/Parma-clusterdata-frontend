import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Loader } from '@kamatech-data-ui/common/src';
import { STATUS, i18n, TIMESTAMP_FORMAT } from '../../../constants';
import { Button } from 'lego-on-react';
import isEmpty from 'lodash/isEmpty';
import User from '../../../User/User';
import moment from 'moment';
import Utils from '../../../../../utils';

// import './GrantDetails.scss';

const b = block('dl-ar-grant-details');

class GrantDetails extends React.PureComponent {
  state = {
    status: STATUS.LOADING,
    history: [],
  };

  componentDidMount() {
    this.getGrantDetails();
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  async getGrantDetails() {
    const { entry, sdk, participant } = this.props;
    const { name: subject } = participant;
    this.setState({ status: STATUS.LOADING });
    try {
      const data = await sdk.getGrantDetails({ entryId: entry.entryId, subject });
      if (this._isUnmounted) {
        return;
      }
      const { history } = data;
      this.setState({ history, status: STATUS.SUCCESS });
    } catch (error) {
      if (this._isUnmounted) {
        return;
      }
      this.setState({ status: STATUS.FAIL });
    }
  }

  renderGrantText({ grant, modified }) {
    let { state: grantState } = grant;
    let text = '';
    const permission = Utils.getTextByPermission(grant.grantType) || '';
    switch (grantState) {
      case 'pending':
        text = i18n('label_subject-requesting', { permission });
        break;
      case 'deleted':
        text = i18n('label_subject-revoke', { permission });
        break;
      case 'active': {
        if (isEmpty(modified)) {
          text = i18n('label_subject-accept', { permission });
        } else {
          const [fromGrantType] = modified.grantType;
          const fromPermission = Utils.getTextByPermission(fromGrantType) || '';
          text = i18n('label_subject-change', { from: fromPermission, to: permission });
          grantState += '-modified';
        }
        break;
      }
    }
    return <div className={b('grant-text', { grantState })}>{text}</div>;
  }

  renderBody() {
    const { history } = this.state;
    return (
      <div className={b()}>
        {isEmpty(history)
          ? i18n('label_grant-details-empty')
          : history.map((grantInfo, index) => {
            const { timestamp, comment } = grantInfo;
            return (
              <div key={index} className={b('row')}>
                <div className={b('grant-section')}>
                  <div className={b('timestamp')}>{moment(timestamp).format(TIMESTAMP_FORMAT)}</div>
                  <div className={b('user')}>
                    <User participant={grantInfo} role="author" />
                  </div>
                  {this.renderGrantText(grantInfo)}
                </div>
                {Boolean(comment) && <div className={b('comment')}>{comment}</div>}
              </div>
            );
          })}
      </div>
    );
  }

  renderError() {
    return (
      <div className={b()}>
        <div className={b('error')}>
          <span className={b('error-text')}>{i18n('label_error-get-grant-details')}</span>
          <br />
          <Button theme="action" size="m" view="default" tone="default" onClick={this.refresh}>
            {i18n('button_repeat')}
          </Button>
        </div>
      </div>
    );
  }

  refresh = () => {
    this.getGrantDetails();
  };

  renderLoader() {
    return (
      <div className={b()}>
        <div className={b('loader')}>
          <Loader size="m" />
        </div>
      </div>
    );
  }

  render() {
    switch (this.state.status) {
      case STATUS.SUCCESS:
        return this.renderBody();
      case STATUS.LOADING:
        return this.renderLoader();
      default:
        return this.renderError();
    }
  }
}

GrantDetails.propTypes = {
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object,
  participant: PropTypes.object,
};

export default GrantDetails;
