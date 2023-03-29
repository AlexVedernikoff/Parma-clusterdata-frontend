import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import { WIDGET_TYPE } from '../components/Widget/Widget';
import WikiText from '../components/Widget/WikiText/WikiText';

export default function() {
  ExtensionsManager.add(WIDGET_TYPE.TEXT, WikiText);
}
