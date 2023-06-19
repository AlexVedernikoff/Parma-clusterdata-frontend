import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, Link } from 'lego-on-react';
import Icon from '../../Icon/Icon';
import constants from '../constants';
import closeIcon from '../../../assets/icons/preview-close.svg';
import attentionIcon from '../../../assets/icons/toast-attention.svg';
import successIcon from '../../../assets/icons/toast-success.svg';
import infoIcon from '../../../assets/icons/toast-info.svg';

// import './index.scss';

const b = block(`${constants.cNameToast}`);

const FADE_IN_LAST_ANIMATION_NAME = 'move-left';
const FADE_OUT_LAST_ANIMATION_NAME = 'remove-height';

const DEFAULT_TIMEOUT = 5000;

const TITLE_ICONS = {
  error: attentionIcon,
  success: successIcon,
  info: infoIcon,
};

export default class Toast extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    removeCallback: PropTypes.func.isRequired,
    timeout: PropTypes.number,
    allowAutoHiding: PropTypes.bool,
    content: PropTypes.node,
    type: PropTypes.string,
    isClosable: PropTypes.bool,
    isOverride: PropTypes.bool,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
      }),
    ),
  };

  static defaultProps = {
    allowAutoHiding: true,
    isClosable: true,
    isOverride: false,
  };

  state = {
    status: 'creating',
  };

  componentDidMount() {
    this.setTimer();

    this.height = this.getToastHeight();

    this.setState({
      status: 'showing-indents',
    });
  }

  componentDidUpdate() {
    const { isOverride } = this.props;
    const { status } = this.state;

    if (isOverride) {
      this.height = this.getToastHeight();
    }

    if (status === 'showing-indents') {
      // setTimeout нужен для корректной отработки анимации изменения высоты
      setTimeout(() => {
        this.setState({ status: 'showing-height' });
      }, 0);
    }
  }

  ref = React.createRef();

  timeout = this.getTimeout();

  timerId = 0;

  height = 0;

  remove = () => this.setState({ status: 'hiding' });

  getAnimationEndHandler() {
    const { status } = this.state;

    if (status === 'showing-height') {
      return this.onFadeInAnimationEnd;
    }

    if (status === 'hiding') {
      return this.onFadeOutAnimationEnd;
    }

    return undefined;
  }

  getToastHeight() {
    return this.ref.current.offsetHeight;
  }

  getToastStyles() {
    const { status } = this.state;

    const styles = {};

    if (this.height && status !== 'showing-indents' && status !== 'shown') {
      styles.height = this.height;
    }

    if (status !== 'creating') {
      styles.position = 'relative';
    }

    return styles;
  }

  getModifications() {
    const { status } = this.state;

    return {
      appearing: status === 'showing-indents' || status === 'showing-height',
      'show-animation': status === 'showing-height',
      'hide-animation': status === 'hiding',
    };
  }

  getTimeout() {
    const { allowAutoHiding, timeout } = this.props;

    if (!allowAutoHiding) {
      return undefined;
    }

    return timeout || DEFAULT_TIMEOUT;
  }

  getTitleIcon() {
    const { type } = this.props;
    const icon = TITLE_ICONS[type];

    if (!icon) {
      return null;
    }

    return <Icon data={icon} className={b('icon', { title: true })} />;
  }

  getCloseButton() {
    const { isClosable } = this.props;

    if (!isClosable) {
      return null;
    }

    return (
      <Button
        cls={b('close-btn')}
        style={{
          position: 'absolute',
        }}
        theme="light"
        size="xs"
        view="default"
        tone="default"
        onClick={this.remove}
      >
        <div className={b('close-icon')}>
          <Icon data={closeIcon} />
        </div>
      </Button>
    );
  }

  getActions() {
    const { actions } = this.props;

    if (!actions) {
      return null;
    }

    return actions.map(({ label, onClick }, index) => {
      const onActionClick = () => {
        onClick();
        this.remove();
      };

      return (
        <Link
          key={`${label}__${index}`}
          cls={b('action')}
          theme="normal"
          text={label}
          onClick={onActionClick}
        />
      );
    });
  }

  setTimer() {
    if (!this.timeout) {
      return;
    }

    this.timerId = setTimeout(async () => {
      if (this.ref.current) {
        this.remove();
      }
    }, this.timeout);
  }

  clearTimer() {
    clearTimeout(this.timerId);
    this.timerId = undefined;
  }

  onFadeInAnimationEnd = e => {
    if (e.animationName === FADE_IN_LAST_ANIMATION_NAME) {
      this.setState({ status: 'shown' });
    }
  };

  onFadeOutAnimationEnd = e => {
    const { removeCallback } = this.props;

    if (e.animationName === FADE_OUT_LAST_ANIMATION_NAME) {
      removeCallback();
    }
  };

  onMouseOver = () => {
    if (this.timerId) {
      this.clearTimer();
    }
  };

  onMouseLeave = () => {
    this.setTimer();
  };

  render() {
    const { content, actions, title } = this.props;

    const styles = this.getToastStyles();
    const mods = this.getModifications();
    const animationEndHandler = this.getAnimationEndHandler();

    return (
      <div
        ref={this.ref}
        className={b(mods)}
        style={styles}
        onAnimationEnd={animationEndHandler}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        <div className={b('title', { bold: Boolean(content || actions) })}>
          {this.getTitleIcon()}
          {title}
        </div>
        {this.getCloseButton()}
        {content}
        {this.getActions()}
      </div>
    );
  }
}
