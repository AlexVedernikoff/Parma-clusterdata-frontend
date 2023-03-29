import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import { WIDGET_TYPE } from '../components/Widget/Widget';
import Map from '../components/Widget/Map/Map';

export default function() {
  ExtensionsManager.add(WIDGET_TYPE.MAP, Map);
}
