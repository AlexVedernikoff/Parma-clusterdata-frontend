import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';

import { Spin, Icon } from 'lego-on-react';

import { removeComment } from '../../../../../../modules/comments/comments';

// import './Comment.scss';

const DATE_FORMAT = 'DD.MM.YYYY';

const b = block('comment');

// TODO: показывать тултип из List, проставляя anchor, по наведению на alert-иконку

export default class Comment extends React.PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    feed: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    dateUntil: PropTypes.string,
    color: PropTypes.string,
    isStat: PropTypes.bool,
    // служебные поля
    isSelected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    showConfirmParanja: PropTypes.func.isRequired,
    onRemoved: PropTypes.func.isRequired,
    refSelected: PropTypes.func,
  };

  state = {
    isRemoving: false,
    isError: false,
  };

  async _remove() {
    try {
      const { id, feed, isStat } = this.props;
      await removeComment(id, feed, isStat);
      this.props.onRemoved();
    } catch (error) {
      console.error(error);
      this.setState({ isError: true, isRemoving: false });
    }
  }

  _onRemove(event) {
    event.stopPropagation(); // TODO: это точно нужно?
    this.setState({ isRemoving: true, isError: false });
    this.props.showConfirmParanja({
      text: 'Вы действительно хотите удалить этот комментарий?',
      confirmText: 'Да, удалить',
      onConfirm: () => this._remove(),
      onCancel: () => this.setState({ isRemoving: false }),
      onOutsideClick: 'onCancel',
    });
  }

  render() {
    const date = moment(this.props.date).format(DATE_FORMAT);
    const dateUntil =
      this.props.dateUntil && moment(this.props.dateUntil).format(DATE_FORMAT);
    return (
      <div
        className={b({ selected: this.props.isSelected })}
        onClick={this.props.onClick}
        style={this.props.color ? { borderLeftColor: this.props.color } : {}}
        ref={node => {
          if (this.props.isSelected) {
            this.props.refSelected(node);
          }
        }}
      >
        <div className={b('header')}>
          {dateUntil ? `${date} - ${dateUntil}` : date}
          {this.state.isRemoving ? (
            <Spin size="xxs" progress mix={{ block: b('icon', { remove: true }) }} />
          ) : (
            <Icon
              glyph="type-cross"
              size="xs"
              mix={{ block: b('icon', { remove: true }) }}
              attrs={{ onClick: this._onRemove.bind(this) }}
            />
          )}
          {this.state.isError && (
            <Icon
              glyph="alert"
              glyphSize="15"
              mix={{ block: b('icon', { error: true }) }}
            />
          )}
        </div>
        <div>{this.props.text}</div>
      </div>
    );
  }

  // componentDidMount() {
  //     console.log('componentDidMount', this.props.isSelected);
  //     if (this.props.isSelected) {
  //         this._node.scrollIntoView();
  //     }
  // }
}
