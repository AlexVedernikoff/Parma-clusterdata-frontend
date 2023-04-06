import DashKit from '@kamatech-data-ui/dashkit';
import pluginText from '@kamatech-data-ui/dashkit/src/plugins/Text/Text';
import pluginTitle from '@kamatech-data-ui/dashkit/src/plugins/Title/Title';
import pluginWidget from '@kamatech-data-ui/dashkit/src/plugins/Widget/Widget';
import pluginControl from './plugins/Control/Control';
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';
import { SDK } from '../../modules/sdk';

DashKit.registerPlugins(
  pluginTitle,
  pluginText.setSettings({
    apiHandler({ text }) {
      return SDK.renderMarkdown({ text });
    },
  }),
  pluginControl,
  pluginWidget.bindChartKit(ChartKit),
);

DashKit.setSettings({
  gridLayout: { margin: [8, 8] },
  theme: 'clustrum',
});

export default DashKit;
