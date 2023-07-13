import { DashKit, pluginTitle, pluginWidget } from '@clustrum-lib-legacy';
import { DashboardControls as pluginControl } from '@clustrum-lib';
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';

DashKit.registerPlugins(pluginTitle, pluginControl, pluginWidget.bindChartKit(ChartKit));

DashKit.setSettings({
  gridLayout: { margin: [8, 8] },
  theme: 'clustrum',
});

export default DashKit;
