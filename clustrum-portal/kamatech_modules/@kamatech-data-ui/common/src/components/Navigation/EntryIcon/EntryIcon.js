import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Icon/Icon';
import noop from 'lodash/noop';

class EntryIcon extends React.Component {
  static propTypes = {
    entry: PropTypes.object,
  };
  static icons = noop;
  render() {
    const { entry, ...props } = this.props;
    const iconData = EntryIcon.icons(entry);
    return iconData ? <Icon data={iconData} {...props} /> : null;
  }
}

export default EntryIcon;
