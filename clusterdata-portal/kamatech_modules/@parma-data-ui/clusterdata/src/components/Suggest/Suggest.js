import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import noop from 'lodash/noop';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { TextInput } from 'lego-on-react';
import ScrollableList from './ScrollableList/ScrollableList';
import { Loader } from '@parma-data-ui/common/src';

// import './Suggest.scss';

const CONST = {
  ITEM_HEIGHT: 50,
  DEBOUNCE_DURATION: 300,
};

const b = block('dl-suggest');

export default class Suggest extends React.Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])).isRequired,
    emptyItem: PropTypes.element,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
    filterBy: PropTypes.string, // to make filtering work, you have to specify this if data is array of objects
    onChange: PropTypes.func,
    onAction: PropTypes.func,
    onItemClick: PropTypes.func,
    itemHeight: PropTypes.number,
    debounceDuration: PropTypes.number,
    inputProps: PropTypes.object,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    onChange: noop,
    onAction: noop,
    onItemClick: noop,
    itemHeight: CONST.ITEM_HEIGHT,
    debounceDuration: CONST.DEBOUNCE_DURATION,
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      omnibarVisible: false,
    };
    this.giveBackText = debounce(this.giveBackText, props.debounceDuration);
  }

  componentDidUpdate(prevProps, prevState) {
    const { omnibarVisible: omnibarVisiblePrev } = prevState;
    const { omnibarVisible } = this.state;

    if (omnibarVisible && !omnibarVisiblePrev) {
      this.attachClickListeners();
    } else if (!omnibarVisible && omnibarVisiblePrev) {
      this.detachClickListeners();
    }
  }

  componentWillUnmount() {
    this.detachClickListeners();
  }

  attachClickListeners() {
    window.addEventListener('click', this.handleOutsideClick);
  }

  detachClickListeners() {
    window.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = event => {
    const container = this.containerRef;

    if (container && !container.contains(event.target)) {
      this.hideOmnibar();
    }
  };

  showOmnibar = () => {
    this.setState({ omnibarVisible: true });
  };

  hideOmnibar = () => {
    this.setState({ omnibarVisible: false });
  };

  handleChange = text => {
    this.setState({ text }, this.giveBackText);
  };

  giveBackText = () => {
    const { onChange } = this.props;
    onChange(this.state.text);
  };

  handleFocus = () => {
    if (!this.state.omnibarVisible) {
      this.showOmnibar();
    }
  };

  handleOmnibarClick = item => {
    this.setState(
      {
        text: this.onActionGetText(item),
        omnibarVisible: false,
      },
      () => this.props.onAction(item),
    );
    this.blur();
  };

  onItemClick = item => {
    this.setState(
      {
        text: this.onActionGetText(item),
        omnibarVisible: false,
      },
      () => this.props.onItemClick(item),
    );
    this.blur();
  };

  blur() {
    if (this.inputRef) {
      this.inputRef.blur();
    }
  }

  clear = () => {
    const { onChange } = this.props;
    this.setState({ text: '' }, () => {
      onChange(this.state.text);
    });
  };

  onActionGetText(item) {
    const { filterBy } = this.props;
    let text;

    if (typeof item === 'string') {
      text = item;
    } else if (filterBy && item[filterBy]) {
      text = item[filterBy];
    }
    return text;
  }

  getListItems() {
    const { data } = this.props;

    if (!data.length) {
      return [];
    }

    return data;
  }

  setContainerRef = ref => {
    this.containerRef = ref;
  };

  setInputRef = ref => {
    if (!this.inputRef) {
      this.inputRef = ref;
    }
  };

  renderEmptyItem() {
    const { emptyItem } = this.props;
    const { text } = this.state;
    return emptyItem && text ? emptyItem : null;
  }

  renderLoader() {
    const { text } = this.state;
    return text ? (
      <div className={b('loader')}>
        <Loader size="s" />
      </div>
    ) : null;
  }

  renderList() {
    const { renderItem, itemHeight, isLoading } = this.props;
    const { omnibarVisible } = this.state;
    const data = this.getListItems();

    if (isLoading) {
      return this.renderLoader();
    } else if (isEmpty(data)) {
      return this.renderEmptyItem();
    } else {
      return (
        <ScrollableList
          data={data}
          renderItem={renderItem}
          onAction={this.handleOmnibarClick}
          onItemClick={this.onItemClick}
          itemHeight={itemHeight}
          visible={omnibarVisible}
        />
      );
    }
  }

  render() {
    const { omnibarVisible, text } = this.state;
    const { disabled, inputProps, className } = this.props;

    return (
      <div className={b(false, className)} ref={this.setContainerRef}>
        <TextInput
          theme="normal"
          size="m"
          view="default"
          tone="default"
          text={text}
          type="text"
          ref={this.setInputRef}
          disabled={disabled}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          hasClear
          {...inputProps}
        />
        <div className={b('omnibar', { visible: omnibarVisible && 'yes' })}>{this.renderList()}</div>
      </div>
    );
  }
}
