import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';

import Item from './Item/Item';
import Title from './Title/Title';
import Separator from './Separator/Separator';
// import './List.scss';

const b = cn('dl-dropdown-menu');

class List extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    width: PropTypes.number,
    visible: PropTypes.bool,
    wrapTo: PropTypes.func,
    onClick: PropTypes.func,
  };

  static hasIcons(list) {
    return list.some(item => item.icon);
  }
  renderElements = hasIcons => {
    const { wrapTo } = this.props;

    return (item, index) => {
      switch (item.type) {
        case 'separator':
          return <Separator key={index} />;
        case 'title':
          return <Title key={index} content={item.content} />;
        case 'item':
        default:
          return <Item key={index} hasIcons={hasIcons} data={item} wrapTo={wrapTo} onClick={this.props.onClick} />;
      }
    };
  };

  render() {
    const { width, isMainPane, visible, data } = this.props;
    const hasIcons = List.hasIcons(data);
    const items = this.props.data.map(this.renderElements(hasIcons));

    const opened = { true: 'yes', false: 'no' }[visible];
    const submenuStyle = {
      left: width,
    };

    return (
      <div
        className={b
          .builder()('list', { opened })
          .is({ main: isMainPane })()}
        style={isMainPane ? {} : submenuStyle}
      >
        <div className={b('list-content')}>{items}</div>
      </div>
    );
  }
}

export default List;
