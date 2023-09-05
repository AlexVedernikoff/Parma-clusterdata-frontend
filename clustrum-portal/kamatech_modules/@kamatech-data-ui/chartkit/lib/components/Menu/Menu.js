import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Dropdown, Button, Popup, Menu as LegoMenu } from 'lego-on-react';

import withErrorBoundary from '../ErrorBoundary/withErrorBoundary';
import { extend } from '../Icon/Icon';
import { EllipsisOutlined } from '@ant-design/icons';
import { ANT_TOKEN } from '@shared/config/theme';

// import './Menu.scss';

/* eslint-disable max-len */
extend({
  dots: (
    <path d="M14 6.125a1.874 1.874 0 1 1 .001 3.749A1.874 1.874 0 0 1 14 6.125zm-5.906 0a1.874 1.874 0 1 1 0 3.749 1.874 1.874 0 0 1 0-3.749zM2 6.125a1.874 1.874 0 1 1 .001 3.749A1.874 1.874 0 0 1 2 6.125z" />
  ),
});
/* eslint-enable max-len */

const b = block('chartkit-menu');

class Menu extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        icon: PropTypes.element,
        isVisible: PropTypes.func.isRequired,
        action: PropTypes.func.isRequired,
      }),
    ).isRequired,
    data: PropTypes.shape({
      loadedData: PropTypes.object,
      propsData: PropTypes.object.isRequired,
      widget: PropTypes.object,
      widgetData: PropTypes.object,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    runPayload: PropTypes.object.isRequired,
    exportWidget: PropTypes.func,
  };

  dropdownRef = React.createRef();
  modalRef = React.createRef();

  render() {
    const { items, data, onChange, runPayload, exportWidget } = this.props;

    return (
      <React.Fragment>
        <Dropdown
          theme="clear"
          view="default"
          tone="default"
          size="s"
          cls={b('button')}
          ref={this.dropdownRef}
          switcher={
            <Button>
              <EllipsisOutlined color={ANT_TOKEN.token.colorPrimary} />
            </Button>
          }
          popup={
            <Popup hiding autoclosable onOutsideClick={() => {}}>
              <LegoMenu
                theme="normal"
                tone="default"
                view="default"
                size="s"
                type="navigation"
              >
                {items
                  .filter(({ isVisible }) => {
                    try {
                      return isVisible(data);
                    } catch (error) {
                      console.error('MENU_ITEM_IS_VISIBLE', error);
                      return false;
                    }
                  })
                  .map(({ title, icon, action }, index) => (
                    <LegoMenu.Item
                      key={`${index}-${title.toString()}`}
                      onClick={event => {
                        action({
                          ...data,
                          runPayload,
                          event,
                          onChange,
                          anchorNode: this.modalRef.current,
                          exportWidget,
                        });
                        // legohack: закрываем открытый dropdown,
                        // т.к. иначе он открыт до момента клика снаружи
                        this.dropdownRef.current._onOutsideClick();
                      }}
                    >
                      <div className={b('item')}>
                        <span className={b('icon')}>{icon}</span>
                        <span className={b('title')}>{title.toString()}</span>
                      </div>
                    </LegoMenu.Item>
                  ))}
              </LegoMenu>
            </Popup>
          }
        />
        <div className={b('modal-anchor')} ref={this.modalRef} />
      </React.Fragment>
    );
  }
}

export default withErrorBoundary(null)(Menu);
