import React from 'react';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import GridItem from '../GridItem/GridItem';
import { DashKitContext } from '../../context/DashKitContext';

import { ITEM_TYPE } from 'clustrum-lib/constants/constants';

const Layout = WidthProvider(ReactGridLayout); // eslint-disable-line new-cap

export default class GridLayout extends React.PureComponent {
  static contextType = DashKitContext;

  constructor(props, context) {
    super(props, context);
    this.pluginsRefs = [];
    this.state = {
      shouldItemUpdate: true,
    };
  }

  componentDidMount() {
    this.reloadItems();
  }

  componentDidUpdate() {
    const { widgetForReloadUUID } = this.context;

    clearTimeout(this._timeout);
    this.reloadItems();

    if (widgetForReloadUUID) {
      this.reloadItem();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  _timeout;

  #getWidgetDataOnTab = ({ id, type, data }) => {
    const { itemsState } = this.context;

    if (type !== ITEM_TYPE.WIDGET) {
      return null;
    }

    const tabId = itemsState[id].tabId;

    return tabId ? data.find(({ id }) => id === tabId) : data[0];
  };

  _findWidgetItemByUuid = uuid => {
    const { config } = this.context;

    return config.items.find(item => {
      const tabData = this.#getWidgetDataOnTab(item);

      return !!(tabData && tabData.data.uuid === uuid);
    });
  };

  reloadItem() {
    const { reloadItem, widgetForReloadUUID, setWidgetForReloadUUID } = this.context;

    if (!widgetForReloadUUID) {
      return;
    }

    const item = this._findWidgetItemByUuid(widgetForReloadUUID);

    if (item) {
      const ref = this.pluginsRefs.find(ref => ref.props.id === item.id);

      if (ref) {
        reloadItem(ref);
      }
    }

    setWidgetForReloadUUID('');
  }

  reloadItems() {
    const { editMode, settings, reloadItems } = this.context;
    const autoupdateIntervalNumber = Number(settings.autoupdateInterval);
    if (autoupdateIntervalNumber) {
      this._timeout = setTimeout(() => {
        if (!editMode) {
          reloadItems(this.pluginsRefs);
        }
        this.reloadItems();
      }, autoupdateIntervalNumber * 1000);
    }
  }

  _onStart = () => {
    this.setState({ shouldItemUpdate: false });
  };

  _onStop = () => {
    this.setState({ shouldItemUpdate: true });
  };

  _layoutChange = libLayout => {
    const { layout, layoutChange } = this.context;
    const updatedLayout = libLayout.map(libLayoutItem => {
      const layoutItem = layout.find(l => l.i === libLayoutItem.i);
      const isHidden = layoutItem && layoutItem.isHidden;
      return {
        ...libLayoutItem,
        isHidden,
      };
    });
    layoutChange(updatedLayout);
  };

  render() {
    const { layout, config, registerManager } = this.context;
    this.pluginsRefs.length = config.items.length;
    return (
      <Layout
        {...registerManager.gridLayout}
        layout={layout}
        onLayoutChange={this._layoutChange}
        onDragStart={this._onStart}
        onDragStop={this._onStop}
        onResizeStart={this._onStart}
        onResizeStop={this._onStop}
      >
        {config.items
          .filter(item => layout.find(l => l.i === item.id))
          .map((item, i) => {
            const layoutItem = layout.find(l => l.i === item.id);
            const isHidden = layoutItem && layoutItem.isHidden;
            return (
              <GridItem
                ref={pluginRef => {
                  this.pluginsRefs[i] = pluginRef;
                }} // forwarded ref to plugin
                key={item.id}
                id={item.id}
                item={item}
                itemDataOnTab={this.#getWidgetDataOnTab(item)}
                isHidden={isHidden}
                shouldItemUpdate={this.state.shouldItemUpdate}
              />
            );
          })}
      </Layout>
    );
  }
}
