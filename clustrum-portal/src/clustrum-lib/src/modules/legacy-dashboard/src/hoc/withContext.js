import React from 'react';
import { DashKitContext } from '../context/DashKitContext';
import { UpdateManager } from '../modules/update-manager/update-manager';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { matchParamsWithAliases } from '../modules/utils';
import { convertDateToString } from '@lib-shared/ui/filter-controls-factory';
const START_ROLE = 'control';

/**
 * todo хорошо бы отказаться от контекста, уже есть стейт редакса, нет причин делать дополнительный стейт.
 * Сейчас картина такая - есть редакс на верхнем слое приложения, а все остальное приложение ориентируется на контекст DashKitContext со сложным хелпером update-manager
 * Было бы лучше если были бы отдельные акшны и селекторы которые отвечают за что-то одно (не пытаться складировать всю логику в одно место)
 */
export function withContext(Component) {
  return class DashKitWithContext extends React.Component {
    static propTypes = {
      editMode: PropTypes.bool,
      context: PropTypes.object,
      config: PropTypes.object,
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
      itemsStateAndParams: PropTypes.object,
      registerManager: PropTypes.object,
      layout: PropTypes.array,
      widgetForReloadUUID: PropTypes.string,
      setWidgetForReloadUUID: PropTypes.func,
      layoutId: PropTypes.string,
      exportWidget: PropTypes.func,
    };

    _onChange({
      config = this.props.config,
      itemsStateAndParams = this.props.itemsStateAndParams,
    }) {
      this.props.onChange({
        config,
        itemsStateAndParams,
      });
    }

    _onLayoutChange = layout => {
      const { layoutId } = this.props;
      const newConfig = UpdateManager.updateLayout({
        layout,
        config: this.props.config,
        layoutId,
      });
      if (!isEqual(newConfig[layoutId], this.props.config[layoutId])) {
        this._onChange({
          config: newConfig,
        });
      }
    };

    _onItemRemove = id => {
      const { config, itemsStateAndParams, layoutId } = this.props;
      this._onChange(
        UpdateManager.removeItem({ id, config, itemsStateAndParams, layoutId }),
      );
    };

    _onItemEdit = id => {
      const { layoutId } = this.props;
      this.props.onItemEdit({ id, layoutId });
    };

    _onItemStateAndParamsChange = (id, stateAndParams) => {
      const { config, itemsStateAndParams } = this.props;

      this._onChange({
        itemsStateAndParams: UpdateManager.changeStateAndParams({
          id,
          config,
          stateAndParams,
          itemsStateAndParams,
        }),
      });
    };

    _prerenderItems(items) {
      const { registerManager } = this.props;
      return items.map(item => {
        const { type } = item;
        const plugin = registerManager.getItem(type);
        return typeof plugin.prerenderMiddleware === 'function'
          ? plugin.prerenderMiddleware(item)
          : item;
      });
    }

    /**
     * todo: архитектурный костыль
     * Cейчас некоторые значения params хранятся в стейте редакса, а если их нет в _itemsParams добавляются в params дефолтные значения.
     * Получается что в приложении два РАЗНЫХ стейта для params (редакс + стейт компонента).
     * Нужно перенести логику дефолтных значений в стейт редакса после загрузки дашборда
     */
    get _itemsParams() {
      const { config, itemsStateAndParams } = this.props;
      const roleKey = 'type';
      const items = this._prerenderItems(config.items);
      const controlsDefaults = items
        .filter(item => item[roleKey] === START_ROLE)
        .reduce((acc, item) => {
          const { namespace, id, defaults } = item;
          const value = { id, defaults, initiatorItem: item };
          acc[namespace] = acc[namespace] ? acc[namespace].concat(value) : [value];
          return acc;
        }, {});
      const { aliases } = config;
      return items.reduce((params, item) => {
        const { id: itemId, data: itemData, namespace: itemNamespace } = item;
        const controlsDefaultsByNamespace = controlsDefaults[itemNamespace] || [];
        const ignoreIds = config.ignores
          .filter(
            ({ who }) =>
              who === itemId ||
              (Array.isArray(itemData) &&
                itemData.findIndex(({ id }) => id === who) !== -1),
          )
          .map(({ whom }) => whom);

        params[itemId] = Object.assign(
          {},
          controlsDefaultsByNamespace.reduceRight((acc, control) => {
            const { id, defaults, initiatorItem } = control;

            const processedDefaults = Object.keys(defaults).reduce((res, key) => {
              if (
                initiatorItem.type === 'control' &&
                initiatorItem.data.control.elementType === 'date'
              ) {
                return {
                  ...res,
                  [key]: convertDateToString(
                    defaults[key],
                    initiatorItem.data.control.isRange,
                  ),
                };
              }
              return { ...res, [key]: defaults[key] };
            }, {});

            if (!ignoreIds.includes(id)) {
              Object.assign(
                acc,
                matchParamsWithAliases({
                  aliases,
                  namespace: itemNamespace,
                  params: processedDefaults,
                  initiatorItem,
                }),
              );
            }
            return acc;
          }, {}),
          (itemsStateAndParams[itemId] && itemsStateAndParams[itemId].params) || {},
        );

        return params;
      }, {});
    }

    get _itemsState() {
      const { config, itemsStateAndParams } = this.props;
      return config.items.reduce((acc, { id }) => {
        acc[id] = (itemsStateAndParams[id] && itemsStateAndParams[id].state) || {};
        return acc;
      }, {});
    }

    get _paginateInfo() {
      const { config, itemsStateAndParams } = this.props;
      return config.items.reduce((acc, { id }) => {
        const paginateInfo = itemsStateAndParams[id]?.paginateInfo;
        if (!paginateInfo) {
          return acc;
        }
        acc[id] = paginateInfo;
        return acc;
      }, {});
    }

    get _orderBy() {
      const { config, itemsStateAndParams } = this.props;
      return config.items.reduce((acc, { id }) => {
        acc[id] = (itemsStateAndParams[id] && itemsStateAndParams[id].orderBy) || null;
        return acc;
      }, {});
    }

    _getItemsMeta = pluginsRefs => {
      return pluginsRefs
        .map(ref => {
          if (!(ref && typeof ref.getMeta === 'function')) {
            return undefined;
          }
          return ref.getMeta();
        })
        .filter(Boolean);
    };

    _reloadItem = ref => {
      if (ref.reload) {
        ref.reload();
      }
    };

    _reloadItems = pluginsRefs => {
      pluginsRefs.forEach(ref => this._reloadItem(ref));
    };

    get _contextValue() {
      const {
        layout,
        config,
        context,
        editMode,
        settings,
        registerManager,
        widgetMenu,
        widgetForReloadUUID,
        setWidgetForReloadUUID,
        exportWidget,
      } = this.props;

      return {
        layout: layout,
        config: config,
        context: context,
        editMode: editMode,
        settings: settings,
        itemsState: this._itemsState,
        itemsParams: this._itemsParams,
        registerManager: registerManager,
        widgetMenu: widgetMenu,
        onItemStateAndParamsChange: this._onItemStateAndParamsChange,
        onToggleWidgetVisibility: this.props.onToggleWidgetVisibility,
        removeItem: this._onItemRemove,
        editItem: this._onItemEdit,
        layoutChange: this._onLayoutChange,
        getItemsMeta: this._getItemsMeta,
        reloadItem: this._reloadItem,
        reloadItems: this._reloadItems,
        paginateInfo: this._paginateInfo,
        orderBy: this._orderBy,
        widgetForReloadUUID,
        setWidgetForReloadUUID,
        exportWidget,
      };
    }

    render() {
      return (
        <DashKitContext.Provider value={this._contextValue}>
          <Component />
        </DashKitContext.Provider>
      );
    }
  };
}
