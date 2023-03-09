import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import {WIDGET_TYPE} from '../components/Widget/Widget';
import Metric from '../components/Widget/Metric/Metric';

export default function () {
    ExtensionsManager.add(WIDGET_TYPE.METRIC, Metric);
}
