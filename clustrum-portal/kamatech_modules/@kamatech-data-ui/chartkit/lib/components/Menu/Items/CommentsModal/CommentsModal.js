import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

import ChartsModal from '../ChartsModal/ChartsModal';
import List from './List/List';
import Form from './Form/Form';
import ConfirmParanja from './Paranja/Confirm/Confirm';
import LoadingParanja from './Paranja/Loading/Loading';

// import './CommentsModal.scss';

const b = block('comments-modal');

// TODO: пробрасывать в graphs цвета линий и использовать их в списке комментариев напротив комментария (?)
// TODO: и может даже в селекте линий (?)

export default class CommentsModal extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired, // DOM-элемент, на который был mountComponent,
    graphs: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      }),
    ), // массив линий (для добавления точки)
    comments: PropTypes.array,
    dateMinMs: PropTypes.number,
    dateMaxMs: PropTypes.number,
    scale: PropTypes.oneOf(['s', 'i', 'h', 'd', 'w', 'm', 'q', 'y']), // TODO: вынести в константу
    feeds: PropTypes.arrayOf(
      PropTypes.shape({
        feed: PropTypes.string.isRequired,
        params: PropTypes.object,
      }),
    ),
    currentFeed: PropTypes.string.isRequired,
    currentParams: PropTypes.object,
    loadComments: PropTypes.func,
    // isStatChart: PropTypes.bool,
    // isBrowserChart: PropTypes.bool,
    onClose: PropTypes.func,
    checkMatchCommentsConfig: PropTypes.func,
  };

  static defaultProps = {
    comments: [],
    // currentParams: {},
  };

  state = {
    comments: cloneDeep(this.props.comments || []),
    selectedIndex: null,
    excludeParams: false,
    showConfirmParanja: false,
    confirmParanjaConfig: {},
    showLoadingParanja: false,
    graphs: [],
    feeds: [],
  };

  _close(event) {
    const comments = this.state.excludeParams
      ? // this.state.comments.filter(({notMatchedByParams}) => !notMatchedByParams) :
        this.state.comments.filter(
          ({ feed, params, isStat }) => isStat || this.props.checkMatchCommentsConfig(feed, params),
        )
      : this.state.comments;

    this.props.onClose(comments);

    ChartsModal.onClickClose(event, this.props.element);
  }

  _checkDraftAndAction(action) {
    if (this._formComponent.isDraft()) {
      this.setState({
        showConfirmParanja: true,
        confirmParanjaConfig: {
          text: 'Комментарий был изменен. Вы хотите вернуться и сохранить изменения?',
          confirmText: 'Да, вернуться',
          onConfirm: () => {},
          onCancel: action,
          onOutsideClick: 'onConfirm',
        },
      });
    } else {
      action();
    }
  }

  _onClickClose(event) {
    this._checkDraftAndAction(this._close.bind(this, event));
  }

  render() {
    const { meta, ...comment } = this.state.comments[this.state.selectedIndex] || {};
    return (
      <ChartsModal element={this.props.element} onOutsideClick={this._onClickClose.bind(this)} mix={b()}>
        <ChartsModal.Section mix={b('section')}>
          <ChartsModal.Body>
            <List
              comments={this.state.comments}
              loadComments={this.props.loadComments}
              excludeParams={this.state.excludeParams}
              selectedIndex={this.state.selectedIndex}
              updateComments={comments => this.setState({ comments })}
              updateSelectedIndex={selectedIndex =>
                this._checkDraftAndAction(this.setState.bind(this, { selectedIndex }))
              }
              updateExcludeParams={excludeParams => this.setState({ excludeParams })}
              showConfirmParanja={confirmParanjaConfig =>
                this.setState({ showConfirmParanja: true, confirmParanjaConfig })
              }
              toggleLoadingParanja={showLoadingParanja => this.setState({ showLoadingParanja })}
              setState={this.setState.bind(this)}
              // isBrowserChart={this.props.isBrowserChart}
            />
          </ChartsModal.Body>
        </ChartsModal.Section>
        <ChartsModal.Section>
          <ChartsModal.Body>
            <Form
              {...{
                ...comment,
                ...meta,
                currentFeed: this.props.currentFeed,
                currentParams: this.props.currentParams,
                dateMinMs: this.props.dateMinMs,
                dateMaxMs: this.props.dateMaxMs,
                scale: this.props.scale,
                feeds: this.props.feeds,
                graphs: this.props.graphs,
                // isStatChart: this.props.isStatChart,
                // isBrowserChart: this.props.isBrowserChart,
                onAction: (newComment, isEdited) => {
                  let comments;

                  if (isEdited) {
                    comments = cloneDeep(this.state.comments);
                    comments[this.state.selectedIndex] = newComment;
                  } else {
                    comments = [newComment].concat(this.state.comments);
                  }

                  comments.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());

                  const selectedIndex = comments.findIndex(({ id }) => id === newComment.id);

                  // TODO: pending comments или отправлять в list новый коммент?

                  const isMatchedWithCommentsConfig = this.props.checkMatchCommentsConfig(
                    newComment.feed,
                    newComment.params,
                  );

                  if (isMatchedWithCommentsConfig) {
                    this.setState({ selectedIndex, comments });
                  } else {
                    this.setState({ selectedIndex, comments, excludeParams: true });
                  }
                },
                onClose: this._onClickClose.bind(this),
                ref: component => {
                  this._formComponent = component;
                },
              }}
            />
          </ChartsModal.Body>
        </ChartsModal.Section>
        <ConfirmParanja
          visible={this.state.showConfirmParanja}
          text={this.state.confirmParanjaConfig.text}
          confirmText={this.state.confirmParanjaConfig.confirmText}
          onConfirm={() => {
            this.setState({ showConfirmParanja: false });
            this.state.confirmParanjaConfig.onConfirm();
          }}
          onCancel={() => {
            this.setState({ showConfirmParanja: false });
            this.state.confirmParanjaConfig.onCancel();
          }}
          onOutsideClick={this.state.confirmParanjaConfig.onOutsideClick}
        />
        <LoadingParanja visible={this.state.showLoadingParanja} />
      </ChartsModal>
    );
  }
}
