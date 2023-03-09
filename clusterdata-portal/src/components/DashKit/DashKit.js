import DashKit from '@parma-data-ui/dashkit';
import pluginText from '@parma-data-ui/dashkit/src/plugins/Text/Text';
import pluginTitle from '@parma-data-ui/dashkit/src/plugins/Title/Title';
import pluginWidget from '@parma-data-ui/dashkit/src/plugins/Widget/Widget';
import pluginControl from './plugins/Control/Control';
import ChartKit from '@parma-data-ui/clusterdata/src/components/ChartKit/ChartKit';
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
  theme: 'clusterdata',
});

export default DashKit;
