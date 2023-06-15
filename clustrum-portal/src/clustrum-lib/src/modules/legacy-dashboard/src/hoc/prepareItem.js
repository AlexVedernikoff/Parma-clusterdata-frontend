import React from 'react';
import { DashKitContext } from '../context/DashKitContext';
import PropTypes from 'prop-types';

export function prepareItem(Component) {
  return class PrepareItem extends React.Component {
    static contextType = DashKitContext;

    static propTypes = {
      id: PropTypes.string,
      item: PropTypes.object,
      itemDataOnTab: PropTypes.object,
      shouldItemUpdate: PropTypes.bool,
      width: PropTypes.number,
      height: PropTypes.number,
      transform: PropTypes.string,

      forwardedPluginRef: PropTypes.any,
    };

    shouldComponentUpdate(nextProps) {
      const { width, height, transform } = this.props;
      const {
        width: widthNext,
        height: heightNext,
        transform: transformNext,
      } = nextProps;

      if (
        !nextProps.shouldItemUpdate &&
        width === widthNext &&
        height === heightNext &&
        transform === transformNext
      ) {
        return false;
      }

      return true;
    }

    _onStateAndParamsChange = stateAndParams => {
      this.context.onItemStateAndParamsChange(this.props.id, stateAndParams);
    };

    #getOwnWidgetParams = itemId => {
      const { itemsParams } = this.context;
      const ownWidgetParams = new Map();

      for (const itemParamsId in itemsParams) {
        if (itemParamsId === itemId) {
          continue;
        }

        const itemParams = itemsParams[itemParamsId];

        for (const paramId in itemParams) {
          const param = itemParams[paramId];

          if (param.initiatorItem.id === itemId) {
            ownWidgetParams.set(paramId, param.value);
          }
        }
      }

      return ownWidgetParams;
    };

    #exportWidgetFactory = () => {
      const { itemDataOnTab } = this.props;
      const { itemsParams, exportWidget } = this.context;

      return exportWidget
        ? (runPayload, options) =>
            exportWidget(
              runPayload.id,
              itemDataOnTab.title,
              Object.keys(itemsParams),
              options,
            )
        : null;
    };

    render() {
      const { id, width, height, item } = this.props;
      const {
        itemsState,
        itemsParams,
        registerManager,
        context,
        paginateInfo,
        widgetMenu,
        orderBy,
      } = this.context;
      const { type, data, defaults, namespace } = item;
      const ownWidgetParams = this.#getOwnWidgetParams(id);
      const rendererProps = {
        data,
        params: itemsParams[id],
        state: itemsState[id],
        onStateAndParamsChange: this._onStateAndParamsChange,
        widgetMenu,
        width,
        height,
        id,
        defaults,
        namespace,
        context,
        paginateInfo: paginateInfo[id],
        ownWidgetParams,
        exportWidget: this.#exportWidgetFactory(),
        orderBy: orderBy[id],
      };

      return (
        <Component
          forwardedPluginRef={this.props.forwardedPluginRef}
          rendererProps={rendererProps}
          registerManager={registerManager}
          type={type}
        />
      );
    }
  };
}
