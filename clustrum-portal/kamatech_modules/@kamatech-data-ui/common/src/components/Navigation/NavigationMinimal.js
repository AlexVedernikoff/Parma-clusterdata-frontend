import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'lego-on-react';
import cn from 'bem-cn-lite';
import noop from 'lodash/noop';
import NavigationEntries from './NavigationEntries';
import NavigationBreadcrumbs from './NavigationBreadcrumbs/NavigationBreadcrumbs';
import SearchSection from './SearchSection/SearchSection';
import { MODE_MINIMAL, NAVIGATION_ROOT } from './constants';

// import './NavigationMinimal.scss';

const b = cn('yc-navigation-minimal');

class NavigationMinimal extends React.Component {
  static propTypes = {
    anchor: PropTypes.any,
    createType: PropTypes.oneOf(['none', 'button']),
    popupDirections: PropTypes.array,
    hasTail: PropTypes.bool,
    visible: PropTypes.bool,
    path: PropTypes.string,
    className: PropTypes.string,
    clickableScope: PropTypes.string,
    placeholder: PropTypes.string,
    onClose: PropTypes.func,
    onChooseFolder: PropTypes.func,
    onCrumbClick: PropTypes.func,
    getPlaceParameters: PropTypes.func.isRequired,
    placeSelectNode: PropTypes.element,
  };

  static defaultProps = {
    hasTail: false,
    createType: 'none',
    popupDirections: ['bottom-left'],
    onChooseFolder: noop,
    place: NAVIGATION_ROOT,
  };

  static getDerivedStateFromProps(props, state) {
    const { visible } = props;
    if (props.visible === state.visible) {
      return null;
    }
    return {
      visible,
      secondaryOffset: 0,
      tailOffset: 0,
    };
  }

  state = {
    searchValue: '',
  };

  componentDidMount() {
    this.offsetPopupPosition();
  }

  componentDidUpdate() {
    window.requestAnimationFrame(this.offsetPopupPosition);
  }

  refPopup = React.createRef();
  refSearchInput = React.createRef();
  refEntries = React.createRef();

  refresh() {
    if (this.refEntries.current) {
      this.refEntries.current.refresh();
    }
  }

  focusSearchInput = () => {
    if (this.refSearchInput.current) {
      this.refSearchInput.current.focus();
    }
  };

  clearSearchInput = () => this.setState({ searchValue: '' });

  onChangeSearchInput = searchValue => {
    this.setState({ searchValue });

    if (this.refEntries.current) {
      this.refEntries.current.onChangeFilter(searchValue);
    }
  };

  onClickCreate = () => {
    this.refEntries.current.openDialogCreateFolder();
  };

  onClose = event => {
    if (document.body.contains(event.target)) {
      this.props.onClose(event);
    }
  };

  onChooseFolder = event => {
    if (!this.refEntries.current.state.isLoading) {
      this.props.onChooseFolder(this.props.path);
      this.props.onClose(event);
    }
  };

  offsetPopupPosition = () => {
    // offset popup if not in viewport
    if (
      this.props.visible &&
      this.refPopup.current &&
      this.refPopup.current.containerRef.current
    ) {
      const popupComponent = this.refPopup.current;
      const node = popupComponent.containerRef.current;
      const { left, height, top, width } = node.getBoundingClientRect();
      const {
        width: bodyWidth,
        height: bodyHeight,
      } = document.body.getBoundingClientRect();
      let secondaryOffset = 0;
      let tailOffset = 0;
      // REMARK: _direction - доступ к нему костыль
      // в нем содержится информация о наиболее подходящем (по мнению popup) popupDirections
      if (['top', 'bottom'].includes(popupComponent._direction.split('-')[0])) {
        if (left < 0) {
          secondaryOffset = Math.ceil(Math.abs(left));
        } else if (left + width > bodyWidth) {
          secondaryOffset = -Math.ceil(Math.abs(left - width));
        }
        tailOffset = -secondaryOffset;
      } else {
        if (top < 0) {
          // eslint-disable-line no-lonely-if
          secondaryOffset = Math.ceil(Math.abs(top));
        } else if (top + height > bodyHeight) {
          secondaryOffset = -Math.ceil(Math.abs(top - height));
        }
        tailOffset = -secondaryOffset;
      }
      if (secondaryOffset !== 0) {
        this.setState({ secondaryOffset, tailOffset });
      }
    }
  };

  renderFooter() {
    return (
      <div className={b('footer')}>
        <div className={b('button-place')}>
          <Button
            theme="flat"
            width="max"
            view="default"
            tone="default"
            size="n"
            onClick={this.onClose}
            cls={b('button-cancel')}
          >
            Отмена
          </Button>
        </div>
        <div className={b('button-place')}>
          <Button
            theme="action"
            width="max"
            view="default"
            tone="default"
            size="n"
            onClick={this.onChooseFolder}
            cls={b('button-done')}
          >
            Готово
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const {
      popupDirections,
      anchor,
      visible,
      hasTail,
      clickableScope,
      className,
      placeholder,
    } = this.props;
    const { searchValue } = this.state;

    if (!anchor) {
      return null;
    }

    const hasButtonsChoose = clickableScope === 'folder';

    return (
      <Popup
        autoclosable
        motionless
        hasTail={hasTail}
        theme="normal"
        secondaryOffset={this.state.secondaryOffset}
        tailOffset={this.state.tailOffset}
        directions={popupDirections}
        onOutsideClick={this.onClose}
        visible={visible}
        anchor={anchor}
        ref={this.refPopup}
        cls={b('popup')}
      >
        {visible && (
          <div className={b({ clickableScope: clickableScope || 'none' }, className)}>
            <SearchSection
              ref={this.refSearchInput}
              text={searchValue}
              placeholder={placeholder}
              onChange={this.onChangeSearchInput}
            />
            {this.props.placeSelectNode}
            <div className={b('header')}>
              <div className={b('controls')}>
                <NavigationBreadcrumbs
                  size="s"
                  path={this.props.path}
                  place={this.props.place}
                  onClick={this.props.onCrumbClick}
                  getPlaceParameters={this.props.getPlaceParameters}
                />
              </div>
            </div>
            <NavigationEntries
              ref={this.refEntries}
              {...this.props}
              mode={MODE_MINIMAL}
              modalView={true}
              getPlaceParameters={this.props.getPlaceParameters}
              focusSearchInput={this.focusSearchInput}
              clearSearchInput={this.clearSearchInput}
              isPlaceSelectNode={!!this.props.placeSelectNode}
            />
            {hasButtonsChoose && this.renderFooter()}
          </div>
        )}
      </Popup>
    );
  }
}

export default NavigationMinimal;
