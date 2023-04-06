import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import { WIDGET_TYPE } from '../components/Widget/Widget';
import Table from '../components/Widget/Table/Table';

export default function() {
  ExtensionsManager.add(WIDGET_TYPE.TABLE, Table);
}
