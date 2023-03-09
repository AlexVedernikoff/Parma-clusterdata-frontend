import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Button} from 'lego-on-react';
import Item from '../Item/Item';
import {DashKitContext} from '../../context/DashKitContext';

const b = block('dashkit-grid-item');

const IconCog = () => (
    <svg className={b('icon')} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M11.844 16.156a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6-4c0-.029-.004-.058-.004-.087l1.848-.34-.362-1.968-1.852.342a5.992 5.992 0 0 0-1.454-2.246l1.068-1.55-1.646-1.134-1.07 1.55a5.95 5.95 0 0 0-2.528-.567c-.03 0-.058.004-.087.004l-.341-1.848-1.967.363.34 1.851A5.996 5.996 0 0 0 7.546 7.98l-1.55-1.068L4.86 8.558l1.55 1.07a5.95 5.95 0 0 0-.567 2.528c0 .03.004.058.004.087L4 12.584l.362 1.967 1.852-.342a5.992 5.992 0 0 0 1.454 2.246L6.6 18.005l1.646 1.134 1.069-1.55a5.95 5.95 0 0 0 2.529.567c.029 0 .058-.004.087-.004L12.27 20l1.968-.363-.341-1.85a5.996 5.996 0 0 0 2.245-1.455l1.55 1.068 1.134-1.646-1.55-1.069a5.95 5.95 0 0 0 .567-2.529"/>
    </svg>
);
IconCog.displayName = 'Icon';

const IconClose = () => (
    <svg className={b('icon')} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" d="M7.357 7.357l9.286 9.286M16.643 7.357l-9.286 9.286" strokeWidth="2" strokeLinecap="round" fill="none" fillRule="evenodd"/>
    </svg>
);
IconClose.displayName = 'Icon';

const IconOpenEye = () => (
    <svg className={b('icon')} width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" clipRule="evenodd" d="M10.0044 0.5C10.5567 0.5 11.0044 0.947715 11.0044 1.5V3.55076C12.1376 3.66529 13.2103 3.96796 14.1919 4.39979L14.9997 3.27267C15.3214 2.82377 15.9461 2.72068 16.395 3.04241C16.8439 3.36413 16.947 3.98885 16.6253 4.43775L15.956 5.37166C16.3311 5.62372 16.6848 5.89348 17.0145 6.17592C18.7522 7.66445 20 9.66704 20 11.5C20 13.333 18.7522 15.3355 17.0145 16.8241C15.2376 18.3462 12.7639 19.5 10 19.5C7.23586 19.5 4.76222 18.3453 2.98539 16.8229C1.24791 15.3342 0 13.3316 0 11.5C0 9.66837 1.24791 7.66581 2.98539 6.1771C3.43399 5.79273 3.927 5.43181 4.45788 5.10699L3.81904 4.21558C3.49732 3.76668 3.60042 3.14196 4.04933 2.82025C4.49823 2.49853 5.12295 2.60163 5.44466 3.05054L6.274 4.20774C7.12845 3.87733 8.04475 3.6461 9.0044 3.5499V1.5C9.0044 0.947715 9.45212 0.5 10.0044 0.5ZM10 5.50001C7.79359 5.50001 5.76723 6.4273 4.28669 7.69585C2.76682 8.99811 2 10.4955 2 11.5C2 12.5045 2.76682 14.0019 4.28669 15.3042C5.76723 16.5727 7.79359 17.5 10 17.5C12.2066 17.5 14.233 16.5733 15.7134 15.3052C17.2331 14.0034 18 12.506 18 11.5C18 10.494 17.233 8.99657 15.7134 7.69485C14.233 6.42673 12.2066 5.50001 10 5.50001ZM6 11.5C6 9.29088 7.79087 7.50001 10 7.50001C12.2091 7.50001 14 9.29088 14 11.5C14 13.7091 12.2091 15.5 10 15.5C7.79087 15.5 6 13.7091 6 11.5ZM10 9.50001C8.89544 9.50001 8 10.3954 8 11.5C8 12.6046 8.89544 13.5 10 13.5C11.1046 13.5 12 12.6046 12 11.5C12 10.3954 11.1046 9.50001 10 9.50001Z" />
    </svg>
);
IconOpenEye.displayName = 'Icon';

