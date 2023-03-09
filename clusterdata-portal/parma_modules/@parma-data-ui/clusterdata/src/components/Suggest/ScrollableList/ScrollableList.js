import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import block from 'bem-cn-lite';
import {KeyCodes} from 'constants/common';

// import './ScrollableList.scss';

const b = block('dl-scrollable-list');

export default class ScrollableList extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        itemHeight: PropTypes.number.isRequired,
        renderItem: PropTypes.func.isRequired,
        onAction: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
        onItemClick: PropTypes.func
    };

    static defaultProps = {
        onItemClick: noop
    };

    state = {
        selectedItemIndex: 0
    };

    componentDidMount() {
        this.attachKeyDownListeners();
    }

    componentDidUpdate(prevProps) {
        if (!this.props.visible && prevProps.visible) {
            this.detachKeyDownListeners();
        }

        if (this.props.visible && !prevProps.visible) {
            this.attachKeyDownListeners();
            this.moveToCurrentItem(0);
        }

        if (this.props.visible && prevProps.visible) {
            if (!(isEqual(this.props.data, prevProps.data))) {
                this.moveToCurrentItem(0);
            }
        }
    }

    componentWillUnmount() {
        this.detachKeyDownListeners();
    }

    attachKeyDownListeners() {
        setTimeout(() => {
            window.addEventListener('keydown', this.handleKeyDown);
        }, 0);
    }

    detachKeyDownListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    setContainerRef = (ref) => {
        this.container = ref;
    };

    handleMouseMove = (index) => {
        const {selectedItemIndex} = this.state;

        if (selectedItemIndex !== index) {
            this.setState({selectedItemIndex: index});
        }
    };

    handleKeyDown = (event) => {
        const {data, onAction} = this.props;
        const {selectedItemIndex} = this.state;

        const itemCount = data.length;

        switch (event.keyCode) {
            case KeyCodes.DOWN: {
                event.preventDefault();

                if (selectedItemIndex === itemCount - 1) {
                    this.moveToCurrentItem(0);
                } else {
                    this.moveToCurrentItem(selectedItemIndex + 1);
                }
                break;
            }
            case KeyCodes.UP: {
                event.preventDefault();

                if (selectedItemIndex === 0) {
                    this.moveToCurrentItem(itemCount - 1);
                } else {
                    this.moveToCurrentItem(selectedItemIndex - 1);
                }
                break;
            }
            case KeyCodes.ENTER: {
                event.preventDefault();

                const selectedItem = data[selectedItemIndex];

                onAction(selectedItem);

                break;
            }
            default:
                break;
        }
    };

    handleClick = (index) => {
        const {onItemClick, data} = this.props;
        onItemClick(data[index]);
    };

    moveToCurrentItem = (currentIndex) => {
        this.setState({selectedItemIndex: currentIndex}, this.scrollInnerContainer);
    };

    scrollInnerContainer = () => {
        const {itemHeight} = this.props;
        const {selectedItemIndex} = this.state;

        const offsetCurrentItem = selectedItemIndex * itemHeight;
        const visiblePart = this.container.clientHeight + this.container.scrollTop;
        const visibleItem = offsetCurrentItem + itemHeight;

        if (visibleItem > visiblePart) {
            this.container.scrollTo(0, visibleItem - this.container.clientHeight);
        } else if (offsetCurrentItem < this.container.scrollTop) {
            this.container.scrollTo(0, offsetCurrentItem);
        }
    };

    renderListItem = (data, index) => {
        const {renderItem} = this.props;
        const {selectedItemIndex} = this.state;
        const isSelected = selectedItemIndex === index;

        return (
            <div
                key={index}
                className={b('item', {selected: isSelected})}
                onMouseMove={this.handleMouseMove.bind(this, index)}
                onClick={this.handleClick.bind(this, index)}
            >
                {renderItem(data)}
            </div>
        );
    };

    render() {
        const {data} = this.props;

        return (
            <div className={b()} ref={this.setContainerRef}>
                <div className={b('items')}>
                    {data.map(this.renderListItem)}
                </div>
            </div>
        );
    }

}
