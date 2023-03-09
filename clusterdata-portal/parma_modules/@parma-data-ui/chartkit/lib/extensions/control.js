import ExtensionsManager from '../modules/extensions-manager/extensions-manager';

import {WIDGET_TYPE} from '../components/Widget/Widget';
import Control from '../components/Widget/Control/Control';

export default function () {
    ExtensionsManager.add(WIDGET_TYPE.CONTROL, Control);
}
