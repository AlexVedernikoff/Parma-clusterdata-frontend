import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './UserName.scss';

const b = block('user-name-block');
const bInline = block('user-name-inline');

class UserName extends PureComponent {
  static defaultProps = {};

  static propTypes = {
    name: PropTypes.string,
    inline: PropTypes.bool,
    children: PropTypes.object,
  };

  render() {
    const { inline, name, children } = this.props;

    const user = name || children;

    return inline ? (
      <span className={bInline()}>{user}</span>
    ) : (
      <div className={b()}>
        <div className={b('name')}>{user}</div>
      </div>
    );
  }
}

export default UserName;
