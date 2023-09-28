import React from 'react';
import PropTypes from 'prop-types';
import { RegisterManager } from '../../modules/register-manager/register-manager';
import DashKitView from '../DashKitView/DashKitView';
import { UpdateManager } from '../../modules/update-manager/update-manager';
import noop from 'lodash/noop';
import { LAYOUT_ID } from '../../../../../../../constants/constants';

const registerManager = new RegisterManager();

export class DashKit extends React.PureComponent {
  static registerPlugins(...plugins) {
    plugins.forEach(plugin => {
      registerManager.addItem(plugin);
    });
  }

  static setSettings(settings) {
    registerManager.setSettings(settings);
  }

  static setItem({ item, namespace = 'default', config, layout = {}, layoutId }) {
    if (item.id) {
      return UpdateManager.editItem({
        item,
        namespace,
        config,
        layoutId,
        defaultLayout: { ...registerManager.getItem(item.type).defaultLayout, ...layout },
      });
    } else {
      return UpdateManager.addItem({
        item,
        namespace,
        config,
        layoutId,
        defaultLayout: { ...registerManager.getItem(item.type).defaultLayout, ...layout },
      });
    }
  }

  static removeItem({ id, config, itemsStateAndParams, layoutId = LAYOUT_ID.DASHBOARD }) {
    return UpdateManager.removeItem({ id, config, itemsStateAndParams, layoutId });
  }

  render() {
    return <DashKitView {...this.props} registerManager={registerManager} />;
  }
}

DashKit.propTypes = {
  editMode: PropTypes.bool,
  config: PropTypes.shape({
    salt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    counter: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        type: PropTypes.string.isRequired,
        defaults: PropTypes.object,
        namespace: PropTypes.string,
      }),
    ).isRequired,
    layout: PropTypes.arrayOf(
      PropTypes.shape({
        i: PropTypes.string.isRequired,
        h: PropTypes.number.isRequired,
        w: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
    ).isRequired,
    ignores: PropTypes.arrayOf(
      PropTypes.shape({
        who: PropTypes.string.isRequired,
        whom: PropTypes.string.isRequired,
      }),
    ).isRequired,
    aliases: PropTypes.any, // TODO при внедрении TypeScript, типизировать ([strings] | "") возможно, пустая строка должна валидироваться в пустой массив
  }).isRequired,
  onItemEdit: PropTypes.func,
  onChange: PropTypes.func,
  widgetMenu: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.element,
      isVisible: PropTypes.func.isRequired,
      action: PropTypes.func.isRequired,
    }),
  ),
  context: PropTypes.object,
  settings: PropTypes.object,
  itemsStateAndParams: PropTypes.objectOf(
    PropTypes.shape({
      state: PropTypes.object,
      params: PropTypes.object,
    }),
  ),
  widgetForReloadUUID: PropTypes.string,
  setWidgetForReloadUUID: PropTypes.func,
  layoutId: PropTypes.string,
  exportWidget: PropTypes.func,
};

DashKit.defaultProps = {
  onItemEdit: noop,
  onChange: noop,
  itemsStateAndParams: {},
  settings: {},
};
