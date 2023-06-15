import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import cloneDeep from 'lodash/cloneDeep';

import { CheckBox } from 'lego-on-react';

import Comment from './Comment/Comment';
import Icon, { extend } from '../../../../Icon/Icon';

extend({
  plus: <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />,
});

// import './List.scss';

const b = block('comments-list');

// TODO: удаление сразу нескольких комментариев, комментарий при этом недоступен для перехода
// TODO: скролить на добавленный коммент

export default class List extends React.PureComponent {
  static propTypes = {
    comments: PropTypes.array,
    loadComments: PropTypes.func,
    updateComments: PropTypes.func,
    updateSelectedIndex: PropTypes.func,
    updateExcludeParams: PropTypes.func,
    showConfirmParanja: PropTypes.func,
    selectedIndex: PropTypes.number,
    setState: PropTypes.func,
    excludeParams: PropTypes.bool,
    toggleLoadingParanja: PropTypes.func,
    // isBrowserChart: PropTypes.bool
  };

  async _onRemoved(id, feed) {
    try {
      const comments = cloneDeep(this.props.comments);
      const index = comments.findIndex(
        ({ id: currentId, feed: currentFeed }) =>
          currentId === id && currentFeed === feed,
      );
      comments.splice(index, 1);

      const selectedIndex = Math.min(
        Math.max(0, this.props.selectedIndex - 1),
        comments.length,
      );

      this.props.updateComments(comments);
      this.props.updateSelectedIndex(selectedIndex);
    } catch (error) {
      console.error(error);
    }
  }

  async _readComments(excludeParams) {
    try {
      const comments = await this.props.loadComments(excludeParams);

      // if (excludeParams) {
      //     // чтобы при закрытии модалки отфильтровать и вернуть подходящие комментарии,
      //     // а не те, что сейчас в списке
      //     comments.forEach((comment) => {
      //         comment.notMatchedByParams =
      //             this.props.comments.findIndex(({id, key}) => id === comment.id && key === comment.key) === -1;
      //     });
      // }

      let selectedIndex = this.props.selectedIndex;

      if (selectedIndex !== null) {
        const { id, feed } = this.props.comments[selectedIndex];
        selectedIndex = comments.findIndex(
          ({ id: currentId, feed: currentFeed }) =>
            currentId === id && currentFeed === feed,
        );

        if (selectedIndex === -1) {
          selectedIndex = null;
        }
      }

      this.props.updateComments(comments);
      this.props.updateSelectedIndex(selectedIndex);
    } catch (error) {
      console.error(error);
    }
  }

  async componentWillReceiveProps({ excludeParams }) {
    if (this.props.excludeParams !== excludeParams) {
      let isLoading = true;

      setTimeout(() => this.props.toggleLoadingParanja(isLoading), 800);

      await this._readComments(excludeParams);

      isLoading = false;

      this.props.toggleLoadingParanja(false);
    }
  }

  componentWillUpdate() {
    this._selectedCommentNode = null;
  }

  render() {
    return (
      <div className={b()}>
        <div className={b('list')}>
          <div
            className={b('new-comment', { selected: this.props.selectedIndex === null })}
            onClick={() => this.props.updateSelectedIndex(null)}
          >
            <Icon size="22" name="plus" className={b('icon')} />
            Новый комментарий
          </div>
          {this.props.comments.map(
            ({ id, feed, text, date, dateUntil, isStat, meta: { color } }, index) => (
              <Comment
                {...{ id, feed, text, date, dateUntil, color, isStat }}
                key={`${feed}-${id}`}
                isSelected={this.props.selectedIndex === index}
                onClick={() => this.props.updateSelectedIndex(index)}
                showConfirmParanja={this.props.showConfirmParanja}
                onRemoved={() => this._onRemoved(id, feed, isStat)}
                refSelected={node => {
                  this._selectedCommentNode = node;
                }}
              />
            ),
          )}
        </div>
        {
          // this.props.isBrowserChart ?
          //     null :
          <div className={b('controls')}>
            <CheckBox
              theme="normal"
              size="m"
              checked={this.props.excludeParams}
              onChange={() => this.props.updateExcludeParams(!this.props.excludeParams)}
            >
              Без учета параметров
            </CheckBox>
          </div>
        }
      </div>
    );
  }

  componentDidUpdate() {
    if (this._selectedCommentNode) {
      const element = this._selectedCommentNode;

      if (typeof Element.prototype.scrollIntoViewIfNeeded === 'function') {
        element.scrollIntoViewIfNeeded();
      } else {
        // для FF
        // https://gist.github.com/hsablonniere/2581101
        const centerIfNeeded = false;

        const parent = element.parentNode;
        const parentComputedStyle = window.getComputedStyle(parent, null);
        const parentBorderTopWidth = parseInt(
          parentComputedStyle.getPropertyValue('border-top-width'),
          10,
        );
        const parentBorderLeftWidth = parseInt(
          parentComputedStyle.getPropertyValue('border-left-width'),
          10,
        );
        const overTop = element.offsetTop - parent.offsetTop < parent.scrollTop;
        const overBottom =
          element.offsetTop -
            parent.offsetTop +
            element.clientHeight -
            parentBorderTopWidth >
          parent.scrollTop + parent.clientHeight;
        const overLeft = element.offsetLeft - parent.offsetLeft < parent.scrollLeft;
        const overRight =
          element.offsetLeft -
            parent.offsetLeft +
            element.clientWidth -
            parentBorderLeftWidth >
          parent.scrollLeft + parent.clientWidth;
        const alignWithTop = overTop && !overBottom;

        if ((overTop || overBottom) && centerIfNeeded) {
          parent.scrollTop =
            element.offsetTop -
            parent.offsetTop -
            parent.clientHeight / 2 -
            parentBorderTopWidth +
            element.clientHeight / 2;
        }

        if ((overLeft || overRight) && centerIfNeeded) {
          parent.scrollLeft =
            element.offsetLeft -
            parent.offsetLeft -
            parent.clientWidth / 2 -
            parentBorderLeftWidth +
            element.clientWidth / 2;
        }

        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
          element.scrollIntoView(alignWithTop);
        }
      }
    }
  }
}
