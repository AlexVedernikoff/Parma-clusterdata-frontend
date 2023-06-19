import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
// import './ParticipantAccount.scss';
import { DL } from '../../../constants/common';
import { Link } from 'lego-on-react';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';
import iconGroup from 'icons/group.svg';

const KIND = {
  USER: 'user',
  SYSTEM_USER: 'system_user',
  GROUP: 'group',
  SYSTEM_GROUP: 'system_group',
};

const b = block('dl-ar-participant-account');

class ParticipantAccount extends React.PureComponent {
  static propTypes = {
    showPic: PropTypes.bool,
    picUrl: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
    onClickLink: PropTypes.func,
  };

  _formatName() {
    return this.props.name ? this.props.name.split(':') : [];
  }

  _accentLetter(text) {
    return (
      <React.Fragment>
        <span className={b('accent-letter')}>{text[0]}</span>
        <span>{text.slice(1)}</span>
      </React.Fragment>
    );
  }

  displayPic() {
    const [kind] = this._formatName();
    const pic = (() => {
      switch (kind) {
        case KIND.USER:
        case KIND.SYSTEM_USER:
          if (this.props.picUrl) {
            return (
              <img src={this.props.picUrl} alt={this.props.title} className={b('img')} />
            );
          } else {
            return (
              <img
                src="/api/v1/user/default/photo/64/square.jpg"
                alt={this.props.title}
                className={b('img')}
              />
            );
          }
        case KIND.GROUP:
        case KIND.SYSTEM_GROUP:
          return <Icon data={iconGroup} width="32" height="32" />;
        default:
          return null;
      }
    })();

    return <div className={b('pic')}>{pic}</div>;
  }

  _renderName(name) {
    return DL.IS_INTERNAL && this.props.link ? (
      <Link
        theme="black"
        target="_blank"
        url={this.props.link}
        onClick={this.props.onClickLink}
      >
        {name}
      </Link>
    ) : (
      name
    );
  }

  render() {
    const { showPic, title } = this.props;
    const [kind] = this._formatName();
    const hasAccent = kind === KIND.USER || kind === KIND.SYSTEM_USER;
    const hasBold = kind === KIND.GROUP || kind === KIND.SYSTEM_GROUP;

    return (
      <div className={b()}>
        {showPic && this.displayPic()}
        <div className={b('name', { 'has-accent': hasAccent, 'has-bold': hasBold })}>
          {title
            ? this._renderName(hasAccent ? this._accentLetter(title) : title)
            : undefined}
        </div>
      </div>
    );
  }
}

export default ParticipantAccount;
