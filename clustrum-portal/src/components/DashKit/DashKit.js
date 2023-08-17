import { DashKit, pluginTitle, pluginWidget } from '@clustrum-lib-legacy';
import { FilterControlsContainer } from '@clustrum-lib';
import { ItemType } from '@clustrum-lib/shared/types';
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';

const pluginControl = {
  type: ItemType.Control,
  defaultLayout: { w: 8, h: 4 },
  renderer: props => FilterControlsContainer(props),
};

DashKit.registerPlugins(pluginTitle, pluginControl, pluginWidget.bindChartKit(ChartKit));

DashKit.setSettings({
  gridLayout: { margin: [8, 8] },
  theme: 'clustrum',
});

export default DashKit;
