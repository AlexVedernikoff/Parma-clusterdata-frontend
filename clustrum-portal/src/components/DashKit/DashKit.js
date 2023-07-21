import { DashKit, pluginTitle, pluginWidget } from '@clustrum-lib-legacy';
import { filterControlsPlugin as pluginControl } from '@entities/filter-controls-container';
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';

DashKit.registerPlugins(pluginTitle, pluginControl, pluginWidget.bindChartKit(ChartKit));

DashKit.setSettings({
  gridLayout: { margin: [8, 8] },
  theme: 'clustrum',
});

export default DashKit;