const IconCloseEye = () => (
    <svg className={b('icon')} width="18" height="10" viewBox="0 0 22 10" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M20.4617 0.112943C20.9516 0.367951 21.142 0.971808 20.887 1.46169C20.5072 2.19146 19.942 2.86142 19.2225 3.45109L19.022 3.60776L21.2123 5.79805C21.6028 6.18857 21.6028 6.82173 21.2123 7.21226C20.8518 7.57275 20.2846 7.60048 19.8923 7.29546L19.7981 7.21227L17.2632 4.67823C16.4741 5.05518 15.604 5.35817 14.6786 5.57847L15.49 8.60485C15.633 9.13832 15.3164 9.68665 14.7829 9.82959C14.2876 9.96232 13.7794 9.69882 13.5949 9.23338L13.5582 9.12247L12.6981 5.91294C12.1424 5.97044 11.5749 5.99996 11 5.99996C10.421 5.99996 9.84944 5.97001 9.28995 5.9117L8.42973 9.12249C8.28679 9.65595 7.73845 9.97253 7.20499 9.82959C6.70962 9.69685 6.40127 9.21457 6.4742 8.71923L6.49789 8.60484L7.30952 5.57563C6.38973 5.35585 5.52475 5.05433 4.73982 4.67966L2.20711 7.21227C1.81658 7.60279 1.18342 7.60279 0.792892 7.21227C0.432409 6.85178 0.40468 6.28455 0.709706 5.89226L0.792894 5.79805L2.98004 3.61185C2.91135 3.55904 2.84383 3.50545 2.77752 3.45111C2.05802 2.86144 1.49289 2.19149 1.113 1.46171C0.857983 0.971822 1.04838 0.367963 1.53827 0.112949C2.02815 -0.142065 2.63201 0.0483338 2.88702 0.538218C3.1357 1.01593 3.52611 1.47876 4.04527 1.90423C5.62346 3.19767 8.18918 3.99996 11 3.99996C13.8108 3.99996 16.3766 3.19767 17.9547 1.90422C18.4739 1.47874 18.8643 1.01591 19.113 0.538229C19.368 0.0483419 19.9719 -0.142065 20.4617 0.112943Z" />
    </svg>
);
IconCloseEye.displayName = 'Icon';

class GridItem extends React.PureComponent {
    static contextType = DashKitContext;

    static propTypes = {
        id: PropTypes.string,
        item: PropTypes.object,
        itemDataOnTab: PropTypes.object,
        shouldItemUpdate: PropTypes.bool,

        forwardedPluginRef: PropTypes.any,

        // from react-grid-layout:
        children: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        onMouseDown: PropTypes.func,
        onMouseUp: PropTypes.func,
        onTouchEnd: PropTypes.func,
        onTouchStart: PropTypes.func,
        isHidden: PropTypes.bool,
    }

    _onEditItem = () => {
        const {id} = this.props;
        this.context.editItem(id);
    }

    _onRemoveItem = () => {
        const {id} = this.props;
        this.context.removeItem(id);
    }

    _renderOverlay() {
        const {editMode, onToggleWidgetVisibility} = this.context;
        const {id, isHidden} = this.props;

        if (!editMode || this.props.item.data._editActive) {
            return null;
        }

        return (
            <React.Fragment>
                <div className={b('overlay')}/>
                <div className={b('controls')}>
                    <Button
                        theme="normal"
                        view="default"
                        tone="default"
                        size="s"
                        title={isHidden ? 'Показать виджет' : 'Скрыть виджет'}
                        pin="round-brick"
                        cls={b('button', {'visibility-icon': true, 'visibility-hidden-icon': isHidden})}
                        onClick={() => onToggleWidgetVisibility(id)}
                    >
                        {isHidden ? <IconCloseEye /> : <IconOpenEye />}
                    </Button>
                    <Button
                        theme="normal"
                        view="default"
                        tone="default"
                        size="s"
                        title="Настройки"
                        pin="clear-clear"
                        cls={b('button')}
                        onClick={this._onEditItem}
                    >
                        <IconCog />
                    </Button>
                    <Button
                        theme="normal"
                        view="default"
                        tone="default"
                        size="s"
                        title="Удалить"
                        pin="clear-round"
                        cls={b('button')}
                        onClick={this._onRemoveItem}
                    >
                        <IconClose />
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    render() {
        // из-за бага, что Grid Items unmounts при изменении static, isDraggable, isResaizable
        // https://github.com/STRML/react-grid-layout/issues/721
        const {style, onMouseDown, onMouseUp, onTouchEnd, onTouchStart, children, className, isHidden} = this.props;
        const {editMode} = this.context;

        if (!editMode && isHidden) {
            return null;
        }

        const width = Number.parseInt(style.width, 10);
        const height = Number.parseInt(style.height, 10);
        const transform = style.transform;
        const preparedClassName = editMode ?
            className :
            className.replace('react-resizable', '').replace('react-draggable', '');
        const preparedChildren = editMode ? children : null;
        const reactGridLayoutProps = editMode ? {onMouseDown, onMouseUp, onTouchEnd, onTouchStart} : {};
        const {_editActive} = this.props.item.data;

        const entryId = this.entryId();

        return (
            <div
                data-id={entryId}
                className={b(false, preparedClassName)}
                style={style}
                {...reactGridLayoutProps}
            >
                <div className={b('item', {editMode: editMode && !_editActive})}>
                    <Item
                        id={this.props.id}
                        item={this.props.item}
                        itemDataOnTab={this.props.itemDataOnTab}
                        shouldItemUpdate={this.props.shouldItemUpdate}
                        width={width}
                        height={height}
                        transform={transform}
                        forwardedPluginRef={this.props.forwardedPluginRef}
                    />
                </div>
                {this._renderOverlay()}
                {preparedChildren}
            </div>
        );
    }

    entryId() {
        if (this.props.item.data.dataset) {
            return this.props.item.data.dataset.fieldId;
        }

        if (Array.isArray(this.props.item.data)) {
            return this.props.item.data[0].data.uuid;
        }

        return this.props.id
    }
}

export default React.forwardRef((props, ref) => {
    return <GridItem {...props} forwardedPluginRef={ref}/>;
});
