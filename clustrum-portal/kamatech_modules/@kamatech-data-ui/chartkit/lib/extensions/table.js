import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import { WIDGET_TYPE } from '../components/Widget/Widget';
import { Table } from '@clustrum-lib/shared/ui/widgets/table-widget/Table';

export default function () {
  ExtensionsManager.add(WIDGET_TYPE.TABLE, Table);
}
