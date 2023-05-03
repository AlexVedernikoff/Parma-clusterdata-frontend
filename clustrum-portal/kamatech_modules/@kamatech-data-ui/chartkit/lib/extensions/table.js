import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import { WIDGET_TYPE } from '../components/Widget/Widget';
import { TableAdapter as Table } from '../components/Widget/Table/TableAdapter';

export default function() {
  ExtensionsManager.add(WIDGET_TYPE.TABLE, Table);
}
